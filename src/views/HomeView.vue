<script setup>
import ModalTeleport from '@/components/ModalTeleport.vue'
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import ThreeBackground from '@/components/ThreeBackground.vue'
import TEST from '@/views/TEST.vue'

const router = useRouter();
const showModal = ref(false)
function goEditor() {
    router.push('/pageEditor')
}

onErrorCaptured((error) => {
    console.log("其他的錯誤處理：", error);
})

</script>
<template>
  <!-- 測試用 -->
  <TEST/>
  <!-- Three.js 背景 -->
  <ThreeBackground class="background-canvas" />

  <!-- 居中卡片容器 
  <div class="full-screen-wrapper">
    <div class="cover-container text-center">
      <main>
        <h1>📘 繪本編輯器</h1>
        <p class="lead">開始創作你的第一本故事書</p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <button @click="showModal = true" class="btn btn-info">使用方法說明</button>   
          <button @click="goEditor" class="btn btn-primary">開始創作</button>
        </div>
      </main>
    </div>
  </div>-->
   <ModalTeleport v-if="showModal" message="點選『開始創作』，進入頁面編輯區後，可新增頁面、上傳圖片與文字內容" @close="showModal  = false"/>
</template>
<style scoped lang="scss">

.full-screen-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: $z-index-default;

  .cover-container {
    background-color: $color-light;
    color: $color-primary-dark;
    border-radius: $radius-lg;
    box-shadow: $shadow-lg;
    padding: 2rem;
    backdrop-filter: blur(4px);

    h1 {
      font-family: $font-main;
      font-weight: bold;
      margin-bottom: 1rem;
      color: $color-primary-dark
    }

    .lead {
      font-size: $font-size-base;
      margin-bottom: 1.5rem;
    }
  }
}
</style>