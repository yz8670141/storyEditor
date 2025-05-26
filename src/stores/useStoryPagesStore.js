
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getAllPagesFromDB, savePageToDB, deletePageFromDB, getPageFromDB } from '@/utils/imageDB'

export const useStoryPagesStore = defineStore('storyPages', () => {
  const pages = ref([])
  const currentIndex = ref(null)
  const coverId = ref(null)

  async function initializePages() {
    try {
      const allPages = await getAllPagesFromDB()
      pages.value = allPages.map(p => ({
        id: p.id,
        json: p.json,
        image: p.image,
      }))
    } catch (e) {
      console.warn('❌ 無法從 IndexedDB 載入頁面', e)
    }
  }
  function initializeFromLocalStorage() {
    const getCoverId = localStorage.getItem('storybook-cover')
    if (getCoverId) {
      try {
        coverId.value = JSON.parse(getCoverId)
      } catch (e) {
        console.warn('解析失敗', e)
      }
    } else {
      coverId.value = pages.value.length > 0 ? pages.value[0].id : null
    }
  }
  async function addPage({ id, json, image }) {

    const entry = { id, json, image }
    await savePageToDB(entry)
    pages.value.push({ id, json, image })
    setCurrentIndex(pages.value.length - 1)

  }

  async function updatePage(index, data) {
    const page = pages.value[index]
    if (!page) return
    const updated = { ...page, ...data, updatedAt: Date.now() }
    await savePageToDB(updated)
    pages.value[index] = updated
  }

  async function removePage(index) {
    if (pages.value.length <= 1) return
    const removed = pages.value.splice(index, 1)[0]
    if (removed?.id) await deletePageFromDB(removed.id)
    if (currentIndex.value >= pages.value.length) {
      currentIndex.value = pages.value.length - 1
      currentIndex.value  === null
    }
  }

  function setCurrentIndex(index) {
    currentIndex.value = index
  }

  function setCover(id) {
    coverId.value = id
    localStorage.setItem('storybook-cover', id)
  }

  // ✅ 監聽 currentIndex，當切頁時同步取得 pageData 並更新 store（補充）

  watch(() =>currentIndex, async (newIndex) => {
    console.log('✅ watch triggered: newIndex =', newIndex)
    const page = pages.value[newIndex]
    if (!page) return
    const pageData = await getPageFromDB(page.id)
    if (!pageData) return
    pages.value[newIndex] = {
      id: page.id,
      json: pageData.json,
      image: pageData.image,
    }
  })

  return {
    pages,
    currentIndex,
    coverId,
    initializePages,
    initializeFromLocalStorage,
    addPage,
    updatePage,
    removePage,
    setCurrentIndex,
    setCover,
  }
})
