<script setup>
import { computed, onMounted } from 'vue'
import { useStoryPagesStore } from '@/stores/useStoryPagesStore'

const store = useStoryPagesStore()

onMounted(() => {
  store.initializeFromLocalStorage()
})
function selectPage(index) {
  store.setCurrentIndex(index)
}

function setAsCover() {
  const page = store.pages[store.currentIndex]
  if (page) {
    store.setCover(page.id)

  }
}

const currentPageIsCover = computed(() => {
  return store.pages.find(p => p.id === store.coverId)
})

</script>

<template>
  <div class="page-list">
    <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
      <h5 class="fw-bold text-primary mb-0">📚 頁面清單</h5>
      <button class="btn btn-outline-success btn-sm ms-5" :disabled="currentPageIsCover" @click="setAsCover">
        設為封面
      </button>

    </div>

    <div class="container- px-0">
      <div class="slider-wrapper">
        <div class="slider-track">
          <div v-for="(page, index) in store.pages" :key="page.id || index" class="page-thumbnail card" :class="{
            'border-primary border-3': store.currentIndex !== null && index === store.currentIndex
          }" @click="selectPage(index)">
            <img v-if="page.image" :src="page.image" class="card-img-top"
              :alt="(page.id === store.coverId ? '封面 - ' : '') + '第 ' + (index + 1) + ' 頁'" />
            <div class="card-body p-2">
              <p class="text-muted small text-center mb-0">
                第 {{ index + 1 }} 頁
                <span v-if="page.id === store.coverId">（封面）</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-list {
  width: 100%;

  .slider-wrapper {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    padding-bottom: $space-sm;
    scrollbar-width: thin;
    scrollbar-color: $scroll-thumb-color transparent;

    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: $scroll-thumb-color;
      border-radius: $scroll-thumb-radius;
    }

    &:hover::-webkit-scrollbar-thumb {
      background: $scroll-thumb-hover;
    }

    .slider-track {
      display: inline-flex;
      min-width: max-content;
      max-height: 120px;
      gap: $space-sm;
      padding-bottom: $space-xs;

      .page-thumbnail {
        flex: 0 0 auto;
        width: 160px;
        cursor: pointer;
        transition: $card-hover-transition;
        border: 2px solid transparent;
        position: relative;
        z-index: $z-index-page-thumbnail;
        background-color: $thumb-bg-debug;

        &:hover {
          transform: scale(1.04);
          box-shadow: $hover-shadow;
        }

        .card-img-top {
          height: 100%;
          object-fit: fill;
          border-radius: $radius-sm $radius-sm 0 0;
        }
      }
    }
  }
}
</style>
