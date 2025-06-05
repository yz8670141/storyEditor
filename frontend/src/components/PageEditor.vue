<script setup>
import PageList from '@/components/PageList.vue'
import router from '@/router/router'
import { ref, onMounted, computed } from 'vue'
import { useStoryPagesStore } from '@/stores/useStoryPagesStore'
import { useFabricCanvas } from '@/composables/useFabricCanvas'
import ModalTeleport from '@/components/ModalTeleport.vue'
import Loading from '@/components/Loading.vue'

defineOptions({ name: 'PageEditor' })
const canvasRef = ref(null)
const text = ref('')
const fileInput = ref(null)
const showModal = ref(false)
const store = useStoryPagesStore()

const {
  initCanvas,
  addText,
  addImageFromFile,
  clearCanvas,
  exportImage,
} = useFabricCanvas(canvasRef)

onMounted(() => {
  initCanvas()
})

function handleAddText() {
  const success = addText(text.value)
  if (success) {
    text.value = ''
  }
}

function handleImageUpload(e) {
  const file = e.target.files[0]
  if (file) {
    addImageFromFile(file)
    fileInput.value.value = ''
  }
}

function handleAddPage() {
  const image = exportImage()
  store.addPage({ json: null, image })

}

function goBook() {
  router.push('/bookViewer')
}

const currentPageIndex = computed(() => {
  return store.currentIndex === null
})
function clearAllCanvas() {
  showModal.value = true
}
function handleClearCanvas() {
  showModal.value = false
  store.removePage(store.currentIndex)
  clearCanvas()
}
</script>

<template>
  <div> 
  <Loading v-if="store.loading" />
   <div v-else class="editor-wrapper container px-3">

      <h4 class="fw-bold text-primary text-center text-md-start">🎨 頁面編輯區</h4>

      <div class="row g-4">
        <!-- 畫布區 -->
        <div class="col-12 col-lg-9">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body d-flex justify-content-center">
              <div class="canvas-wrapper">
                <canvas ref="canvasRef" class="canvas-area"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- 工具列 -->
        <div class="col-12 col-lg-3">
          <div class="card shadow-sm p-3 border-0 h-100">
            <div class="mb-3">
              <label class="form-label fw-semibold">上傳圖片</label>
              <input type="file" class="form-control" @change="handleImageUpload" ref="fileInput"
                :disabled="currentPageIndex" />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">頁面文字</label>
              <textarea v-model.trim="text" rows="3" class="form-control" @keyup.enter="handleAddText"
                :disabled="currentPageIndex" />
            </div>

            <div class="row g-2">
              <div class="col-6 col-sm-6">
                <button class="btn btn-success w-100" @click="handleAddPage">➕ 新增頁面</button>
              </div>
              <div class="col-6 col-sm-6">
                <button class="btn btn-primary w-100" :disabled="currentPageIndex" @click="handleAddText">新增文字</button>
              </div>
              <div class="col-6 col-sm-6">
                <button class="btn btn-warning w-100" :disabled="currentPageIndex" @click="clearAllCanvas">清除畫布</button>
              </div>
              <div class="col-6 col-sm-6">
                <button class="btn btn-danger w-100" @click="goBook">📖 預覽書本</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 頁面清單 -->
      <div class="card shadow-sm p-3 border-0 mt-3">
        <PageList />
      </div>
    </div>
  </div>
   

    <ModalTeleport v-if="showModal" message="確定要刪除畫布?" @close="showModal = false">
      <button type="button" class="btn btn-primary" @click="handleClearCanvas">確定</button>
    </ModalTeleport>
</template>

<style lang="scss" scoped>
.editor-wrapper {
  width: 100%;
  padding: 1rem;
  min-height: 100vh;

  .card {
    border-radius: $radius-lg;
    background-color: $color-light;
  }

  .canvas-wrapper {
    width: 100%;
    max-width: 960px;
    aspect-ratio: 3 / 2;
    position: relative;
  }

  .canvas-area {
    display: block;
    width: 100%;
    height: auto;
    background-color: $color-white;
    border: 2px solid #999;
    box-shadow: 0 0 12px #00000026;
    touch-action: manipulation;

    &:hover {
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
    }
  }

  @media (max-width: 576px) {
    .canvas-wrapper {
      aspect-ratio: 3 / 2;
      width: 100%;
      height: auto;
    }

    .card-body {
      padding: 1rem;
      overflow-x: auto;
    }

    h4 {
      font-size: $font-size-lg;
      text-align: center;
    }
  }
}
</style>
