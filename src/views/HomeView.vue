<script setup>
import ModalTeleport from '@/components/ModalTeleport.vue'
import LazyBoxComponent from '@/components/LazyBox.vue'
import { ref, onMounted, onUnmounted, onErrorCaptured, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const showModal = ref(false)
const LazyBox = defineAsyncComponent(() =>
    new Promise(reslove => {
        setTimeout(() => {
            reslove(import('@/components/LazyBox.vue'))
        }, 1500);
    })
)
const lazyLoaded = ref(false)
let timer = null
function goEditor() {
    router.push('/editor')
}
onMounted(() => {
    //console.log('⏱️ 設定 timer')
    timer = setTimeout(() => {
        lazyLoaded.value = true
        console.log('✅ onMounted 執行了', lazyLoaded.value)
    }, 3000)
})

onUnmounted(() => {
    clearTimeout(timer)
    console.log('🧹 timer 清除:', timer)
})
onErrorCaptured((error) => {
    console.log("其他的錯誤處理：", error);
})
function fallback() {
    console.log("fallback")
}
function pending() {
    console.log("fallback")
}
function resolved() {
    console.log("fallback")
}
</script>

<template>
    <div class="container">
        <Transition name="fade">
            <div>
                <h1>📘繪本編輯器</h1>
                <p>開始創作你的第一本故事書</p>
                <button @click="showModal = true" type="button" class="btn btn-outline-secondary">使用方法說明</button>
                <button @click="goEditor" type="button" class="btn btn-primary">開始創作</button>
            </div>
        </Transition>

        <Suspense @fallback="fallback" @pending="pending" @resolve="resolved">
            <template #default>
                <LazyBox />
            </template>
            <template #fallback>
                <h1 style="background-color: red;">載入中...</h1>
            </template>
        </Suspense>
        <ModalTeleport v-if="showModal" @close="showModal = false" :message="'請開始你的創作！'" />
    </div>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
