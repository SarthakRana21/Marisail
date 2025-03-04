import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {
  berthVarToColumn,
  berthVarToTable,
  berthUniqueTable,
} from "../config/berthSearchConfig.js";

const searchShopRouter = Router();

searchShopRouter.get("/chandlery", async (req, res) => {
  let connection;

  // console.log(req.headers);

  try {
    var tableNames = [];
    connection = await dbConnection.getConnection();
    const columnCheck = await connection.query(
      `SELECT COLUMN_NAME
         FROM information_schema.columns
         WHERE table_name = 'Marina_Port'
         AND table_schema = 'Marisail'
         AND column_name = 'Site_Details'`
    );

    // Check if the column exists
    if (columnCheck[0].length > 0) {
      console.log(columnCheck);
      console.log("inside if");
      const tables = await connection.query(
        `SELECT Site_Details, COUNT(*) AS occurrence_cnt 
             FROM Marina_Port 
             GROUP BY Site_Details;`
      );

      console.log(tables[0]);
      tableNames = tables[0].map((table) => Object.values(table));
    }
    return res.status(200).json({ ok: true, tables: tableNames });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

searchShopRouter.post("/chandlery", async (req, res) => {
  let connection;

  // console.log(req.body);
  const filter = req.body.filter;
  const tableName = berthVarToTable[req.body.tableName];
  // console.log("filter", filter);
  // console.log("req.body", req.body);

  try {
    connection = await dbConnection.getConnection();

    for (const key of Object.keys(filter)) {
      const columnCheck = await connection.query(
        `SELECT COLUMN_NAME
             FROM information_schema.columns
             WHERE table_name = '${tableName}'
             AND table_schema = 'Marisail'
             AND column_name = '${berthVarToColumn[key]}'`
      );

      // Check if the column exists
      if (columnCheck[0].length > 0) {
        // console.log(columnCheck )
        // console.log("inside if");
        const tables = await connection.query(
          `SELECT ${berthVarToColumn[key]}, COUNT(*) AS occurrence_cnt 
                 FROM ${tableName} 
                 GROUP BY ${berthVarToColumn[key]};`
        );

        console.log(tables[0]);
        filter[key] = tables[0].map((table) => Object.values(table));
        // console.log(filter);
      }
    }

    return res.status(200).json({ ok: true, res: filter });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

searchShopRouter.post("/chandleryData", async (req, res) => {
  let connection;

  console.log(req.body);

  var page = req.body.page;
  var filter = {};
  for (const key of Object.keys(req.body.selectedOptions)) {
    let val = key,
      key2 = req.body.selectedOptions[key];
    console.log(key2);
    console.log(val);

    if (filter[key2] === undefined) {
      filter[key2] = [val];
    } else {
      filter[key2].push(val);
    }

    // console.log(key);
    // console.log(req.body[key]);
  }
  console.log(filter);

  try {
    connection = await dbConnection.getConnection();

    var required1 = "Marisail_Berth_ID, Location, Type FROM Marina_Port";
    // var required2 = "Price_PW FROM Pricing";

    var basic = `SELECT ${required1} `;

    if (Object.keys(filter).length > 0) {
      basic += `WHERE `;

      for (const key of Object.keys(filter)) {
        // console.log(key);
        // console.log(filter[key]);
        var temp = `${key} IN (`;
        for (const val of filter[key]) {
          temp += `'${val}',`;
        }
        temp = temp.slice(0, -1);
        temp += `) OR `;
        basic += temp;
      }

      basic = basic.slice(0, -3);
    }

    basic += `LIMIT 60 OFFSET ${page * 30};`;
    basic += `;`;
    console.log(basic);

    const tables = await connection.query(basic);

    console.log(tables);

    return res.status(200).json({ ok: true, res: tables });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

searchShopRouter.get("/chandlery-detail/:id", async (req, res) => {
  console.log("Trailer ID:", req.params.id);
  const { id } = req.params; // Get the engine ID from the URL parameter
  console.log(id);
  let connection;

  try {
    connection = await dbConnection.getConnection();

    var query = `SELECT`;

    berthUniqueTable.forEach((table) => {
      query += ` ${table}.*,`;
    });

    query = query.slice(0, -1);
    query += ` FROM ${berthUniqueTable[0]}`;

    for (let i = 1; i < berthUniqueTable.length; i++) {
      query += ` JOIN ${berthUniqueTable[i]} ON ${berthUniqueTable[0]}.Trailer_ID = ${berthUniqueTable[i]}.Trailer_ID`;
    }

    query += ` WHERE ${berthUniqueTable[0]}.Trailer_ID = ${id};`;

    console.log(query);

    const tables = await connection.query(query);

    console.log(tables);

    return res.status(200).json({ ok: true, res: tables });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

export default searchShopRouter;
