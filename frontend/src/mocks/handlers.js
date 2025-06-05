import { http, HttpResponse, delay } from 'msw'

// 假資料（可用外部變數模擬儲存狀態）
let items = [
  {
    id: 1748318469310,
    json: {"version":"5.3.0","objects":[],"background":"#222"},
    image: "https://img.freepik.com/free-photo/baby-with-stuffed-animal_52683-124509.jpg?semt=ais_hybrid&w=740"
  },
  {
    id: 1,
    json: null,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgX7Lv0xHveCXdbdWu4wx1QXUFuXa_A9f80Q&s"
  }
]

export const handlers = [
  // GET /api/items
  http.get('/api/items', async () => {
    await delay(500)
    return HttpResponse.json(items)
  }),

  // POST /api/items
  http.post('/api/items', async ({ request }) => {
    const body = await request.json()
    const newItem = { ...body, id: Date.now() }
    items.push(newItem)
    return HttpResponse.json(newItem, { status: 201 })
  }),

  // PUT /api/items/:id
  http.put('/api/items/:id', async ({ request, params }) => {
    const body = await request.json()
    const id = Number(params.id)
    const index = items.findIndex(item => item.id === id)
    if (index === -1) {
      return HttpResponse.json({ message: 'Item not found' }, { status: 404 })
    }
    items[index] = { ...items[index], ...body }
    return HttpResponse.json(items[index])
  }),

  // DELETE /api/items/:id
  http.delete('/api/items/:id', async ({ params }) => {
    const id = Number(params.id)
    const index = items.findIndex(item => item.id === id)
    if (index === -1) {
      return HttpResponse.json({ message: 'Item not found' }, { status: 404 })
    }
    items.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // 模擬 500 error
  http.get('/api/error', () => {
    return new HttpResponse('Internal Server Error', { status: 500 })
  }),

  // 模擬 timeout / 長時間延遲
  http.get('/api/slow', async () => {
    await delay(5000)
    return HttpResponse.json({ message: 'Delayed response' })
  }),
]
