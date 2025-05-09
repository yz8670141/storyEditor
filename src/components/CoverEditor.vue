<script setup>
import { userStorybookStore } from '@/stores/storybook.js'
import { storeToRefs } from 'pinia'
const store = userStorybookStore()
const { title, author, tempCoverImage } = storeToRefs(store)
function onFileChange(event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = () => {
            tempCoverImage.value = reader.result
            console.log("store.tempCoverImage",)
        }
        reader.readAsDataURL(file)
    }

}
</script>
<template>
    <div class="card">
        <h2>封面設定</h2>
        <div class="input-group mb-3">
            <span class="input-group-text">故事名稱</span>
            <input v-model.trim="title" class="form-control" placeholder="輸入故事名稱">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">作者名稱</span>
            <input v-model.trim="author" class="form-control" placeholder="輸入作者名稱">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">封面圖片</span>
            <input type="file" class="form-control" @change="onFileChange">
            <div v-if="tempCoverImage">
                <img :src="tempCoverImage" alt="cover preview" title="cover preview" class="img-thumbnail"
                    style="max-width: 200px; max-height: 200px;">
            </div>

        </div>

    </div>
</template>
