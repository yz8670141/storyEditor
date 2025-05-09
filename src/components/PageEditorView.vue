<script setup>
import { ref } from 'vue';
import { userStorybookStore } from '@/stores/storybook.js'
const store = userStorybookStore()
const imageData = ref('')
const text = ref('')

function onImageChange(event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imageData.value = reader.result;
        }
        reader.readAsDataURL(file)
    }
}
function addNewPage() {
    if (!imageData.value || !text.value) return alert('請上傳圖片並填寫內容')
    store.addPage({ id: Date.now(), image: imageData.value, text: text.value })
    imageData.value = ''
    text.value = ''
}
</script>

<template>
    <div class="card">
        <h2>頁面設定</h2>
        <div class="input-group mb-3">
            <span class="input-group-text">頁面圖片</span>
            <input type="file" class="form-control" @change="onImageChange">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">頁面文字</span>
            <textarea v-model.trim="text" class="form-control" rows="3"></textarea>
        </div>
        <button class="btn btn-primary mt-3" @click="addNewPage">新增頁面</button>
    </div>
</template>
