import sequelize from '../shared/db/index.js'
import { QueryTypes } from 'sequelize'

const getQ4Summary = async () => {
  const query = `
    SELECT l.judet, l.localitate, l.strada, l.nr,
           SUM(im.cantitate) AS cantitate_totala, im.unitate_de_masura,
           GROUPING(l.judet) AS "GJ",
           GROUPING(l.localitate) AS "GL"
    FROM inventar_marfa im
    JOIN depozit d ON im.id_depozit_plecare = d.id_depozit
    JOIN locatie l ON d.id_locatie = l.id_locatie
    WHERE im.data_plecare BETWEEN TO_DATE('01/10/2024', 'DD/MM/YYYY')
                              AND TO_DATE('31/12/2024', 'DD/MM/YYYY')
    GROUP BY im.unitate_de_masura, ROLLUP(l.judet, l.localitate, l.strada, l.nr);
  `

  return await sequelize.query(query, { type: QueryTypes.SELECT })
}

const getQ4FoodDrinksSummary = async () => {
  const query = `
    SELECT 
    f.nume, 
    cp.tip, 
    SUM(im.cantitate) AS cantitate_totala,
    TO_CHAR(MIN(im.timp_transport), 'YYYY-MM-DD HH24:MI:SS') AS "MIN_TIMP_TRANSPORT",
    TO_CHAR(MAX(im.timp_transport), 'YYYY-MM-DD HH24:MI:SS') AS "MAX_TIMP_TRANSPORT",
    TO_CHAR(NUMTODSINTERVAL(
        AVG(EXTRACT(DAY FROM im.timp_transport) * 86400 +
            EXTRACT(HOUR FROM im.timp_transport) * 3600 +
            EXTRACT(MINUTE FROM im.timp_transport) * 60 +
            EXTRACT(SECOND FROM im.timp_transport)), 'SECOND'), 
        'DD HH24:MI:SS') AS "AVG_TIMP_TRANSPORT",
    GROUPING(f.nume) AS gf, 
    GROUPING(cp.tip) AS gc, 
    CASE 
        WHEN GROUPING(f.nume) = 1 AND GROUPING(cp.tip) = 1 THEN 3
        WHEN GROUPING(f.nume) = 1 THEN 2
        WHEN GROUPING(cp.tip) = 1 THEN 1
        ELSE 0
    END AS "GR_ID"
FROM inventar_marfa im
JOIN firma f ON im.id_firma = f.id_firma
JOIN produs p ON im.id_produs = p.id_produs
JOIN categorie_produs cp ON p.id_categorie = cp.id_categorie
WHERE im.data_plecare BETWEEN DATE '2024-10-01' AND DATE '2024-12-31'
AND (cp.baza = 'Produse alimentare' OR cp.baza = 'Băuturi')
GROUP BY CUBE (f.nume, cp.tip);

  `

  return await sequelize.query(query, { type: QueryTypes.SELECT })
}

const getTopLocalities2024 = async () => {
  const query = `
    SELECT * FROM (
      SELECT DENSE_RANK() OVER (PARTITION BY im.unitate_de_masura
                                ORDER BY ROUND(SUM(im.cantitate), 1) DESC) AS d_rank_desc,
             l.localitate AS localitate,
             ROUND(SUM(im.cantitate), 1) AS cantitate_totala,
             im.unitate_de_masura
      FROM locatie l
      JOIN depozit d ON l.id_locatie = d.id_locatie
      JOIN inventar_marfa im ON d.id_depozit = im.id_depozit_sosire
      WHERE EXTRACT(YEAR FROM im.data_plecare) = 2024
      GROUP BY im.unitate_de_masura, l.localitate
    ) WHERE d_rank_desc <= 3;
  `

  return await sequelize.query(query, { type: QueryTypes.SELECT })
}

const getTopProductsDriver = async () => {
  const query = `
    SELECT categorie, tip,
           nume_produs, rang_produs_in_tip,
           total_cantitate, unitate_de_masura
    FROM (
      SELECT cp.categorie AS categorie,
             cp.tip AS tip,
             im.id_produs AS produs,
             p.nume AS nume_produs,
             im.unitate_de_masura AS unitate_de_masura,
             SUM(im.cantitate) AS total_cantitate,
             SUM(SUM(im.cantitate)) OVER (PARTITION BY cp.categorie) AS total_categorie,
             SUM(SUM(im.cantitate)) OVER (PARTITION BY cp.tip) AS total_tip_categorie,
             RANK() OVER (PARTITION BY cp.tip ORDER BY SUM(im.cantitate) DESC) AS rang_produs_in_tip
      FROM inventar_marfa im
      JOIN produs p ON im.id_produs = p.id_produs
      JOIN categorie_produs cp ON p.id_categorie = cp.id_categorie
      WHERE im.id_sofer = 20100
            AND EXTRACT(YEAR FROM im.data_plecare) IN (2024, 2025)
      GROUP BY cp.categorie, cp.tip, im.id_produs, p.nume, im.unitate_de_masura
    )
    WHERE total_tip_categorie >= 0.15 * total_categorie
          AND rang_produs_in_tip <= 3;
  `
  return await sequelize.query(query, { type: QueryTypes.SELECT })
}

const getComparisonQuantitiesOctober = async () => {
  const query = `
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
  `
  return await sequelize.query(query, { type: QueryTypes.SELECT })
}

export default {
  getComparisonQuantitiesOctober,
  getQ4FoodDrinksSummary,
  getTopLocalities2024,
  getTopProductsDriver,
  getQ4Summary,
}
