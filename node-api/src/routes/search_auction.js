import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {
  varToColumn,
  varToTable,
  uniqueTable,
} from "../config/auctionSearchConfig.js";

const searchAuctionRouter = Router();

searchAuctionRouter.get("/Auction", async (req, res) => {
  let connection;

  try {
    var tableNames = [];
    connection = await dbConnection.getConnection();
    const columnCheck = await connection.query(
      `SELECT COLUMN_NAME
             FROM information_schema.columns
             WHERE table_name = 'Auction'
             AND table_schema = 'Marisail'
             AND column_name = 'Auction_Date'`
    );

    // Check if the column exists
    if (columnCheck[0].length > 0) {
      console.log(columnCheck);
      console.log("inside if");
      const tables = await connection.query(
        `SELECT auctionDate, COUNT(*) AS occurrence_cnt 
                FROM Auction 
                GROUP BY Auction_Date;`
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

searchAuctionRouter.post("/Auction", async (req, res) => {
  let connection;

  // console.log(req.body);
  const filter = req.body.filter;
  const tableName = varToTable[req.body.tableName];
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
                 AND column_name = '${varToColumn[key]}'`
      );

      if (columnCheck[0].length > 0) {
        // console.log(columnCheck )
        // console.log("inside if");
        const tables = await connection.query(
          `SELECT ${varToColumn[key]}, COUNT(*) AS occurrence_cnt 
                     FROM ${tableName} 
                     GROUP BY ${varToColumn[key]};`
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

searchAuctionRouter.post("/auctionData", async (req, res) => {
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

    var required =
      "Lot_Number, Auction_Status, Results_or_Outcome, Auction_Number, Auction_Date";

    var basic = `SELECT ${required} FROM Auction `;

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

searchAuctionRouter.get("/auction-detail/:id", async (req, res) => {
  console.log("Auction ID:", req.params.id);
  const { id } = req.params; // Get the engine ID from the URL parameter
  console.log(id);
  let connection;

  try {
    connection = await dbConnection.getConnection();

    var query = `SELECT`;

    uniqueTable.forEach((table) => {
      query += ` ${table}.*,`;
    });

    query = query.slice(0, -1);
    query += ` FROM ${uniqueTable[0]}`;

    for (let i = 1; i < uniqueTable.length; i++) {
      query += ` JOIN ${uniqueTable[i]} ON ${uniqueTable[0]}.Lot_Number = ${uniqueTable[i]}.Lot_Number`;
    }

    query += ` WHERE ${uniqueTable[0]}.Lot_Number = ${id};`;

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

export default searchAuctionRouter;
