<script setup>
import PageEditor from '@/components/PageEditorView.vue'
import CoverEditor from '@/components/CoverEditor.vue'
</script>

<template>
    <div class="container mt-2">
        <h2>✏️ 編輯你的故事書 </h2>
        <p>這裡將會提供圖片、文字編輯功能</p>
        <CoverEditor class="mb-5" />
        <PageEditor />
        <router-link to="/preview" class="btn btn-primary">預覽故事書</router-link>

    </div>
</template>
