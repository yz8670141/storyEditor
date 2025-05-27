import { fabric } from 'fabric'
import * as THREE from 'three'

export async function createCanvasTextureFromPage(page) {
  const fabricCanvas = new fabric.StaticCanvas(null, {
    // width: 960,
    // height: 640,
    backgroundColor: page?.json?.background || '#fff',
  })

  return new Promise((resolve) => {
    fabricCanvas.loadFromJSON(page.json, () => {
      fabricCanvas.renderAll()

      const canvas = document.createElement('canvas')
      canvas.width = fabricCanvas.width
      canvas.height = fabricCanvas.height
      const ctx = canvas.getContext('2d')
      
      ctx.drawImage(fabricCanvas.lowerCanvasEl, 0, 0)

      if (page.image) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(new THREE.CanvasTexture(canvas))
        }
        img.src = page.image
      } else {
        resolve(new THREE.CanvasTexture(canvas))
      }
    })
  })
}
