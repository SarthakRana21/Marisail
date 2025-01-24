import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {
  varToColumn,
  varToTable,
  uniqueTable,
} from "../config/berthSearchConfig.js";

const searchBerthRouter = Router();

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
        message: `Column '${siteDetailsColumn}' does not exist in table '${siteDetailsTable}'.`
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
    const siteDetailsData = dataResults[0].map(row => row[siteDetailsColumn]);

    // Prepare the response
    res.status(200).json({
      ok: true,
      siteDetails: {
        table: siteDetailsTable,
        column: siteDetailsColumn,
        data: siteDetailsData
      }
    });

  } catch (err) {
    console.error("Error in /berths GET:", err);
    res.status(500).json({
      ok: false,
      message: "An error occurred while fetching berth data.",
      details: err.message
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
    const { siteDetailsTable, siteDetailsColumn } = req.body;
    connection = await dbConnection.getConnection();
    console.log("Database connection established.");

    // Get actual table/column names from config
    const actualTable = varToTable[siteDetailsTable];
    const actualColumn = varToColumn[siteDetailsColumn];

    // Validate config mappings
    if (!actualTable || !actualColumn) {
      return res.status(400).json({
        ok: false,
        message: "Invalid table or column mapping configuration"
      });
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
      actualColumn
    ]);

    if (columnCheck.length === 0) {
      return res.status(400).json({
        ok: false,
        message: `Column '${actualColumn}' does not exist in table '${actualTable}'.`
      });
    }

    // Safe query using backticks for identifiers
    const dataQuery = `
      SELECT \`${actualColumn}\`, COUNT(*) AS occurrence_cnt
      FROM \`${actualTable}\`
      GROUP BY \`${actualColumn}\`;
    `;

    const [dataResults] = await connection.query(dataQuery);

    const siteDetailsData = dataResults.map(row => row[actualColumn]);

    res.status(200).json({
      ok: true,
      siteDetails: {
        table: actualTable,
        column: actualColumn,
        data: siteDetailsData
      }
    });

  } catch (err) {
    console.error("Error in /berths PUT:", err);
    res.status(500).json({
      ok: false,
      message: "An error occurred while fetching berth data.",
      details: err.message
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
        message: "Both 'columnCategory' and 'tableCategory' are required."
      });
    }

    // Get mappings
    const column = varToColumn[columnCategory];
    const table = varToTable[tableCategory];

    if (!column || !table) {
      return res.status(404).json({
        ok: false,
        message: `Mapping not found for ${!column ? "column" : "table"} category`
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
        message: `Column '${column}' does not exist in table '${table}'`
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
      data: result[0].map(row => Object.values(row))
    });

  } catch (err) {
    console.error("Error in /berths/mapping PUT:", err);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
      details: err.message
    });
  } finally {
    if (connection) connection.release();
  }
});
searchBerthRouter.post("/berthsData", async (req, res) => {
  let connection;
  var page = req.body.page;
  var filter = {};
  for (const key of Object.keys(req.body.selectedOptions)) {
    let val = key,
      key2 = req.body.selectedOptions[key];
    if (filter[key2] === undefined) {
      filter[key2] = [val];
    } else {
      filter[key2].push(val);
    }
  }

  try {
    connection = await dbConnection.getConnection();

    var required1 = "Marisail_Berth_ID, Location, Type FROM Marina_Port";

    var basic = `SELECT ${required1} `;

    if (Object.keys(filter).length > 0) {
      basic += `WHERE `;

      for (const key of Object.keys(filter)) {
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
    const tables = await connection.query(basic);
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
searchBerthRouter.get("/allFilters", async (req, res) => {
  let connection;
  try {
    connection = await dbConnection.getConnection();

    const filtersConfig = {
      // Site Details
      siteDetails: { table: varToTable.siteDetails, column: varToColumn.siteDetails },
      termsAndConditions: { table: varToTable.siteDetails, column: varToColumn.termsAndConditions },
      type: { table: varToTable.siteDetails, column: varToColumn.type },
      marinaName: { table: varToTable.siteDetails, column: varToColumn.marinaName },
      location: { table: varToTable.siteDetails, column: varToColumn.location },
      ownership: { table: varToTable.siteDetails, column: varToColumn.ownership },
      yearEstablished: { table: varToTable.siteDetails, column: varToColumn.yearEstablished },
      operatingHours: { table: varToTable.siteDetails, column: varToColumn.operatingHours },
      contactDetails: { table: varToTable.siteDetails, column: varToColumn.contactDetails },
      seasonalOperation: { table: varToTable.siteDetails, column: varToColumn.seasonalOperation },
      languageServices: { table: varToTable.siteDetails, column: varToColumn.languageServices },

      // General Information
      dockTypes: { table: varToTable.generalInformation, column: varToColumn.dockTypes },
      numberOfDocks: { table: varToTable.generalInformation, column: varToColumn.numberOfDocks },
      boatSlipSizes: { table: varToTable.generalInformation, column: varToColumn.boatSlipSizes },
      numberOfBerthsAvailable: { table: varToTable.generalInformation, column: varToColumn.numberOfBerthsAvailable },
      length: { table: varToTable.generalInformation, column: varToColumn.length },
      beam: { table: varToTable.generalInformation, column: varToColumn.beam },
      draft: { table: varToTable.generalInformation, column: varToColumn.draft },
      slipWidth: { table: varToTable.generalInformation, column: varToColumn.slipWidth },
      slipLength: { table: varToTable.generalInformation, column: varToColumn.slipLength },
      mooringType: { table: varToTable.generalInformation, column: varToColumn.mooringType },
      tideRange: { table: varToTable.generalInformation, column: varToColumn.tideRange },

      // Amenities & Services
      storage: { table: varToTable.amenitiesAndServices, column: varToColumn.storage },
      electricityAvailable: { table: varToTable.amenitiesAndServices, column: varToColumn.electricityAvailable },
      waterSupply: { table: varToTable.amenitiesAndServices, column: varToColumn.waterSupply },
      wifiAvailability: { table: varToTable.amenitiesAndServices, column: varToColumn.wifiAvailability },
      carParking: { table: varToTable.amenitiesAndServices, column: varToColumn.carParking },
      conciergeServices: { table: varToTable.amenitiesAndServices, column: varToColumn.conciergeServices },
      businessServices: { table: varToTable.amenitiesAndServices, column: varToColumn.businessServices },
      conferenceRooms: { table: varToTable.amenitiesAndServices, column: varToColumn.conferenceRooms },

      // Family Facilities
      laundryFacilities: { table: varToTable.familyFacilities, column: varToColumn.laundryFacilities },
      restaurant: { table: varToTable.familyFacilities, column: varToColumn.restaurant },
      bar: { table: varToTable.familyFacilities, column: varToColumn.bar },
      shoppingFacilities: { table: varToTable.familyFacilities, column: varToColumn.shoppingFacilities },
      retailShops: { table: varToTable.familyFacilities, column: varToColumn.retailShops },
      hospitalityServices: { table: varToTable.familyFacilities, column: varToColumn.hospitalityServices },
      clubhouseAccess: { table: varToTable.familyFacilities, column: varToColumn.clubhouseAccess },
      swimmingPool: { table: varToTable.familyFacilities, column: varToColumn.swimmingPool },
      fitnessCenter: { table: varToTable.familyFacilities, column: varToColumn.fitnessCenter },
      marinaStore: { table: varToTable.familyFacilities, column: varToColumn.marinaStore },
      chandlery: { table: varToTable.familyFacilities, column: varToColumn.chandlery },
      laundryServices: { table: varToTable.familyFacilities, column: varToColumn.laundryServices },
      gymFacilities: { table: varToTable.familyFacilities, column: varToColumn.gymFacilities },
      sanitationnFacilities: { table: varToTable.familyFacilities, column: varToColumn.sanitationnFacilities },
      familyFriendlyAmenities: { table: varToTable.familyFacilities, column: varToColumn.familyFriendlyAmenities },
      petFriendlyServices: { table: varToTable.familyFacilities, column: varToColumn.petFriendlyServices },
      iceAvailability: { table: varToTable.familyFacilities, column: varToColumn.iceAvailability },
      picnicAndBBQAreas: { table: varToTable.familyFacilities, column: varToColumn.picnicAndBBQAreas },
      childrensPlayArea: { table: varToTable.familyFacilities, column: varToColumn.childrensPlayArea },

      // Financial Information
      currency: { table: varToTable.financialInformation, column: varToColumn.currency },
    };

    const queries = [];
    for (const filterKey in filtersConfig) {
      const { table, column } = filtersConfig[filterKey];
      if (!table || !column) {
        console.warn(`Invalid table or column for filter: ${filterKey}`);
        continue;
      }
      const query = `SELECT \`${column}\`, COUNT(*) AS occurrence_cnt FROM \`${table}\` GROUP BY \`${column}\`;`;
      console.log(`Executing query for ${filterKey}: ${query}`);
      queries.push(connection.query(query));
    }

    const results = await Promise.all(queries);

    const filterData = {};
    Object.keys(filtersConfig).forEach((filterKey, index) => {
      filterData[filterKey] = results[index][0];
    });

    return res.status(200).json({
      ok: true,
      filters: filterData
    });
  } catch (err) {
    console.error("Error in /allFilters:", err);
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});
searchBerthRouter.post("/filterByTable", async (req, res) => {
  const { tableName, filterColumns, filterName } = req.body;

  // Validate request payload
  if (!tableName || !filterColumns || !filterName) {
    return res.status(400).json({ ok: false, message: "All fields (tableName, filterColumns, filterName) are required." });
  }

  let connection;
  try {
    // Define filtersConfig
    const filtersConfig = {
      // Site Details
      siteDetails: { table: varToTable.siteDetails, column: varToColumn.siteDetails },
      termsAndConditions: { table: varToTable.siteDetails, column: varToColumn.termsAndConditions },
      type: { table: varToTable.siteDetails, column: varToColumn.type },
      marinaName: { table: varToTable.siteDetails, column: varToColumn.marinaName },
      location: { table: varToTable.siteDetails, column: varToColumn.location },
      ownership: { table: varToTable.siteDetails, column: varToColumn.ownership },
      yearEstablished: { table: varToTable.siteDetails, column: varToColumn.yearEstablished },
      operatingHours: { table: varToTable.siteDetails, column: varToColumn.operatingHours },
      contactDetails: { table: varToTable.siteDetails, column: varToColumn.contactDetails },
      seasonalOperation: { table: varToTable.siteDetails, column: varToColumn.seasonalOperation },
      languageServices: { table: varToTable.siteDetails, column: varToColumn.languageServices },

      // General Information
      dockTypes: { table: varToTable.generalInformation, column: varToColumn.dockTypes },
      numberOfDocks: { table: varToTable.generalInformation, column: varToColumn.numberOfDocks },
      boatSlipSizes: { table: varToTable.generalInformation, column: varToColumn.boatSlipSizes },
      numberOfBerthsAvailable: { table: varToTable.generalInformation, column: varToColumn.numberOfBerthsAvailable },
      length: { table: varToTable.generalInformation, column: varToColumn.length },
      beam: { table: varToTable.generalInformation, column: varToColumn.beam },
      draft: { table: varToTable.generalInformation, column: varToColumn.draft },
      slipWidth: { table: varToTable.generalInformation, column: varToColumn.slipWidth },
      slipLength: { table: varToTable.generalInformation, column: varToColumn.slipLength },
      mooringType: { table: varToTable.generalInformation, column: varToColumn.mooringType },
      tideRange: { table: varToTable.generalInformation, column: varToColumn.tideRange },

      // Amenities & Services
      storage: { table: varToTable.amenitiesAndServices, column: varToColumn.storage },
      electricityAvailable: { table: varToTable.amenitiesAndServices, column: varToColumn.electricityAvailable },
      waterSupply: { table: varToTable.amenitiesAndServices, column: varToColumn.waterSupply },
      wifiAvailability: { table: varToTable.amenitiesAndServices, column: varToColumn.wifiAvailability },
      carParking: { table: varToTable.amenitiesAndServices, column: varToColumn.carParking },
      conciergeServices: { table: varToTable.amenitiesAndServices, column: varToColumn.conciergeServices },
      businessServices: { table: varToTable.amenitiesAndServices, column: varToColumn.businessServices },
      conferenceRooms: { table: varToTable.amenitiesAndServices, column: varToColumn.conferenceRooms },

      // Family Facilities
      laundryFacilities: { table: varToTable.familyFacilities, column: varToColumn.laundryFacilities },
      restaurant: { table: varToTable.familyFacilities, column: varToColumn.restaurant },
      bar: { table: varToTable.familyFacilities, column: varToColumn.bar },
      shoppingFacilities: { table: varToTable.familyFacilities, column: varToColumn.shoppingFacilities },
      retailShops: { table: varToTable.familyFacilities, column: varToColumn.retailShops },
      hospitalityServices: { table: varToTable.familyFacilities, column: varToColumn.hospitalityServices },
      clubhouseAccess: { table: varToTable.familyFacilities, column: varToColumn.clubhouseAccess },
      swimmingPool: { table: varToTable.familyFacilities, column: varToColumn.swimmingPool },
      fitnessCenter: { table: varToTable.familyFacilities, column: varToColumn.fitnessCenter },
      marinaStore: { table: varToTable.familyFacilities, column: varToColumn.marinaStore },
      chandlery: { table: varToTable.familyFacilities, column: varToColumn.chandlery },
      laundryServices: { table: varToTable.familyFacilities, column: varToColumn.laundryServices },
      gymFacilities: { table: varToTable.familyFacilities, column: varToColumn.gymFacilities },
      sanitationnFacilities: { table: varToTable.familyFacilities, column: varToColumn.sanitationnFacilities },
      familyFriendlyAmenities: { table: varToTable.familyFacilities, column: varToColumn.familyFriendlyAmenities },
      petFriendlyServices: { table: varToTable.familyFacilities, column: varToColumn.petFriendlyServices },
      iceAvailability: { table: varToTable.familyFacilities, column: varToColumn.iceAvailability },
      picnicAndBBQAreas: { table: varToTable.familyFacilities, column: varToColumn.picnicAndBBQAreas },
      childrensPlayArea: { table: varToTable.familyFacilities, column: varToColumn.childrensPlayArea },

      // Financial Information
      currency: { table: varToTable.financialInformation, column: varToColumn.currency },
    };

    // Validate filterName against filtersConfig
    if (!filtersConfig[filterName]) {
      return res.status(400).json({ ok: false, message: "Invalid filter name." });
    }

    // Ensure the tableName matches the expected table in the filter config
    const filterConfig = filtersConfig[filterName];
    if (filterConfig.table !== tableName) {
      return res.status(400).json({ ok: false, message: "Invalid table for the given filterName." });
    }

    connection = await dbConnection.getConnection();

    // Prepare and execute query for the requested columns
    const queries = filterColumns.map(col => {
      if (col !== filterConfig.column) {
        return null;
      }
      return `SELECT \`${col}\`, COUNT(*) AS occurrence_cnt FROM \`${tableName}\` GROUP BY \`${col}\`;`;
    }).filter(query => query !== null);

    const results = await Promise.all(queries.map(query => connection.query(query)));

    // Prepare the response data
    const responseData = {};
    filterColumns.forEach((col, index) => {
      responseData[col] = results[index];
    });

    return res.status(200).json({
      ok: true,
      data: responseData,
    });

  } catch (err) {
    console.error("Error in /filterByTable:", err);
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});


export default searchBerthRouter;