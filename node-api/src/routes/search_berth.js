import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {
  varToColumn,
  varToTable,
  uniqueTable,
} from "../config/berthSearchConfig.js";

const searchBerthRouter = Router();

export const withDatabaseConnection = async (callback) => {
  let connection;
  try {
    connection = await dbConnection.getConnection();
    return await callback(connection);
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

const validateMappings = (tableKey, columnKey) => {
  const actualTable = varToTable[tableKey];
  const actualColumn = varToColumn[columnKey];

  if (!actualTable || !actualColumn) {
    throw new Error("Invalid table or column mapping configuration");
  }

  return { actualTable, actualColumn };
};

searchBerthRouter.get("/berths", async (req, res) => {
  let connection;
  try {
    connection = await dbConnection.getConnection();
    console.log("Database connection established.");

    const siteDetailsTable = varToTable.siteDetails;
    const siteDetailsColumn = varToColumn.termsAndConditions;

    // Check if the column exists in the table
    const columnCheckQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = '${siteDetailsTable}'
      AND table_schema = 'marisail'
      AND column_name = '${siteDetailsColumn}';
    `;

    const columnCheck = await connection.query(columnCheckQuery);

    if (columnCheck[0].length === 0) {
      return res.status(400).json({
        ok: false,
        message: `Column '${siteDetailsColumn}' does not exist in table '${siteDetailsTable}'.`,
      });
    }

    // Fetch data from the specified table and column
    const dataQuery = `
      SELECT ${siteDetailsColumn}, COUNT(*) AS occurrence_cnt
      FROM ${siteDetailsTable}
      GROUP BY ${siteDetailsColumn};
    `;

    const dataResults = await connection.query(dataQuery);

    // Extract the site details
    const siteDetailsData = dataResults[0].map((row) => row[siteDetailsColumn]);

    // Prepare the response
    res.status(200).json({
      ok: true,
      siteDetails: {
        table: siteDetailsTable,
        column: siteDetailsColumn,
        data: siteDetailsData,
      },
    });
  } catch (err) {
    console.error("Error in /berths GET:", err);
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

searchBerthRouter.put("/berths", async (req, res) => {
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

searchBerthRouter.put("/berths/mapping", async (req, res) => {
  let connection;
  try {
    const { columnCategory, tableCategory } = req.body;

    // Validate required fields
    if (!columnCategory || !tableCategory) {
      return res.status(400).json({
        ok: false,
        message: "Both 'columnCategory' and 'tableCategory' are required.",
      });
    }

    // Get mappings
    const column = varToColumn[columnCategory];
    const table = varToTable[tableCategory];

    if (!column || !table) {
      return res.status(404).json({
        ok: false,
        message: `Mapping not found for ${
          !column ? "column" : "table"
        } category`,
      });
    }

    connection = await dbConnection.getConnection();

    // Verify column exists in table
    const columnCheck = await connection.query(`
      SELECT COLUMN_NAME 
      FROM information_schema.columns
      WHERE table_name = '${table}'
      AND table_schema = 'Marisail'
      AND column_name = '${column}'
    `);

    if (columnCheck[0].length === 0) {
      return res.status(400).json({
        ok: false,
        message: `Column '${column}' does not exist in table '${table}'`,
      });
    }

    // Get aggregated data
    let result;
    if (column === "Beam") {
      result = await connection.query(`
        SELECT 
          CONCAT(FLOOR((${column} - 1) / 10) * 10 + 1, '-', 
          FLOOR((${column} - 1) / 10) * 10 + 10) AS ${column}_Range,
          COUNT(*) AS occurrence_cnt
        FROM ${table} 
        WHERE ${column} >= 1
        GROUP BY ${column}_Range
        ORDER BY ${column}_Range;
      `);
    } else {
      result = await connection.query(`
        SELECT ${column}, COUNT(*) AS occurrence_cnt
        FROM ${table}
        GROUP BY ${column};
      `);
    }

    res.status(200).json({
      ok: true,
      data: result[0].map((row) => Object.values(row)),
    });
  } catch (err) {
    console.error("Error in /berths/mapping PUT:", err);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
      details: err.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

searchBerthRouter.post("/berthsData", async (req, res) => {
  let connection;
  var page = req.body.page;
  var filter = req.body.selectedOptions;

  try {
    connection = await dbConnection.getConnection();

    var required1 = "Marisail_Berth_ID, Location, Type FROM Marina_Port";

    var basic = `SELECT ${required1} `;
    const queryParams = [];
    if (Object.keys(filter).length > 0) {
      var temp = `WHERE `;

      for (const key of Object.keys(filter)) {
        if (filter[key].length > 0) {
          const jointValues = filter[key].map(() => "?").join(", ");
          temp += `${varToColumn[key]} IN (${jointValues}) AND `;
          queryParams.push(...filter[key]);
        }
      }

      if (temp !== `WHERE `) {
        temp = temp.slice(0, -5); // Remove trailing AND
        basic += temp;
      }
    }

    basic += ` LIMIT 60 OFFSET ${page * 30};`;

    const tables = await connection.query(basic, queryParams);

    return res.status(200).json({ ok: true, res: tables });
  } catch (err) {
    console.error("Error in /berthsData POST:", err);
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

searchBerthRouter.get("/berth-detail/:id", async (req, res) => {
  const { id } = req.params;
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
    const tables = await connection.query(query);
    return res.status(200).json({ ok: true, res: tables });
  } catch (err) {
    console.error("Error in /berth-detail/:id GET:", err);
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// // Endpoint to fetch dynamic counts for dropdowns
// searchBerthRouter.post("/dropdown-counts", async (req, res) => {
//   try {
//     const { tableKey, columnKey, selectedFilters } = req.body;

//     // Validate table and column mappings
//     const { actualTable, actualColumn } = validateMappings(tableKey, columnKey);

//     const data = await withDatabaseConnection(async (connection) => {
//       // Build the WHERE clause based on selected filters
//       let whereClause = "";
//       if (selectedFilters && Object.keys(selectedFilters).length > 0) {
//         whereClause = "WHERE " + Object.entries(selectedFilters)
//           .map(([filterColumn, filterValues]) => {
//             const actualFilterColumn = varToColumn[filterColumn];
//             return `\`${actualFilterColumn}\` IN (${filterValues.map(val => `'${val}'`).join(",")})`;
//           })
//           .join(" AND ");
//       }

//       // Fetch data with counts, filtered by selected filters
//       const query = `
//         SELECT \`${actualColumn}\`, COUNT(*) AS count
//         FROM \`${actualTable}\`
//         ${whereClause}
//         GROUP BY \`${actualColumn}\`;
//       `;
//       console.log(query);
//       return {};
//       // return executeQuery(connection, query);
//     });

//     // Return the data with counts
//     res.status(200).json({ ok: true, data });
//   } catch (err) {
//     console.error("Error in /dropdown-counts POST:", err);
//     res.status(500).json({ ok: false, message: err.message });
//   }
// });

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
      if (columnKey === "Location") columnKey = "mp.Location";
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
      actualColumn === "Location" ? "mp.Location" : actualColumn
    } = '${obj}' THEN 1 ELSE 0 END) AS \`${obj}\`,`;
  }

  var query = `SELECT ${sumString.slice(0, -1)} FROM Marina_Port mp
LEFT JOIN Berths b ON mp.Marisail_Berth_ID = b.Marisail_Berth_ID
LEFT JOIN Amenities a ON mp.Marisail_Berth_ID = a.Marisail_Berth_ID
LEFT JOIN Family f ON mp.Marisail_Berth_ID = f.Marisail_Berth_ID
LEFT JOIN Local_Area la ON mp.Marisail_Berth_ID = la.Marisail_Berth_ID
LEFT JOIN Berths_Features bf ON mp.Marisail_Berth_ID = bf.Marisail_Berth_ID
LEFT JOIN Events e ON mp.Marisail_Berth_ID = e.Marisail_Berth_ID
LEFT JOIN Operations o ON mp.Marisail_Berth_ID = o.Marisail_Berth_ID
LEFT JOIN Repairs r ON mp.Marisail_Berth_ID = r.Marisail_Berth_ID
LEFT JOIN Accessibility acc ON mp.Marisail_Berth_ID = acc.Marisail_Berth_ID
LEFT JOIN Connectivity c ON mp.Marisail_Berth_ID = c.Marisail_Berth_ID
LEFT JOIN Environment env ON mp.Marisail_Berth_ID = env.Marisail_Berth_ID
LEFT JOIN Safety s ON mp.Marisail_Berth_ID = s.Marisail_Berth_ID
LEFT JOIN Legal l ON mp.Marisail_Berth_ID = l.Marisail_Berth_ID
LEFT JOIN Insurance ins ON mp.Marisail_Berth_ID = ins.Marisail_Berth_ID
LEFT JOIN Financial fin ON mp.Marisail_Berth_ID = fin.Marisail_Berth_ID
LEFT JOIN Pricing p ON mp.Marisail_Berth_ID = p.Marisail_Berth_ID
LEFT JOIN Payment bp ON mp.Marisail_Berth_ID = bp.Marisail_Berth_ID 
${wherePart}
;`;

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
export default searchBerthRouter;
