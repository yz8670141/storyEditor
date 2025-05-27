import express from 'express'
import cors from 'cors' 
const app = express()
const PORT = 3000
app.use(cors())  
app.use(express.json())

app.get('/api/items', (req, res) => {
  res.json([
    { id: 1, name: 'Real Item One' },
    { id: 2, name: 'Real Item Two' }
  ])
})


const server = app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`)
})

server.on('error', (err) => {
  console.error('❌ Server error:', err)
})
