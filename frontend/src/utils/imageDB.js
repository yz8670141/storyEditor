
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('storybook-db', 2)

    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('story-pages')) {
        db.createObjectStore('story-pages', { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject('Failed to open IndexedDB')
  })
}

export async function savePageToDB(pageEntry) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('story-pages', 'readwrite')
    const store = tx.objectStore('story-pages')
    const req = store.put(pageEntry)
    req.onsuccess = () => resolve()
    req.onerror = () => reject('Failed to write to story-pages store')
  })
}

export async function getPageFromDB(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('story-pages', 'readonly')
    const store = tx.objectStore('story-pages')
    const getReq = store.get(id)

    getReq.onsuccess = () => resolve(getReq.result)
    getReq.onerror = () => reject('Failed to retrieve from story-pages store')
  })
}

export async function deletePageFromDB(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('story-pages', 'readwrite')
    const store = tx.objectStore('story-pages')
    const req = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject('Failed to delete from story-pages store')
  })
}

export async function getAllPagesFromDB() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('story-pages', 'readonly')
      const store = tx.objectStore('story-pages')
      const allReq = store.getAll()
      allReq.onsuccess = () => resolve(allReq.result || [])
      allReq.onerror = () => reject('Failed to retrieve all pages')
    } catch (err) {
      reject('Object store not found: ' + err.message)
    }
  })
}

export function savePageImageWhenIdle(id, canvas) {
  if (!('requestIdleCallback' in window)) return // fallback check
  requestIdleCallback(async () => {
    // const image = canvas.toDataURL('image/jpeg', 0.6)
    const image =  canvas.toDataURL('image/png')
    const updated = { id, image, updatedAt: Date.now() }
    await savePageToDB(updated)
  })
}