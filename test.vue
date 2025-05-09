<!-- HOME.vue -->

<template>

    <div class="container text-center mt-5">
        <Transition name="fade">
            <div>
                <h1 class="mb-4">VueStory 繪本編輯器</h1>
                <p class="mb-3">這是一個使用 Vue 3 所有核心語法實作的互動式作品</p>
                <button class="btn btn-primary me-2" @click="goEditor">開始創作</button>
                <button class="btn btn-outline-secondary" @click="showModal = true">顯示提示</button>
            </div>
        </Transition>

        <Suspense>
            <template #default>
                <LazyBox v-if="lazyLoaded" />
            </template>
            <template #fallback>
                <p class="text-muted mt-3">載入中...</p>
            </template>
        </Suspense>

        <ModalTeleport v-if="showModal" :message="'請開始你的創作！'" @close="showModal = false" />
    </div>
</template>

<script setup>
import { useRouter, onMounted, onUnmounted, reactive, watchEffect, ref } from 'vue'
import ModalTeleport from '../components/ModalTeleport.vue'
import { defineAsyncComponent } from 'vue'

const LazyBox = defineAsyncComponent(() => import('../components/LazyBox.vue'))
const router = useRouter()
const state = reactive({ count: 0 })
const showModal = ref(false)
const lazyLoaded = ref(false)

function goEditor() {
    router.push('/editor')
}

onMounted(() => {
    console.log("lazyLoaded", lazyLoaded.value)
    // setTimeout(() => {
    //     lazyLoaded.value = f
    //     console.log('HomeView mounted')
    // }, 100000)
})

onUnmounted(() => {
    console.log('HomeView unmounted')
})

watchEffect(() => {
    if (state.count > 10) console.log('count 超過 10')
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
