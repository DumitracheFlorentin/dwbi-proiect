import sequelize from "../shared/db/index.js";
import { QueryTypes } from "sequelize";

async function updateOLAP() {
  const transaction = await sequelize.transaction();

  try {
    const responseLocatie = await sequelize.query(
      `
      INSERT INTO LOCATIE
      SELECT *
      FROM dw_oltp_admin.LOCATIE oltp
      WHERE NOT EXISTS (
          SELECT 1
          FROM LOCATIE l
          WHERE l.id_locatie = oltp.id_locatie
          );
    `,
      {
        replacements: {},
        transaction,
        type: QueryTypes.INSERT,
      }
    );
    console.log(
      `✅ Actualizare OLAP a tabelului LOCATIE reușită! Randuri adaugate: ${responseLocatie[1]}`
    );

    const responseFirma = await sequelize.query(
      `
      INSERT INTO FIRMA
      SELECT id_firma, nume, tip_firma
      FROM dw_oltp_admin.FIRMA oltp
      WHERE NOT EXISTS (
          SELECT 1
          FROM FIRMA f
          WHERE f.id_firma = oltp.id_firma
          );
    `,
      {
        replacements: {},
        transaction,
        type: QueryTypes.INSERT,
      }
    );
    console.log(
      `✅ Actualizare OLAP a tabelului FIRMA reușită! Randuri adaugate: ${responseFirma[1]}`
    );

    const responseDepozit = await sequelize.query(
      `
      INSERT INTO DEPOZIT
      SELECT id_depozit, id_locatie, id_firma, nume
      FROM dw_oltp_admin.DEPOZIT oltp
      WHERE NOT EXISTS (
          SELECT 1
          FROM DEPOZIT d
          WHERE d.id_depozit = oltp.id_depozit
          );
      `,
      {
        replacements: {},
        transaction,
        type: QueryTypes.INSERT,
      }
    );
    console.log(
      `✅ Actualizare OLAP a tabelului DEPOZIT reușită! Randuri adaugate: ${responseDepozit[1]}`
    );

    const responseCategorieProdus = await sequelize.query(
      `
      INSERT INTO CATEGORIE_PRODUS
      SELECT *
      FROM dw_oltp_admin.CATEGORIE_PRODUS oltp
      WHERE NOT EXISTS (
          SELECT 1
          FROM CATEGORIE_PRODUS cp
          WHERE cp.id_categorie = oltp.id_categorie
          );
      `,
      {
        replacements: {},
        transaction,
        type: QueryTypes.INSERT,
      }
    );
    console.log(
      `✅ Actualizare OLAP a tabelului CATEGORIE_PRODUS reușită! Randuri adaugate: ${responseCategorieProdus[1]}`
    );

    const responseProdus = await sequelize.query(
      `
      INSERT INTO PRODUS
      SELECT *
      FROM dw_oltp_admin.PRODUS oltp
      WHERE NOT EXISTS (
          SELECT 1
          FROM PRODUS p
          WHERE p.id_produs = oltp.id_produs
          );
      `,
      {
        replacements: {},
        transaction,
        type: QueryTypes.INSERT,
      }
    );
    console.log(
      `✅ Actualizare OLAP a tabelului PRODUS reușită! Randuri adaugate: ${responseProdus[1]}`
    );

    const responseCamion = await sequelize.query(
      `
      INSERT INTO CAMION
      SELECT *
      FROM dw_oltp_admin.CAMION oltp
      WHERE NOT EXISTS (
          SELECT 1
          FROM CAMION c
          WHERE c.id_camion = oltp.id_camion
          );
      `,
      {
        replacements: {},
        transaction,
        type: QueryTypes.INSERT,
      }
    );
    console.log(
      `✅ Actualizare OLAP a tabelului CAMION reușită! Randuri adaugate: ${responseCamion[1]}`
    );

    const responseSofer = await sequelize.query(
      `
      INSERT INTO SOFER
      SELECT id_angajat, nume, prenume, nr_telefon, data_angajare, salariu, id_firma
      FROM dw_oltp_admin.ANGAJAT a
      WHERE a.tip_angajat = 'SOFER'
      AND NOT EXISTS (
          SELECT 1
          FROM SOFER s
          WHERE s.id_angajat = a.id_angajat
          );
      `,
      {
        replacements: {},
        transaction,
        type: QueryTypes.INSERT,
      }
    );
    console.log(
      `✅ Actualizare OLAP a tabelului SOFER reușită! Randuri adaugate: ${responseSofer[1]}`
    );

    const responseInventarMarfa = await sequelize.query(
      `
      INSERT INTO INVENTAR_MARFA
      SELECT
          t.id_transport,
          c.id_firma,
          t.depozit_plecare,
          t.depozit_destinatie,
          t.id_camion,
          icc.id_angajat,
          it.id_produs,
          it.cantitate,
          it.unitate_de_masura,
          t.data_plecare,
          NUMTODSINTERVAL(t.data_sosire - t.data_plecare, 'DAY')
      FROM 
          dw_oltp_admin.TRANSPORT t
          JOIN dw_oltp_admin.INVENTAR_TRANSPORT it ON (t.id_transport = it.id_transport)
          JOIN dw_oltp_admin.ISTORIC_CAMIOANE_CONDUSE icc ON (t.id_camion = icc.id_camion)
          JOIN dw_oltp_admin.CAMION c ON (icc.id_camion = c.id_camion)
      WHERE
          t.data_sosire IS NOT NULL
          AND t.data_sosire >= trunc(sysdate - 1) -- orice de acum o zi de la 00:00 inclusiv
          AND t.data_sosire < trunc(sysdate) -- pana azi la 00:00 exclusiv
          AND icc.data_inceput <= t.data_plecare
          AND t.data_plecare < NVL(icc.data_sfarsit, sysdate)
      ;`,
      {
        replacements: {},
        transaction,
        type: QueryTypes.INSERT,
      }
    );
    console.log(
      `✅ Actualizare OLAP a tabelului INVENTAR_MARFA reușită! Randuri adaugate: ${responseInventarMarfa[1]}`
    );

    // finalizare tranzactie
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error(
      "❌ Eroare la actualizarea OLAP a tabelului INVENTAR_MARFA:",
      error
    );
  }
}

export default updateOLAP;
