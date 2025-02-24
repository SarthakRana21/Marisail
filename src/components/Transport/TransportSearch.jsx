import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import Loader from "../Loader";
import BerthCard from "../BerthCard";
import ResetBar from "../ResetBar";
import { varToDb, varToScreen } from "./TransportInfo";
import TransportCard from "../TransportCard";
// import { number } from "prop-types";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function TransportSearch() {
  const [page, setPage] = useState(0);
  // const [lastpage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [allSelectedOptions, setAllSelectedOptions] = useState([]);

  const [jobDescription, setJobDescription] = useState({
    category: [],
    postedDate: [],
    deadlineDate: [],
    timescale: [],
    preferredDate: [],
    haulierToDepartureDistance: [],
    roundTripDistance: [],
    international: [],
    ferryRequired: [],
    specialHandlingRequirements: [],
    departureLoadingEquipmentNeeded: [],
    destinationUnloadingEquipmentNeeded: [],
    freightClass: [],
    overweightPermitNeeded: [],
    oversizePermitNeeded: [],
    numberQuotes: [],
  });

  const [vesselDetails, setVesselDetails] = useState({
    totalNumberItems: [],
    previousInsuranceClaims: [],
    existingDamage: [],
    boatDetails: [],
  });

  const [customerContactDetails, setCustomerContactDetails] = useState({
    customerType: [],
    customerCompanyName: [],
    collectionAddress: [],
  });

  const [notDefined, setNotDefined] = useState({
    priceLabel: [],
    priceDrop: [],
  });

  const filters = {
    // identification,
    jobDescription,
    vesselDetails,
    customerContactDetails,
    notDefined,
  };

  const setStateFunctions = {
    jobDescription: setJobDescription,
    vesselDetails: setVesselDetails,
    customerContactDetails: setCustomerContactDetails,
    notDefined: setNotDefined,
  };

  // const lookUpTable = {};
  // Object.keys(filters).forEach((key) => {
  //   Object.keys(filters[key]).forEach((key2) => {
  //     lookUpTable[key2] = key;
  //   });
  // });

  function removeTag(tag) {
    setAllSelectedOptions((prev) => {
      delete prev[tag];
      return { ...prev };
    });
  }

  function resetTags() {
    setAllSelectedOptions({});
  }

  function setFilters(key, data) {
    const setStateFunction = setStateFunctions[key];
    console.log(key);
    console.log(data);
    if (setStateFunction) {
      setStateFunction(data);
    } else {
      console.error(`No setState function found for key: ${key}`);
    }

    console.log("Data fetched from API", filters);
  }

  const cacheKey = "trailersFilterData";
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const URL = apiUrl + "/search_transport/";

  // fetch all the count of the available columns
  var data;
  // const fetchFilterData = async () => {
  //   for (const key of Object.keys(filters)) {
  //     console.log("filters", filters[key]);
  //     try {
  //       const response = await fetch(`${URL}transport`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           tableName: key,
  //           filter: filters[key],
  //         }),
  //       });

  //       data = await response.json();
  //       // console.log(data.res);
  //       setFilters(key, data.res);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       // console.log("done");
  //     }
  //   }

  //   // console.log("Data fetched from API", filters);
  //   // localStorage.setItem(cacheKey, JSON.stringify(filters));
  // };

  // useEffect(() => {
  //   const cachedData = localStorage.getItem(cacheKey);
  //   if (cachedData) {
  //     setFilters(JSON.parse(cachedData));
  //     console.log("Data fetched from cache", JSON.parse(cachedData));
  //   } else {
  //     // Fetch data if not cached
  //     fetchFilterData();
  //   }

  //   console.log(filters);
  // }, []);

  const fetchDropdownData = async (tableKey, columnKey, search, offSet) => {
    if (varToScreen[columnKey]?.type === "range" || tableKey === "notDefined")
      return;

    console.log("Fetching dropdown data for:", tableKey, columnKey, search);

    try {
      if (!varToScreen[columnKey]) {
        console.error(`Missing varToScreen mapping for ${columnKey}`);
        return;
      }
      console.log("/transport Put");
      setFetching(true);
      const response = await fetch(`${URL}transport`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteDetailsTable: tableKey,
          siteDetailsColumn: columnKey,
          searchString: search,
          offSet: offSet,
          appliedFilters: allSelectedOptions,
        }),
      });
      setFetching(false);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data?.ok || !data?.siteDetails?.data) {
        console.error("Invalid response format:", data);
        return;
      }

      // Clean and validate the data
      var cleanData = data.siteDetails.data
        .filter(Boolean) // Remove null/undefined values
        .map((value) => value); // Convert to string and trim whitespace

      // Update the state with the cleaned data
      // console.log(data,"Clean********************************")
      const setStateFunction = setStateFunctions[tableKey];
      if (setStateFunction) {
        // console.log("***********",cleanData,filters[tableKey][columnKey].length,offSet, offSet ==0)
        setStateFunction((prev) => ({
          ...prev,
          [columnKey]:
            offSet !== 0 ? [...prev[columnKey], ...cleanData] : cleanData,
        }));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  const [trailers, setTrailers] = useState([]);

  const removeFilter = (key, filter) => {
    const oldFilter = allSelectedOptions[key] || []; // Ensure it doesn't break if key is undefined
    const newFilter = oldFilter.filter((currFilter) => currFilter !== filter);

    setAllSelectedOptions((prev) => ({
      ...prev,
      [key]: newFilter, // Use newFilter instead of filter
    }));
  };

  useEffect(() => {
    setLoading(true);
    let currInfo = {
      selectedOptions: allSelectedOptions,
      page: page,
    };
    const fetchTrailerData = async () => {
      try {
        const response = await fetch(`${URL}transportData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currInfo),
        });

        const data = await response.json();
        // console.log(data);
        setTrailers(data.res[0]);
        // console.log("trailers", trailers);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);

        console.log("done");
      }
    };

    fetchTrailerData();
  }, [allSelectedOptions, page]);

  return (
    <Container>
      <Row>
        <Col md={3}>
          <Row>
            <h4
              className="py-3"
              // style={{ borderBottom: "2px solid #f5f5f5", width: "80%" }}
            >
              Search For Transport
            </h4>
          </Row>
          <Row>
            <ResetBar
              selectedTags={allSelectedOptions}
              removeTag={removeTag}
              resetTags={resetTags}
              removeFilter={removeFilter}
            />
          </Row>
          <Row>
            {Object.keys(filters).map((key) => {
              return (
                <fieldset key={key} className="mb-4">
                  <legend className="fieldset-legend">
                    <h6
                      style={{
                        padding: "15px 0px",

                        width: "100%",
                        display: "flex", // Use flex display
                        flexDirection: "row", // Arrange elements in a row
                        justifyContent: "space-between", // Space elements evenly
                        alignItems: "center", // Align vertically
                      }}
                    >
                      <span>{varToScreen[key]?.displayText}</span>
                      {/* <span
                                   className="count-badge"
                                   style={{
                                     background: "#007BFF",
                                     color: "#fff",
                                     padding: "5px 12px",
                                     borderRadius: "15px",
                                     fontSize: "14px",
                                     fontWeight: "600",
                                   }}
                                 >
                                   {allSelectedOptions[key]}
                                 </span> */}
                    </h6>
                  </legend>
                  {Object.keys(filters[key]).map((key2) => {
                    const uniqueKey = `${key}-${key2}`; // Unique key for each filter
                    return (
                      <Row key={uniqueKey} className="row-margin">
                        <Col md={12}>
                          <Form.Group>
                            {varToScreen[key2]?.type !== "range" ? (
                              <DropdownWithCheckBoxes
                                onOpen={(search, offSet) =>
                                  fetchDropdownData(
                                    key,
                                    key2,
                                    search,
                                    offSet,
                                    allSelectedOptions
                                  )
                                }
                                varToDb={varToDb}
                                heading={key2}
                                title={varToScreen[key2]?.displayText}
                                options={filters[key][key2] || []}
                                selectedOptions={allSelectedOptions}
                                setSelectedOptions={setAllSelectedOptions}
                                fetching={fetching}
                              />
                            ) : (
                              <RangeInput
                                key2={key2.replace(/\s+/g, " ").trim()}
                                title={varToScreen[key2]?.displayText}
                                fromValue={fromValue}
                                toValue={toValue}
                                setFromValue={setFromValue}
                                radioOptions={varToScreen[key2]?.radioOptions}
                                setToValue={setToValue}
                                selectedRadio={
                                  selectedRadios[key2] ||
                                  varToScreen[key2]?.radioOptions[0]?.value
                                }
                                onRadioChange={(value) =>
                                  handleRadioChange(key2, value)
                                }
                                isOpen={!!openStates[key2]}
                                toggleAccordion={() => toggleAccordion(key2)}
                              />
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                    );
                  })}
                </fieldset>
              );
            })}
          </Row>
        </Col>
        <Col md={9}>
          <Row>
            <Col md={12}>
              <h1
                style={{
                  fontSize: "28.8px",
                  fontWeight: "200",
                  padding: "20px",
                }}
              >
                Transport For Sale
              </h1>
            </Col>
          </Row>
          {loading ? (
            // <p>Loading...</p>
            <Loader />
          ) : (
            <Row>
              {trailers.length === 0 ? (
                <Col md={12}>
                  <p>No Results Found</p>
                </Col>
              ) : (
                trailers.map((trailer) => {
                  return (
                    <Col key={trailer} md={4}>
                      {/* <h1>{trailer.m}</h1> */}
                      <TransportCard {...trailer} />
                    </Col>
                  );
                })
              )}
            </Row>
          )}
          {/* {!loading ? <Pagination totalPages={pagination.totalPages} /> : <></>} */}

          <Row style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
              >
                Previous
              </button>
              {/* Page {page} of {pagination.totalPages} */}
              <span>Page {page + 1}</span>
              {/* <button
                key={page}
                className="active"
                // onClick={() => updatePage(page)}
              >
                {page}
              </button> */}
              <button
                onClick={() => handlePageChange(page + 1)}
                // disabled={page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

// import { useState, useEffect } from "react";
// import { Form, Container, Row, Col } from "react-bootstrap";
// import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes";
// import EngineCard from "../EngineCard";
// import SearchBar from "../SearchBar";
// import Pagination from "../CustomPagination";
// import { fetchColumns } from "../../api/searchEngineApi";
// import DropdownWithRadioButtons from "../DropdownWithRadioButtons";
// import Loader from "../Loader";
// const Transport = () => {
//     const [columns, setColumns] = useState([]);
//     const [selectedColumn, setSelectedColumn] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [engines, setEngines] = useState([]);
//     const [limit] = useState(27);
//     const [search, setSearch] = useState([]);
//     const [pagination, setPagination] = useState({
//         currentPage: 1,
//         totalPages: 1,
//         totalRecords: 0,
//         limit: 21,
//     });

//     const [selectedOptions, setSelectedOptions] = useState({
//         condition_1: "",
//         used_condition: "",
//         seller: "",
//         offered_by: "",
//         broker_valuation: "",
//         marisail_vesselid: [],
//         engine_make: [],
//         engine_classifiable: [],
//         engine_certification: [],
//         engine_model: [],
//         engine_modelyear: "",
//         engine_type: [],
//         type_designation: [],
//         engine_year: [],
//         ce_category: [],
//         number_drives: [],
//         number_engines: [],
//         range: [],
//         cruise_speed: [],
//         drive_type: [],
//         engine_hours: [],
//         ignition_system: "",
//         noiselevel_db: "",
//         asking_price: [],

//         // Transmission
//         transmission_type: [],
//         flywheel_SAE: [],
//         // Installation and mounting
//         engine_mounting_type: [],
//         engine_block: "",
//         availability_of_spare_parts: "",
//         last_service_date: [],
//         EMS: [],
//         engine_control_system: [],
//         turbocharger: [],
//         heat_exchanger: [],
//         sea_waterpump: [],

//         // dimensions
//         engine_weight: [],
//         height: [],
//         width: [],
//         lenght: [],
//         displacement: [],
//         dry_weight: [],
//         // performace
//         engine_performance: [],
//         max_poweroutput: [],
//         max_power: [],
//         max_speed: [],
//         engine_speedrange: [],
//         engine_efficiency: [],
//         // cylinders
//         bore_stroke: "",
//         bore: [],
//         number_cylinders: [],
//         number_valves: [],
//         // RMP
//         rated_speed: [],
//         // Torque
//         max_torque: [],
//         max_torquerpm: "",
//         // cooiling system
//         after_cooled: [],
//         cooling_system: "",
//         cooling_type: "",
//         cooling_fluidtype: [],
//         lubrication_sytem: "",
//         circulation_pumptype: [],
//         rawwater_pumptype: [],
//         // propulsion
//         propulsion: [],
//         bowthruster: "",
//         propulsion_systemtype: [],
//         propeller_bladematerial: "",
//         steering_controltype: [],
//         trim_system: [],
//         // fuel
//         fuel_filtertype: [],
//         fuel_system: "",
//         fuel_type: [],
//         fuel_reserve: [],
//         fuel_consumptionrate: "",
//         Fuel_tankmaterial: "",
//         //Emmissions & Environment
//         exhaust_system: [],
//         exhaust_systemtype: [],
//         // Electrical System
//         alternator: [],
//         battery_type: [],
//         //oil
//         oil_filtertype: [],
//     });

//     const dropdownConfig = {
//         marisail_vesselid: {
//             tableName: "engine_general",
//             columnName: "marisail_vesselid",
//         },
//         engine_make: {
//             tableName: "engine_general",
//             columnName: "engine_make",
//         },
//         engine_model: {
//             tableName: "engine_general",
//             columnName: "engine_model",
//         },
//         engine_modelyear: {
//             tableName: "engine_general",
//             columnName: "engine_modelyear",
//         },
//         engine_type: {
//             tableName: "engine_general",
//             columnName: "engine_type",
//         },
//         type_designation: {
//             tableName: "engine_general",
//             columnName: "type_designation",
//         },
//         asking_price: {
//             tableName: "engine_general",
//             columnName: "asking_price",
//         },
//         condition_1: {
//             tableName: "engine_general",
//             columnName: "condition_1",
//         },
//         used_condition: {
//             tableName: "engine_general",
//             columnName: "used_condition",
//         },
//         seller: {
//             tableName: "engine_general",
//             columnName: "seller",
//         },
//         offered_by: {
//             tableName: "engine_general",
//             columnName: "offered_by",
//         },
//         broker_valuation: {
//             tableName: "engine_general",
//             columnName: "broker_valuation",
//         },
//         engine_classifiable: {
//             tableName: "engine_general",
//             columnName: "engine_classifiable",
//         },
//         engine_certification: {
//             tableName: "engine_general",
//             columnName: "engine_certification",
//         },
//         engine_year: {
//             tableName: "engine_general",
//             columnName: "engine_year",
//         },
//         ce_category: {
//             tableName: "engine_general",
//             columnName: "ce_category",
//         },
//         number_drives: {
//             tableName: "engine_general",
//             columnName: "number_drives",
//         },
//         number_engines: {
//             tableName: "engine_general",
//             columnName: "number_engines",
//         },
//         range: {
//             tableName: "engine_general",
//             columnName: "range",
//         },
//         engine_range: {
//             tableName: "engine_general",
//             columnName: "engine_range",
//         },
//         cruise_speed: {
//             tableName: "engine_general",
//             columnName: "cruise_speed",
//         },
//         drive_type: {
//             tableName: "engine_general",
//             columnName: "drive_type",
//         },
//         engine_hours: {
//             tableName: "engine_general",
//             columnName: "engine_hours",
//         },
//         ignition_system: {
//             tableName: "engine_general",
//             columnName: "ignition_system",
//         },
//         noiselevel_db: {
//             tableName: "engine_general",
//             columnName: "noiselevel_db",
//         },
//         transmission_type: {
//             tableName: "engine_transmission",
//             columnName: "transmission_type",
//         },
//         flywheel_SAE: {
//             tableName: "engine_transmission",
//             columnName: "flywheel_SAE",
//         },
//         engine_mountingtype: {
//             tableName: "engine_mounting",
//             columnName: "engine_mountingtype",
//         },
//         engine_block: {
//             tableName: "engine_mounting",
//             columnName: "engine_block",
//         },
//         availability_spareparts: {
//             tableName: "engine_maintenance",
//             columnName: "availability_spareparts",
//         },
//         last_servicedate: {
//             tableName: "engine_maintenance",
//             columnName: "last_servicedate",
//         },
//         EMS: {
//             tableName: "engine_equipment",
//             columnName: "EMS",
//         },
//         engine_controlsystem: {
//             tableName: "engine_equipment",
//             columnName: "engine_controlsystem",
//         },
//         turbo_charging: {
//             tableName: "engine_equipment",
//             columnName: "turbo_charging",
//         },
//         heat_exchanger: {
//             tableName: "engine_equipment",
//             columnName: "heat_exchanger",
//         },
//         seawater_pump: {
//             tableName: "engine_equipment",
//             columnName: "seawater_pump",
//         },
//         displacement: {
//             tableName: "engine_dimensions",
//             columnName: "displacement",
//         },
//         lenght: {
//             tableName: "engine_dimensions",
//             columnName: "lenght",
//         },
//         width: {
//             tableName: "engine_dimensions",
//             columnName: "width",
//         },
//         height: {
//             tableName: "engine_dimensions",
//             columnName: "height",
//         },
//         engine_weight: {
//             tableName: "engine_dimensions",
//             columnName: "engine_weight",
//         },
//         dry_weight: {
//             tableName: "engine_dimensions",
//             columnName: "dry_weight",
//         },
//         engine_performance: {
//             tableName: "engine_performance",
//             columnName: "engine_performance",
//         },
//         max_poweroutput: {
//             tableName: "engine_performance",
//             columnName: "max_poweroutput",
//         },
//         max_power: {
//             tableName: "engine_performance",
//             columnName: "max_power",
//         },
//         max_speed: {
//             tableName: "engine_performance",
//             columnName: "max_speed",
//         },
//         engine_speedrange: {
//             tableName: "engine_performance",
//             columnName: "engine_speedrange",
//         },
//         engine_efficiency: {
//             tableName: "engine_performance",
//             columnName: "engine_efficiency",
//         },
//         number_cylinders: {
//             tableName: "engine_performance",
//             columnName: "number_cylinders",
//         },
//         number_valves: {
//             tableName: "engine_performance",
//             columnName: "number_valves",
//         },
//         bore: {
//             tableName: "engine_performance",
//             columnName: "bore",
//         },
//         bore_stroke: {
//             tableName: "engine_performance",
//             columnName: "bore_stroke",
//         },
//         rated_speed: {
//             tableName: "engine_performance",
//             columnName: "rated_speed",
//         },
//         max_torque: {
//             tableName: "engine_performance",
//             columnName: "max_torque",
//         },
//         max_torquerpm: {
//             tableName: "engine_performance",
//             columnName: "max_torquerpm",
//         },
//         after_cooled: {
//             tableName: "engine_cooling",
//             columnName: "after_cooled",
//         },
//         cooling_system: {
//             tableName: "engine_cooling",
//             columnName: "cooling_system",
//         },
//         cooling_type: {
//             tableName: "engine_cooling",
//             columnName: "cooling_type",
//         },
//         lubrication_sytem: {
//             tableName: "engine_cooling",
//             columnName: "lubrication_sytem",
//         },
//         cooling_fluidtype: {
//             tableName: "engine_cooling",
//             columnName: "cooling_fluidtype",
//         },
//         circulation_pumptype: {
//             tableName: "engine_cooling",
//             columnName: "circulation_pumptype",
//         },
//         rawwater_pumptype: {
//             tableName: "engine_cooling",
//             columnName: "rawwater_pumptype",
//         },
//         propulsion: {
//             tableName: "engine_propulsion",
//             columnName: "propulsion",
//         },
//         bowthruster: {
//             tableName: "engine_propulsion",
//             columnName: "bowthruster",
//         },
//         propulsion_systemtype: {
//             tableName: "engine_propulsion",
//             columnName: "propulsion_systemtype",
//         },
//         propeller_bladematerial: {
//             tableName: "engine_propulsion",
//             columnName: "propeller_bladematerial",
//         },
//         steering_controltype: {
//             tableName: "engine_propulsion",
//             columnName: "steering_controltype",
//         },
//         trim_system: {
//             tableName: "engine_propulsion",
//             columnName: "trim_system",
//         },
//         trim_tab_type: {
//             tableName: "engine_propulsion",
//             columnName: "trim_tab_type",
//         },
//         fuel_filtertype: {
//             tableName: "engine_fuel",
//             columnName: "fuel_filtertype",
//         },
//         fuel_system: {
//             tableName: "engine_fuel",
//             columnName: "fuel_system",
//         },
//         fuel_type: {
//             tableName: "engine_fuel",
//             columnName: "fuel_type",
//         },
//         fuel_reserve: {
//             tableName: "engine_fuel",
//             columnName: "fuel_reserve",
//         },
//         fuel_consumptionrate: {
//             tableName: "engine_fuel",
//             columnName: "fuel_consumptionrate",
//         },
//         Fuel_tankmaterial: {
//             tableName: "engine_fuel",
//             columnName: "Fuel_tankmaterial",
//         },
//         oil_filtertype: {
//             tableName: "engine_oil",
//             columnName: "oil_filtertype",
//         },
//         alternator: {
//             tableName: "engine_electrical",
//             columnName: "alternator",
//         },
//         battery_type: {
//             tableName: "engine_electrical",
//             columnName: "battery_type",
//         },
//         exhaust_system: {
//             tableName: "engine_emissions",
//             columnName: "exhaust_system",
//         },
//         exhaust_systemtype: {
//             tableName: "engine_emissions",
//             columnName: "exhaust_systemtype",
//         },
//     };

//     const getSelectionData = () => {
//         const tables = new Set();
//         const columns = new Set();
//         const values = [];
//         Object.keys(selectedOptions).forEach((category) => {
//             const config = dropdownConfig[category];
//             if (!config) {
//                 console.error(
//                     `No config found for category "${category}". Skipping this category.`
//                 );
//                 return;
//             }

//             const { tableName, columnName } = config;
//             const value = selectedOptions[category];

//             if (value && value.length > 0) {
//                 tables.add(tableName);
//                 columns.add(columnName);
//                 values.push(Array.isArray(value) ? value : [value]);
//             }
//         });

//         return {
//             tables: JSON.stringify(Array.from(tables)),
//             columns: JSON.stringify(Array.from(columns)),
//             values: JSON.stringify(values),
//         };
//     };

//     // Function to fetch results from the API
//     const fetchResults = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             let { tables = [], columns = [], values = [] } = getSelectionData();
//             const url = `http://localhost:3001/api/search_engine/engines?tables=${tables}&columns=${columns}&values=${values}&page=${pagination.currentPage}&limit=${pagination.limit}`;
//             const response = await fetch(url, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to fetch engines");
//             }

//             const data = await response.json();
//             // Update state with fetched data
//             setEngines(data.data);
//             setPagination({
//                 currentPage: data.pagination.currentPage,
//                 totalPages: data.pagination.totalPages,
//                 totalRecords: data.pagination.totalRecords,
//                 limit: data.pagination.limit,
//             });
//         } catch (error) {
//             console.error("Error fetching results:", error);
//             setError("Failed to fetch engines");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchResults();
//     }, [selectedOptions, pagination.currentPage]);

//     useEffect(() => {
//         const loadColumns = async () => {
//             try {
//                 const columnList = await fetchColumns(tableName);
//                 setColumns(columnList);
//                 if (columnList.length > 0) {
//                     setSelectedColumn(columnList[0]);
//                 }
//             } catch (err) {
//                 setError(err.message);
//             }
//         };

//         loadColumns();
//     }, []);
//     return (
//         <Container>
//             Page Under Construction
//         </Container>
//     );
// };

// export default Transport;
