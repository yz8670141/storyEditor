import { onMounted, onUnmounted, nextTick, watch } from 'vue'
import { fabric } from 'fabric'
import { useStoryPagesStore } from '@/stores/useStoryPagesStore'
import debounce from 'lodash.debounce'
import { savePageToDB, getPageFromDB, savePageImageWhenIdle } from '@/utils/imageDB'
import { ensurePassiveWheel } from '@/utils/ensurePassiveWheel'
export function useFabricCanvas(canvasRef) {
  let canvas = null
  const store = useStoryPagesStore()

  const deleteIcon = new Image()
  deleteIcon.src = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2210%22%20fill%3D%22%23F44336%22/%3E%3Cpath%20d%3D%22M8%208l8%208M16%208l-8%208%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22/%3E%3C/svg%3E'

  const deleteObjectHandler = (eventData, transform) => {
    const target = transform.target
    const canvas = target.canvas
    canvas.remove(target)
    canvas.requestRenderAll()
    updateCurrentPageJSON()
    return true
  }


  const createDeleteControl = () => new fabric.Control({
    positionHandler: function (dim, finalMatrix, fabricObject) {
      const corner = fabric.util.transformPoint(
        {
          x: fabricObject.width / 2,
          y: -fabricObject.height / 2
        },
        fabric.util.multiplyTransformMatrices(
          fabricObject.calcTransformMatrix(),
          canvas.viewportTransform
        )
      )
      return corner
    },
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObjectHandler,
    render: renderDeleteIcon,
    cornerSize: 24
  })
  const renderDeleteIcon = function (ctx, left, top, styleOverride, fabricObject) {
    const size = this.cornerSize
    ctx.save()
    ctx.translate(left, top)
    ctx.drawImage(deleteIcon, -size / 2, -size / 2, size, size)
    ctx.restore()
  }
  const updateCurrentPageJSON = debounce(async () => {
    const current = store.currentIndex
    const page = store.pages[current]
    if (page) {
      const json = saveJSON()
      const image = exportImage()
      const updated = { id: page.id, json, image }
      await savePageToDB(updated)
      store.updatePage(current, { json, image })
    }
  }, 300)

  function initCanvas() {
    nextTick(() => {
      const el = canvasRef.value
      if (!el || !(el instanceof HTMLCanvasElement)) return
      const wrapper = el.parentElement
      const width = wrapper?.clientWidth || 960
      const height = width * 0.66

      // 同步 DOM canvas 實際尺寸
      el.width = width
      el.height = height

      canvas = new fabric.Canvas(el, {
        backgroundColor: '#fff',
        selection: true,
        preserveObjectStacking: true,
        enableRetinaScaling: false,
      })

      canvas.setWidth(width)
      canvas.setHeight(height) 
      canvas.on('object:scaling', updateCurrentPageJSON)
      canvas.on('object:rotating', updateCurrentPageJSON)
      canvas.on('object:moving', updateCurrentPageJSON)
      canvas.on('object:modified', updateCurrentPageJSON)
      canvas.on('text:changed', () => {
        const obj = canvas.getActiveObject()

        if (obj?.type === 'textbox') shrinkToFit(obj)
      })
      ensurePassiveWheel(canvas.wrapperEl)
    })
  }

  function waitUntilCanvasReady(callback) {
    nextTick(() => {
      if (canvas instanceof fabric.Canvas) callback(canvas)
    })
  }

  function resizeCanvas() {
    if (!canvas) return
    canvas.dispose()
    canvas = null
    initCanvas()
  }

  function clearCanvas() {
    if (canvas) {
      canvas.clear()
      canvas.setBackgroundColor('#fff', canvas.renderAll.bind(canvas))
      updateCurrentPageJSON()
    }
  }
   function clearPreCanvas() {
    if (canvas) {
      canvas.clear()
      canvas.setBackgroundColor('#fff', canvas.renderAll.bind(canvas))
    }
  }

  function addText(text = 'Hello', options = {}) {
    if (!text.trim()) return false
    waitUntilCanvasReady((cv) => {
      const textbox = new fabric.Textbox(text.trim(), {
        fontSize: 24,
        left: 100,
        top: 100,
        padding: 8,
        hasControls: true,
        selectable: true,
        evented: true,
        ...options
      })
      textbox.controls = {
        ...fabric.Textbox.prototype.controls,
        deleteControl: createDeleteControl(),
      }
      cv.add(textbox)
      cv.setActiveObject(textbox)
      cv.renderAll()
      updateCurrentPageJSON()
    })
    return true
  }

  const _shrinkToFit = (textbox) => {
    requestAnimationFrame(() => {
      const ctx = document.createElement('canvas').getContext('2d')
      ctx.font = `${textbox.fontSize}px ${textbox.fontFamily || 'sans-serif'}`
      const lines = textbox.text.split('\n')
      const measuredWidth = Math.max(...lines.map(line => ctx.measureText(line).width))
      const padding = textbox.padding ?? 0
      const stroke = textbox.strokeWidth ?? 0
      const desiredWidth = Math.max(50, measuredWidth + padding * 2 + stroke)

      if (Math.abs(desiredWidth - textbox.width) > 1) {
        textbox.set({ width: desiredWidth })
        textbox.setCoords()
        canvas.requestRenderAll()
        updateCurrentPageJSON()
      }
    })
  }
  const shrinkToFit = debounce(_shrinkToFit, 300)

  function addImageFromFile(file) {
    if (!file) return
    waitUntilCanvasReady((cv) => {
      const reader = new FileReader()
      reader.onload = () => {
        fabric.Image.fromURL(reader.result, (img) => {
          img.set({
            left: 0,
            top: 0,
            scaleX: cv.getWidth() / img.width,
            scaleY: cv.getHeight() / img.height,
          })
          img.controls = {
            ...fabric.Image.prototype.controls,
            deleteControl: createDeleteControl(),
          }
          cv.add(img)
          cv.setActiveObject(img)
          cv.renderAll()
          updateCurrentPageJSON()
        })
      }
      reader.readAsDataURL(file)
    })
  }

  function exportImage() {
    return canvas?.toDataURL('image/jpeg', 0.6)
  }

  function saveJSON() {
    return canvas?.toJSON()
  }

  function loadJSON(json) {
    if (!canvas || !json) return
    canvas.loadFromJSON(json, () => {
      canvas.getObjects().forEach(obj => {
        obj.controls = {
          ...fabric.Object.prototype.controls,
          deleteControl: createDeleteControl(),
        }
      })
      canvas.renderAll()
    })
  }

  watch(() => store.currentIndex, async (newIndex) => {
    console.log("newIndex",newIndex)
    console.log("store.pages",store.pages[newIndex])
    const page = store.pages[newIndex]
    
   
    if (!page) return

    clearCanvas()
    // const pageData = await getPageFromDB(page.id)
    // if (!pageData) return
    console.log("page",page)
    store.updatePage(newIndex, {
      json: page.value.json,
      image: page.value.image,
    })

    if (pageData.json) loadJSON(pageData.json)
  })

  onMounted(() => {
    window.addEventListener('resize', resizeCanvas)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas)
    if (canvas) {
      canvas.dispose()
      canvas = null
    }
  })

  return {
    initCanvas,
    waitUntilCanvasReady,
    addText,
    addImageFromFile,
    clearCanvas,
    clearPreCanvas,
    exportImage,
    saveJSON,
    loadJSON,
  }
}
