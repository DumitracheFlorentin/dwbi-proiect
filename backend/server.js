import express from 'express'
import sequelize from './shared/db/index.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

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
