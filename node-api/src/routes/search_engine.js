import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import { varToColumn, varToTable } from "../config/engineSearchConfig.js";
import { withDatabaseConnection } from "./search_berth.js";

const searchEngineRouter = Router();

// Path     :   /api/search_engine/tables
// Method   :   Get
// Access   :   Public
// Desc     :   Endpoint to get list of tables
searchEngineRouter.get("/tables", async (req, res) => {
  let connection;
  try {
    connection = await dbConnection.getConnection();
    const [tables] = await connection.query("SHOW TABLES");
    const tableNames = tables.map((table) => Object.values(table)[0]);
    return res.status(200).json({ ok: true, tables: tableNames });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});
// Path     :   /api/search_engine/columns/:tableName
// Method   :   Get
// Access   :   Public
// Desc     :   Endpoint to get columns for a specific table
searchEngineRouter.get("/engine-detail/:id", async (req, res) => {
  try {
    console.log("Engine ID:", req.params.id);
    const { id } = req.params; // Get the engine ID from the URL parameter
    let connection;
    connection = await dbConnection.getConnection();

    // SQL query to fetch data from all related tables
    const query = `
      SELECT
        e.*,
        ec.*,
        ecool.*,
        ed.*,
        ee.*,
        eem.*,
        ef.*,
        el.*,
        em.*,
        emount.*,
        eo.*,
        ep.*,
        eps.*,
        es.*,
        et.*
      FROM general e
      LEFT JOIN engine_condition ec ON e.engine_id = ec.engine_id
      LEFT JOIN engine_cooling ecool ON e.engine_id = ecool.engine_id
      LEFT JOIN engine_dimensions ed ON e.engine_id = ed.engine_id
      LEFT JOIN engine_electrical ee ON e.engine_id = ee.engine_id
      LEFT JOIN engine_emissions eem ON e.engine_id = eem.engine_id
      LEFT JOIN engine_fuel ef ON e.engine_id = ef.engine_id
      LEFT JOIN engine_location el ON e.engine_id = el.engine_id
      LEFT JOIN engine_maintenance em ON e.engine_id = em.engine_id
      LEFT JOIN engine_mounting emount ON e.engine_id = emount.engine_id
      LEFT JOIN engine_oil eo ON e.engine_id = eo.engine_id
      LEFT JOIN engine_performance ep ON e.engine_id = ep.engine_id
      LEFT JOIN engine_propulsion eps ON e.engine_id = eps.engine_id
      LEFT JOIN engine_safety es ON e.engine_id = es.engine_id
      LEFT JOIN engine_transmission et ON e.engine_id = et.engine_id
      WHERE e.engine_id = ?
    `;

    const [results] = await connection.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).send("Engine not found");
    }

    res.json(results);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(`Server error: ${err.message}`);
  }
});

