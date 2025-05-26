<template>
  <div class="container mt-4">
    <h3>提交表單測試</h3>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">標題</label>
        <input v-model="form.title" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">內容</label>
        <textarea v-model="form.body" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? '提交中...' : '送出' }}
      </button>
    </form>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    <div v-if="responseData" class="alert alert-success mt-3">
      <pre>{{ responseData }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({
  title: '',
  body: ''
})

const loading = ref(false)
const error = ref('')
const responseData = ref(null)

const handleSubmit = async () => {
  console.log("handleSubmit")
  error.value = ''
  responseData.value = null
  loading.value = true
  console.log("axios",axios)
  try {
    const res = await axios.post('https://jsonplaceholder.typicode.com/posts', {
      title: form.value.title,
      body: form.value.body,
      userId: 99
    })
  
    responseData.value = res.data
  } catch (err) {
    error.value = err.response?.data || '發生錯誤'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
