
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import axios from 'axios'
export const useStoryPagesStore = defineStore('page', () => {
  //  State
  const pages = ref([]) //所有頁面資料
  const responseMsg = ref('') //api接收的資料狀態
  const error = ref('') //api接收的error狀態
  const loading = ref(false) //設定loading compoent狀態
  const url = '/api/items'
  const currentIndex = ref(null) //當前顯示的頁面index
  const coverId = ref(null)//封面id
  //取得頁面所有資料
   const getPages = async () => {
    if (loading.value || pages.value.length > 0) return
    loading.value = true
    error.value = ''
    try {
      const res = await axios.get(url)
      pages.value = res.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  //新增"單"頁資料
  const addPage = async (payload) => {
    loading.value = true
    error.value = ''
    try {
      const res = await axios.post(url, payload)
      responseMsg.value = res.data.message
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  //修改"單"頁資料
  const updatePage = async (index, data) =>{
 const page = pages.value[index]
    if (!page) return
    const updated = { ...page, ...data, updatedAt: Date.now() }
    //!!! 尚未做 !!!新增到api
    pages.value[index] = updated
  }
  //當前顯示的頁面index
  const setCurrentIndex = (index) =>{
    currentIndex.value = index
  }
function setCover(id) {
    coverId.value = id
    localStorage.setItem('storybook-cover', id)
  }
  return{
    // state
    pages,
    responseMsg,
    error,
    loading,
    url,
    currentIndex,
    
    // actions
    getPages,
    addPage,
    setCurrentIndex,
    updatePage,
    setCover
  }

})