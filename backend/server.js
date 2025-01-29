import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { CronJob } from "cron";

import corsOptions from './shared/config/cors.js'
import inventoryRoutes from './routes/inventory.route.js'
import sequelize from './shared/db/index.js'
import updateOLAP from "./services/updateOlapService.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors(corsOptions))

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
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
  CronJob.from({
    // cronTime: "10 0 * * *", // a little later after midnight
    cronTime: "* * * * *", // a little later after midnight
    onTick: () => {
      updateOLAP();
    },
    start: true,
  });

  console.log(`🚀 Serverul rulează pe http://localhost:${PORT}`);
});
