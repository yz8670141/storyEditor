<script setup>
import { onMounted } from 'vue';
onMounted(() => {
    console.log('✅ LazyBox.vue onMounted')
})
</script>
<template>
    <div class="alert alert-success">
        我是延遲載入的區塊（使用 Suspense 顯示）
    </div>
</template>