// Path     :   /api/search_engine/engine-detail/:id
// Method   :   Get
// Access   :   Public
// Desc     :   Endpoint to get columns for a specific table
searchEngineRouter.get("/:tableName/:columnName", async (req, res) => {
  const { tableName, columnName } = req.params;
  const { engine_make, engine_model } = req.query;

  let connection;
  try {
    connection = await dbConnection.getConnection();

    let query;
    const parameters = [];

    if (columnName === "engine_make") {
      // Fetch all distinct engine_make values
      query = `SELECT DISTINCT ${columnName} as value, COUNT(*) as count FROM ${tableName} GROUP BY ${columnName}`;
    } else if (columnName === "engine_model") {
      // Fetch all distinct engine_model values filtered by engine_make
      query = `SELECT DISTINCT ${columnName} as value, COUNT(*) as count FROM ${tableName} WHERE 1=1`;

      if (engine_make) {
        const engineMakeArray = engine_make.split(",");
        const engineMakeConditions = engineMakeArray.map(() => "?").join(",");
        query += ` AND engine_make IN (${engineMakeConditions})`;
        parameters.push(...engineMakeArray);
      }

      query += ` GROUP BY ${columnName}`;
    } else {
      // Apply filters for other columns
      query = `SELECT DISTINCT ${columnName} as value, COUNT(*) as count FROM ${tableName} WHERE 1=1`;

      if (engine_make) {
        const engineMakeArray = engine_make.split(",");
        const engineMakeConditions = engineMakeArray.map(() => "?").join(",");
        query += ` AND engine_make IN (${engineMakeConditions})`;
        parameters.push(...engineMakeArray);
      }

      if (engine_model) {
        const engineModelArray = engine_model.split(",");
        const engineModelConditions = engineModelArray.map(() => "?").join(",");
        query += ` AND engine_model IN (${engineModelConditions})`;
        parameters.push(...engineModelArray);
      }

      query += ` GROUP BY ${columnName}`;
    }

    console.log("Executing query:", query);
    console.log("With parameters:", parameters);

    const [rows] = await connection.query(query, parameters);
    console.log("Rows returned:", rows);

    const totalCountQuery = `SELECT COUNT(DISTINCT ${columnName}) as totalCount FROM ${tableName}`;
    const [[{ totalCount }]] = await connection.query(totalCountQuery);

    return res.status(200).json({
      ok: true,
      count: totalCount,
      result: rows.map((row) => ({
        value: row.value,
        count: row.count,
      })),
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// Path     :   /api/search_engine/engines
// Method   :   Get
// Access   :   Public
// Desc     :   Endpoint to get engines
searchEngineRouter.get("/engines", async (req, res) => {
  try {
    let connection = await dbConnection.getConnection();
    console.log("Query Parameters:", req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 21;
    const offset = (page - 1) * limit;

    const tables = JSON.parse(req.query.tables || "[]");
    const columns = JSON.parse(req.query.columns || "[]");
    const values = JSON.parse(req.query.values || "[]");

    if (
      !Array.isArray(tables) ||
      !Array.isArray(columns) ||
      !Array.isArray(values)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid query parameters format." });
    }

    let dataQuery = `
      SELECT 
      e.engine_id,
        e.engine_make, 
        e.engine_model, 
        e.engine_modelyear
      FROM engine_general e
    `;

    let countQuery = "SELECT COUNT(*) AS total FROM engine_general e";
    const queryParams = [];
    const conditions = [];

    // Construct conditions based on columns and values
    columns.forEach((column, index) => {
      const valueArray = values[index];
      if (valueArray && valueArray.length) {
        const columnConditions = valueArray
          .map((value) => `e.${column} LIKE ?`)
          .join(" OR ");
        conditions.push(`(${columnConditions})`);
        queryParams.push(...valueArray.map((value) => `%${value}%`));
      }
    });

    // Add conditions to the query if any exist
    if (conditions.length > 0) {
      const whereClause = `WHERE ${conditions.join(" AND ")}`;
      dataQuery += ` ${whereClause}`;
      countQuery += ` ${whereClause}`;
    }

    // Add pagination
    dataQuery += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    // Fetch the data
    const [results] = await connection.query(dataQuery, queryParams);

    const [[countResult]] = await connection.query(
      countQuery,
      queryParams.slice(0, queryParams.length - 2) // Remove LIMIT and OFFSET params
    );
    const totalRecords = countResult.total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Respond with data and pagination
    res.json({
      data: results,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
        limit: limit,
      },
    });
  } catch (err) {
    console.error("Error executing query:", err.message, err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

searchEngineRouter.put("/engines", async (req, res) => {
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
      console.log("actualTable :>> ", actualTable, actualColumn);
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
      if (columnKey === "Accommodation_Location")
        columnKey = "al.Accommodation_Location";
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
    sumString += `SUM(CASE WHEN ${
      actualColumn === "Accommodation_Location"
        ? "al.Accommodation_Location"
        : actualColumn
    } = '${obj}' THEN 1 ELSE 0 END) AS \`${obj}\`,`;
  }

  var query = `SELECT ${sumString.slice(
    0,
    -1
  )} FROM Engine_General ${wherePart};`;

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

const validateJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      throw new Error("Parsed JSON is not an array");
    }
  } catch (e) {
    console.error("Invalid JSON:", e);
    return [];
  }
};
const buildQuery = (tables, columns, values, page, limit) => {
  // Construct the WHERE clause based on the columns and values
  let whereClauses = columns.map((column, index) => {
    return `${column} LIKE ?`;
  });

  let whereSql = whereClauses.join(" AND ");

  // Construct the SQL query
  let query = `
    SELECT e.*, t1.*, t2.*, t3.*, t4.*, t5.*, t6.*, t7.*, t8.*, t9.*, t10.*, t11.*, t12.*, t13.*, t14.*, t15.*
    FROM ${tables.join(", ")}
    WHERE ${whereSql}
    LIMIT ? OFFSET ?
  `;

  // Calculate the offset
  const offset = (page - 1) * limit;

  return {
    query,
    params: [...values, limit, offset],
  };
};

// Example usage in the route handler

const getAllTables = async () => {
  let connection;
  connection = await dbConnection.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE();
    `);
    return rows.map((row) => row.table_name);
  } catch (error) {
    throw new Error(`Error fetching tables: ${error.message}`);
  }
};

const getAllColumns = async (tableName) => {
  let connection;
  connection = await dbConnection.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
      AND table_name = ?;
    `,
      [tableName]
    );
    return rows.map((row) => row.column_name);
  } catch (error) {
    throw new Error(`Error fetching columns: ${error.message}`);
  }
};

export default searchEngineRouter;
