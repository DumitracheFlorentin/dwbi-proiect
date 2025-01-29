import express from "express";
import sequelize from "./shared/db/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

try {
  await sequelize.authenticate();
  console.log("✅ Conexiune reușită cu baza de date Oracle!");

  // example query working
  const [results] = await sequelize.query(`
  SELECT EXTRACT(DAY FROM im.data_plecare) AS zi, 
    im.unitate_de_masura,
    SUM(im.cantitate) AS cantitate_totala,
    -- vrem sumele, dar pentru fiecare unitate_de_masura, nu sa le combinam
    LAG(SUM(im.cantitate), 1) OVER (PARTITION BY im.unitate_de_masura 
        ORDER BY EXTRACT(DAY FROM im.data_plecare)) AS cantitate_anterioara,
    LEAD(SUM(im.cantitate), 1) OVER (PARTITION BY im.unitate_de_masura 
        ORDER BY EXTRACT(DAY FROM im.data_plecare)) AS cantitate_urmatoare
  FROM   inventar_marfa im
  WHERE EXTRACT(YEAR FROM im.data_plecare) = 2024
      AND EXTRACT(MONTH FROM im.data_plecare) = 11
  GROUP BY im.unitate_de_masura, EXTRACT(DAY FROM im.data_plecare)
  ORDER BY 2, 1;
  `);
  console.log(JSON.stringify(results, null, 2));
} catch (err) {
  console.error("❌ Eroare de conexiune:", err);
}

// Pornire server
app.listen(PORT, () => {
  console.log(`🚀 Serverul rulează pe http://localhost:${PORT}`);
});
