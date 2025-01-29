import express from 'express'
import dotenv from 'dotenv'

import inventoryRoutes from './routes/inventory.route.js'
import sequelize from './shared/db/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// routes
app.use('/api/v1/inventory', inventoryRoutes)

try {
  await sequelize.authenticate()
  console.log('✅ Conexiune reușită cu baza de date Oracle!')
} catch (err) {
  console.error('❌ Eroare de conexiune:', err)
}

// Pornire server
app.listen(PORT, () => {
  console.log(`🚀 Serverul rulează pe http://localhost:${PORT}`)
})
