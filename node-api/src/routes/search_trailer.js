import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import { varToColumn, varToTable, uniqueTable } from "../config/trailerSearchConfig.js";
import { withDatabaseConnection } from "./search_berth.js";

const searchTrailerRouter = Router();

searchTrailerRouter.get("/trailers", async (req, res) => {
  let connection;

  // console.log(req.headers);

  try {
    var tableNames = [];
    connection = await dbConnection.getConnection();
    const columnCheck = await connection.query(
      `SELECT COLUMN_NAME
         FROM information_schema.columns
         WHERE table_name = 'Trailers_ID'
         AND table_schema = 'Marisail'
         AND column_name = 'manufacturer'`
    );

    // Check if the column exists
    if (columnCheck[0].length > 0) {
      console.log(columnCheck);
      console.log("inside if");
      const tables = await connection.query(
        `SELECT manufacturer, COUNT(*) AS occurrence_cnt 
             FROM Trailers_ID 
             GROUP BY manufacturer;`
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

searchTrailerRouter.post("/trailers", async (req, res) => {
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

      // Check if the column exists
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

searchTrailerRouter.post("/trailersData", async (req, res) => {
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

    var required = "Trailer_ID, make, model, year";

    var basic = `SELECT ${required} FROM Trailers_ID `;

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


searchTrailerRouter.get("/trailer-detail/:id", async (req, res) => {
  console.log("Trailer ID:", req.params.id);
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
      query += ` JOIN ${uniqueTable[i]} ON ${uniqueTable[0]}.Trailer_ID = ${uniqueTable[i]}.Trailer_ID`;
    }

    query += ` WHERE ${uniqueTable[0]}.Trailer_ID = ${id};`;

    console.log(query);

    const tables = await connection.query(
      query
    );

    console.log(tables);

    return res.status(200).json({ ok: true, res: tables });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
})

searchTrailerRouter.put("/trailers", async (req, res) => {
  let connection;
  try {
    const {
      siteDetailsTable,
      siteDetailsColumn,
      searchString,
      offSet = 0,
      appliedFilters,
    } = req.body;
    const dataResults = await withDatabaseConnection(async (connection) => {
      const actualTable = varToTable[siteDetailsTable];
      const actualColumn = varToColumn[siteDetailsColumn];
      console.log('actualTable :>> ', actualTable);
      // Validate config mappings
      if (!actualTable || !actualColumn) {
        throw new Error("Invalid table or column mapping configuration");
      }

      // Parameterized column check query
      const columnCheckQuery = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = ?
        AND table_schema = 'marisail'
        AND column_name = ?;
      `;

      const [columnCheck] = await connection.query(columnCheckQuery, [
        actualTable,
        actualColumn,
      ]);

      if (columnCheck.length === 0) {
        throw new Error(
          `Column '${actualColumn}' does not exist in table '${actualTable}'.`
        );
      }

      // Safe query using backticks for identifiers
      let dataQuery = `
        SELECT \`${actualColumn}\`, COUNT(*) AS occurrence_cnt
        FROM \`${actualTable}\`
      `;

      // Apply search filtering if searchString is provided
      let queryParams = [];
      if (searchString) {
        dataQuery += ` WHERE \`${actualColumn}\` LIKE ? `;
        queryParams.push(`%${searchString}%`);
      }

      dataQuery += ` GROUP BY \`${actualColumn}\` LIMIT 20 OFFSET ${offSet};`;
      const [result] = await connection.query(dataQuery, queryParams);
      await countDropDown(
        connection,
        actualColumn,
        siteDetailsColumn,
        appliedFilters,
        result
      );
      return result;
    });

    res.status(200).json({
      ok: true,
      siteDetails: {
        data: dataResults,
      },
    });
  } catch (err) {
    console.error("Error in /berths PUT:", err);
    res.status(500).json({
      ok: false,
      message: "An error occurred while fetching berth data.",
      details: err.message,
    });
  } finally {
    if (connection) {
      connection.release();
      console.log("Database connection released.");
    }
  }
});

const countDropDown = async (
  connection,
  actualColumn,
  currentcolumn,
  appliedFilters,
  result
) => {
  delete appliedFilters[currentcolumn];
  if (!result || result.length === 0) return;

  var wherePart = "";

  for (const key of Object.keys(appliedFilters)) {
    var columnKey = varToColumn[key];
    if (appliedFilters[key].length === 0) continue;
    wherePart += "(";
    for (const value of appliedFilters[key]) {
      if (columnKey === "Trailers_ID") columnKey = "t.Trailers_ID";
      wherePart += ` ${columnKey} = '${value}' OR`;
    }
    wherePart = wherePart.slice(0, -3);
    wherePart += ") AND ";
  }
  wherePart = wherePart.slice(0, -4);
  if (wherePart !== "") wherePart = `WHERE ${wherePart}`;
  var sumString = "";
  const diffValueOfResult = result.map((obj) => obj[actualColumn]);
  for (const obj of diffValueOfResult) {
    sumString += `SUM(CASE WHEN ${actualColumn === "Trailers_ID" ? "t.Trailers_ID" : actualColumn
      } = '${obj}' THEN 1 ELSE 0 END) AS \`${obj}\`,`;
  }

  var query = `SELECT ${sumString.slice(0, -1)} FROM Trailers_ID t ${wherePart};`;

  const [check] = await connection.query(query, []);
  result.map((item) => {
    // Find the matching value from the check array
    const itemCount = check[0][item[actualColumn]];

    if (itemCount) {
      // Add the check value to occurrence_cnt
      item.occurrence_cnt = parseInt(itemCount);
    }
    return item;
  });
};


export default searchTrailerRouter;
