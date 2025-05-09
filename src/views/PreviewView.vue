<script setup>
import { userStorybookStore } from '@/stores/storybook.js'
import { storeToRefs } from 'pinia';
const sttore = userStorybookStore();
const { title, author, converImage, pages } = storeToRefs(sttore)
</script>

<template>
    <div class="container">
        <h2>📄 預覽你的故事書</h2>
        <div class="card">
            <div class="card-body position-relative">
                <!-- 書名: -->
                <h3 class="text-center fw-bold">{{ title }}</h3>
                <!-- 作者: -->
                <span class="position-absolute bottom-0 end-0 text-muted"> {{ author }}</span>
                <img v-if="converImage" :src="converImage" class="img-fluid" alt="封面">
            </div>
        </div>

        <div v-if="pages.length" class="row">
            <div v-for="page in pages" :key="page.id" class="col-md-6 mb-4">
                <div class="card">
                    <img :src="page.image" class="card-img-top" alt="page image" title="page image">
                    <div class="card-body">
                        <p class="card-text">{{ page.text }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-muted">尚未新增頁面</div>



        <router-link to="/editor" class="btn btn-primary mt-4">回去編輯</router-link>
    </div>
</template>
