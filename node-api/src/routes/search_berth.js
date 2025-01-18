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
      let tableNames = [];
      connection = await dbConnection.getConnection();

      // Check if the column exists
      const columnCheck = await connection.query(
          `SELECT COLUMN_NAME
          FROM information_schema.columns
          WHERE table_name = 'Marina_Port'
          AND table_schema = 'Marisail'
          AND column_name = 'Site_Details'`
      );

      // Check if the column exists
      if (columnCheck[0].length > 0) {
          const tables = await connection.query(
              `SELECT Site_Details, COUNT(*) AS occurrence_cnt
              FROM Marina_Port
              GROUP BY Site_Details;`
          );
          tableNames = tables[0].map((table) => Object.values(table));
      }

      return res.status(200).json({ ok: true, tables: tableNames });
  } catch (err) {
      console.error("Error in /berths GET:", err);
      return res.status(500).json({ ok: false, message: err.message });
  } finally {
      if (connection) {
          connection.release();
      }
  }
});
searchBerthRouter.post("/berths", async (req, res) => {
  let connection;
  const filter = req.body.filter;
  const tableName = varToTable[req.body.tableName];
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
        let tables;
        if (varToColumn[key] == "Beam") {
          tables = await connection.query(
            `SELECT
              CONCAT(FLOOR(( ${varToColumn[key]} - 1) / 10) * 10 + 1, '-', FLOOR(( ${varToColumn[key]} - 1) / 10) * 10 + 10) AS  ${varToColumn[key]}_Range,
              COUNT(*) AS occurrence_cnt
            FROM ${tableName} WHERE  ${varToColumn[key]} >= 1
            GROUP BY  ${varToColumn[key]}_Range
            ORDER BY  ${varToColumn[key]}_Range;`
          );
          console.log(
            "001 key--",
            tables[0].map((table) => Object.values(table))
          );
        } else {
          tables = await connection.query(
            `SELECT ${varToColumn[key]}, COUNT(*) AS occurrence_cnt
              FROM ${tableName}
              GROUP BY ${varToColumn[key]};`
          );
        }
        filter[key] = tables[0].map((table) => Object.values(table));
      }
    }

    return res.status(200).json({ ok: true, res: filter });
  } catch (err) {
    console.error("Error in /berths POST:", err);
    return res.status(500).json({ ok: false, message: err.message });
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