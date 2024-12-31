import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import EngineCard from "../EngineCard";
// import CustomDatePicker from "../CustomDatePicker";
import Pagination from "../CustomPagination";
import SearchBar from "../SearchBar";
// import axios from "axios";
import { fetchColumns } from "../../api/searchEngineApi";
import DropdownWithRadioButtons from "../DropdownWithRadioButtons";

import Loader from "../Loader";
import "./engineSearch.scss";
const Engines = () => {
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [distinctValues, setDistinctValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [engines, setEngines] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(27); // Fixed limit
  const [search, setSearch] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 21,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedOptions, setSelectedOptions] = useState({
    condition_1: "",
    used_condition: "",
    seller: "",
    offered_by: "",
    broker_valuation: "",
    marisail_vesselid: [],
    engine_make: [],
    engine_classifiable: [],
    engine_certification: [],
    engine_model: [],
    engine_modelyear: "",
    engine_type: [],
    type_designation: [],
    engine_year: [],
    ce_category: [],
    number_drives: [],
    number_engines: [],
    range: [],
    cruise_speed: [],
    drive_type: [],
    engine_hours: [],
    ignition_system: "",
    noiselevel_db: "",
    asking_price: [],

    // Transmission
    transmission_type: [],
    flywheel_SAE: [],
    // Installation and mounting
    engine_mounting_type: [],
    engine_block: "",
    availability_of_spare_parts: "",
    last_service_date: [],
    EMS: [],
    engine_control_system: [],
    turbocharger: [],
    heat_exchanger: [],
    sea_waterpump: [],

    // dimensions
    engine_weight: [],
    height: [],
    width: [],
    lenght: [],
    displacement: [],
    dry_weight: [],
    // performace
    engine_performance: [],
    max_poweroutput: [],
    max_power: [],
    max_speed: [],
    engine_speedrange: [],
    engine_efficiency: [],
    // cylinders
    bore_stroke: "",
    bore: [],
    number_cylinders: [],
    number_valves: [],
    // RMP
    rated_speed: [],
    // Torque
    max_torque: [],
    max_torquerpm: "",
    // cooiling system
    after_cooled: [],
    cooling_system: "",
    cooling_type: "",
    cooling_fluidtype: [],
    lubrication_sytem: "",
    circulation_pumptype: [],
    rawwater_pumptype: [],
    // propulsion
    propulsion: [],
    bowthruster: "",
    propulsion_systemtype: [],
    propeller_bladematerial: "",
    steering_controltype: [],
    trim_system: [],
    // fuel
    fuel_filtertype: [],
    fuel_system: "",
    fuel_type: [],
    fuel_reserve: [],
    fuel_consumptionrate: "",
    Fuel_tankmaterial: "",
    //Emmissions & Environment
    exhaust_system: [],
    exhaust_systemtype: [],
    // Electrical System
    alternator: [],
    battery_type: [],
    //oil
    oil_filtertype: [],
  });

  const dropdownConfig = {
    marisail_vesselid: {
      tableName: "engine_general",
      columnName: "marisail_vesselid",
    },
    engine_make: {
      tableName: "engine_general",
      columnName: "engine_make",
    },
    engine_model: {
      tableName: "engine_general",
      columnName: "engine_model",
    },
    engine_modelyear: {
      tableName: "engine_general",
      columnName: "engine_modelyear",
    },
    engine_type: {
      tableName: "engine_general",
      columnName: "engine_type",
    },
    type_designation: {
      tableName: "engine_general",
      columnName: "type_designation",
    },
    asking_price: {
      tableName: "engine_general",
      columnName: "asking_price",
    },
    condition_1: {
      tableName: "engine_general",
      columnName: "condition_1",
    },
    used_condition: {
      tableName: "engine_general",
      columnName: "used_condition",
    },
    seller: {
      tableName: "engine_general",
      columnName: "seller",
    },
    offered_by: {
      tableName: "engine_general",
      columnName: "offered_by",
    },
    broker_valuation: {
      tableName: "engine_general",
      columnName: "broker_valuation",
    },
    engine_classifiable: {
      tableName: "engine_general",
      columnName: "engine_classifiable",
    },
    engine_certification: {
      tableName: "engine_general",
      columnName: "engine_certification",
    },
    engine_year: {
      tableName: "engine_general",
      columnName: "engine_year",
    },
    ce_category: {
      tableName: "engine_general",
      columnName: "ce_category",
    },
    number_drives: {
      tableName: "engine_general",
      columnName: "number_drives",
    },
    number_engines: {
      tableName: "engine_general",
      columnName: "number_engines",
    },
    range: {
      tableName: "engine_general",
      columnName: "range",
    },
    engine_range: {
      tableName: "engine_general",
      columnName: "engine_range",
    },
    cruise_speed: {
      tableName: "engine_general",
      columnName: "cruise_speed",
    },
    drive_type: {
      tableName: "engine_general",
      columnName: "drive_type",
    },
    engine_hours: {
      tableName: "engine_general",
      columnName: "engine_hours",
    },
    ignition_system: {
      tableName: "engine_general",
      columnName: "ignition_system",
    },
    noiselevel_db: {
      tableName: "engine_general",
      columnName: "noiselevel_db",
    },
    transmission_type: {
      tableName: "engine_transmission",
      columnName: "transmission_type",
    },
    flywheel_SAE: {
      tableName: "engine_transmission",
      columnName: "flywheel_SAE",
    },
    engine_mountingtype: {
      tableName: "engine_mounting",
      columnName: "engine_mountingtype",
    },
    engine_block: {
      tableName: "engine_mounting",
      columnName: "engine_block",
    },
    availability_spareparts: {
      tableName: "engine_maintenance",
      columnName: "availability_spareparts",
    },
    last_servicedate: {
      tableName: "engine_maintenance",
      columnName: "last_servicedate",
    },
    EMS: {
      tableName: "engine_equipment",
      columnName: "EMS",
    },
    engine_controlsystem: {
      tableName: "engine_equipment",
      columnName: "engine_controlsystem",
    },
    turbo_charging: {
      tableName: "engine_equipment",
      columnName: "turbo_charging",
    },
    heat_exchanger: {
      tableName: "engine_equipment",
      columnName: "heat_exchanger",
    },
    seawater_pump: {
      tableName: "engine_equipment",
      columnName: "seawater_pump",
    },
    displacement: {
      tableName: "engine_dimensions",
      columnName: "displacement",
    },
    lenght: {
      tableName: "engine_dimensions",
      columnName: "lenght",
    },
    width: {
      tableName: "engine_dimensions",
      columnName: "width",
    },
    height: {
      tableName: "engine_dimensions",
      columnName: "height",
    },
    engine_weight: {
      tableName: "engine_dimensions",
      columnName: "engine_weight",
    },
    dry_weight: {
      tableName: "engine_dimensions",
      columnName: "dry_weight",
    },
    engine_performance: {
      tableName: "engine_performance",
      columnName: "engine_performance",
    },
    max_poweroutput: {
      tableName: "engine_performance",
      columnName: "max_poweroutput",
    },
    max_power: {
      tableName: "engine_performance",
      columnName: "max_power",
    },
    max_speed: {
      tableName: "engine_performance",
      columnName: "max_speed",
    },
    engine_speedrange: {
      tableName: "engine_performance",
      columnName: "engine_speedrange",
    },
    engine_efficiency: {
      tableName: "engine_performance",
      columnName: "engine_efficiency",
    },
    number_cylinders: {
      tableName: "engine_performance",
      columnName: "number_cylinders",
    },
    number_valves: {
      tableName: "engine_performance",
      columnName: "number_valves",
    },
    bore: {
      tableName: "engine_performance",
      columnName: "bore",
    },
    bore_stroke: {
      tableName: "engine_performance",
      columnName: "bore_stroke",
    },
    rated_speed: {
      tableName: "engine_performance",
      columnName: "rated_speed",
    },
    max_torque: {
      tableName: "engine_performance",
      columnName: "max_torque",
    },
    max_torquerpm: {
      tableName: "engine_performance",
      columnName: "max_torquerpm",
    },
    after_cooled: {
      tableName: "engine_cooling",
      columnName: "after_cooled",
    },
    cooling_system: {
      tableName: "engine_cooling",
      columnName: "cooling_system",
    },
    cooling_type: {
      tableName: "engine_cooling",
      columnName: "cooling_type",
    },
    lubrication_sytem: {
      tableName: "engine_cooling",
      columnName: "lubrication_sytem",
    },
    cooling_fluidtype: {
      tableName: "engine_cooling",
      columnName: "cooling_fluidtype",
    },
    circulation_pumptype: {
      tableName: "engine_cooling",
      columnName: "circulation_pumptype",
    },
    rawwater_pumptype: {
      tableName: "engine_cooling",
      columnName: "rawwater_pumptype",
    },
    propulsion: {
      tableName: "engine_propulsion",
      columnName: "propulsion",
    },
    bowthruster: {
      tableName: "engine_propulsion",
      columnName: "bowthruster",
    },
    propulsion_systemtype: {
      tableName: "engine_propulsion",
      columnName: "propulsion_systemtype",
    },
    propeller_bladematerial: {
      tableName: "engine_propulsion",
      columnName: "propeller_bladematerial",
    },
    steering_controltype: {
      tableName: "engine_propulsion",
      columnName: "steering_controltype",
    },
    trim_system: {
      tableName: "engine_propulsion",
      columnName: "trim_system",
    },
    trim_tab_type: {
      tableName: "engine_propulsion",
      columnName: "trim_tab_type",
    },
    fuel_filtertype: {
      tableName: "engine_fuel",
      columnName: "fuel_filtertype",
    },
    fuel_system: {
      tableName: "engine_fuel",
      columnName: "fuel_system",
    },
    fuel_type: {
      tableName: "engine_fuel",
      columnName: "fuel_type",
    },
    fuel_reserve: {
      tableName: "engine_fuel",
      columnName: "fuel_reserve",
    },
    fuel_consumptionrate: {
      tableName: "engine_fuel",
      columnName: "fuel_consumptionrate",
    },
    Fuel_tankmaterial: {
      tableName: "engine_fuel",
      columnName: "Fuel_tankmaterial",
    },
    oil_filtertype: {
      tableName: "engine_oil",
      columnName: "oil_filtertype",
    },
    alternator: {
      tableName: "engine_electrical",
      columnName: "alternator",
    },
    battery_type: {
      tableName: "engine_electrical",
      columnName: "battery_type",
    },
    exhaust_system: {
      tableName: "engine_emissions",
      columnName: "exhaust_system",
    },
    exhaust_systemtype: {
      tableName: "engine_emissions",
      columnName: "exhaust_systemtype",
    },
  };

  const getSelectionData = () => {
    const tables = new Set();
    const columns = new Set();
    const values = [];

    Object.keys(selectedOptions).forEach((category) => {
      const config = dropdownConfig[category];
      if (!config) {
        console.error(
          `No config found for category "${category}". Skipping this category.`
        );
        return;
      }

      const { tableName, columnName } = config;
      const value = selectedOptions[category];

      if (value && value.length > 0) {
        tables.add(tableName);
        columns.add(columnName);
        values.push(Array.isArray(value) ? value : [value]);
      }
    });

    return {
      tables: JSON.stringify(Array.from(tables)),
      columns: JSON.stringify(Array.from(columns)),
      values: JSON.stringify(values),
    };
  };

  // Function to fetch results from the API
  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      let { tables = [], columns = [], values = [] } = getSelectionData();

      // Construct the API URL
      const url = `http://localhost:3001/api/search_engine/engines?tables=${tables}&columns=${columns}&values=${values}&page=${pagination.currentPage}&limit=${pagination.limit}`;

      // Fetch data from the API
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch engines");
      }

      const data = await response.json();

      // Update state with fetched data
      setEngines(data.data);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalRecords: data.pagination.totalRecords,
        limit: data.pagination.limit,
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("Failed to fetch engines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [selectedOptions, pagination.currentPage]);

  // today
  useEffect(() => {
    const loadColumns = async () => {
      try {
        const columnList = await fetchColumns(tableName);
        setColumns(columnList);
        if (columnList.length > 0) {
          setSelectedColumn(columnList[0]); // Set default column
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadColumns();
  }, []);

  const handleSearchChange = (e) => {
    console.log("Search input changed:", e.target.value);
    setSearch(e.target.value);
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleSingleSelectOption = (category, option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [category]: option,
    }));
  };
  const handleMultiSelectOption = (category, updatedOptions) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [category]: updatedOptions,
    }));
  };
  const allSelectedOptions = Object.values(selectedOptions)
    .filter((value) => value && (typeof value !== "object" || value.length > 0))
    .flat();
  const removeTag = (tag) => {
    setSelectedOptions((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((key) => {
        if (Array.isArray(newState[key])) {
          newState[key] = newState[key].filter((option) => option !== tag);
        } else if (newState[key] === tag) {
          newState[key] = "";
        }
      });

      return newState;
    });
  };
  const resetTags = () => {
    setSelectedOptions([]);
  };
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <Row>
        <Col md={3}>
          <Row>
            <h4 className="py-3" style={{ marginBottom: "0.5rem" }}>
              Search For Engines
            </h4>
          </Row>
          <Row>
            <SearchBar
              selectedTags={allSelectedOptions}
              removeTag={removeTag}
              onChange={handleSearchChange}
              resetTags={resetTags}
            />
          </Row>
          <Row>
            <fieldset>
              <legend className="fieldset-legend">
                <h6>Engine Details</h6>
              </legend>

              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Make"
                      selectedOptions={selectedOptions}
                      category="engine_make"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="engine_make"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Model"
                      selectedOptions={selectedOptions}
                      category="engine_model"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="engine_model"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Engine Model Year"
                      selectedOptions={selectedOptions}
                      category="engine_modelyear"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_general"
                      columnName="engine_modelyear"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Type"
                      selectedOptions={selectedOptions}
                      category="engine_type"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="engine_type"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Type Designation"
                      selectedOptions={selectedOptions}
                      category="type_designation"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="type_designation"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Asking Price"
                      selectedOptions={selectedOptions}
                      category="asking_price"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="asking_price"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Condition</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Condition"
                      selectedOptions={selectedOptions}
                      category="condition_1"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_general"
                      columnName="condition_1"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Used Condition"
                      selectedOptions={selectedOptions}
                      category="used_condition"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_general"
                      columnName="used_condition"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Seller"
                      selectedOptions={selectedOptions}
                      category="seller"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_general"
                      columnName="seller"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Offered By"
                      selectedOptions={selectedOptions}
                      category="offered_by"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_general"
                      columnName="offered_by"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Broker Valuation"
                      selectedOptions={selectedOptions}
                      category="broker_valuation"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_general"
                      columnName="broker_valuation"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>General</h6>
              </legend>

              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Classification"
                      selectedOptions={selectedOptions}
                      category="engine_classifiable"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="engine_classifiable"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Certification"
                      selectedOptions={selectedOptions}
                      category="engine_certification"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="engine_certification"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Year"
                      selectedOptions={selectedOptions}
                      category="engine_year"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="engine_year"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="CE Design Category"
                      selectedOptions={selectedOptions}
                      category="ce_category"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="ce_category"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Number Drives"
                      selectedOptions={selectedOptions}
                      category="number_drives"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="number_drives"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Number Engines"
                      selectedOptions={selectedOptions}
                      category="number_engines"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="number_engines"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Range (Miles)"
                      selectedOptions={selectedOptions}
                      category="engine_range"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="engine_range"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Cruising Speed (Knots)"
                      selectedOptions={selectedOptions}
                      category="cruise_speed"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="cruise_speed"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Drive Type"
                      selectedOptions={selectedOptions}
                      category="drive_type"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="drive_type"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Hours"
                      selectedOptions={selectedOptions}
                      category="engine_hours"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_general"
                      columnName="engine_hours"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Ignition System (Starting)"
                      selectedOptions={selectedOptions}
                      category="ignition_system"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_general"
                      columnName="ignition_system"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Noise Level (dB)"
                      selectedOptions={selectedOptions}
                      category="noiselevel_db"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_general"
                      columnName="noiselevel_db"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Transmission</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Transmission Type"
                      selectedOptions={selectedOptions}
                      category="transmission_type"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_transmission"
                      columnName="transmission_type"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Flywheel SAE 14"
                      selectedOptions={selectedOptions}
                      category="flywheel_SAE"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_transmission"
                      columnName="flywheel_SAE"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6> Installation and Mounting</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Mounting Type "
                      selectedOptions={selectedOptions}
                      category="engine_mountingtype"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_mounting"
                      columnName="engine_mountingtype"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Engine Block"
                      selectedOptions={selectedOptions}
                      category="engine_block"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_mounting"
                      columnName="engine_block"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Service & Maintenance</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Availability of Spare Parts"
                      selectedOptions={selectedOptions}
                      category="availability_spareparts"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_maintenance"
                      columnName="availability_spareparts"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Last Service Date"
                      selectedOptions={selectedOptions}
                      category="last_servicedate"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_maintenance"
                      columnName="last_servicedate"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Equipment</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Management System (EMS)"
                      selectedOptions={selectedOptions}
                      category="EMS"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_equipment"
                      columnName="EMS"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Control System"
                      selectedOptions={selectedOptions}
                      category="engine_controlsystem"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_equipment"
                      columnName="engine_controlsystem"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Turbocharger"
                      selectedOptions={selectedOptions}
                      category="turbo_charging"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_equipment"
                      columnName="turbo_charging"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Heat Exchanger"
                      selectedOptions={selectedOptions}
                      category="heat_exchanger"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_equipment"
                      columnName="heat_exchanger"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Sea Water Pump"
                      selectedOptions={selectedOptions}
                      category="seawater_pump"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_equipment"
                      columnName="seawater_pump"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Dimensions</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Displacement"
                      selectedOptions={selectedOptions}
                      category="displacement"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_dimensions"
                      columnName="displacement"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Length (mm)"
                      selectedOptions={selectedOptions}
                      category="lenght"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_dimensions"
                      columnName="lenght"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Width (mm)"
                      selectedOptions={selectedOptions}
                      category="width"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_dimensions"
                      columnName="width"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Height (mm)"
                      selectedOptions={selectedOptions}
                      category="height"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_dimensions"
                      columnName="height"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Weight"
                      selectedOptions={selectedOptions}
                      category="engine_weight"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_dimensions"
                      columnName="engine_weight"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Dry Weight (Kg)"
                      selectedOptions={selectedOptions}
                      category="dry_weight"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_dimensions"
                      columnName="dry_weight"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Performance</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Engine Performance"
                      selectedOptions={selectedOptions}
                      category="engine_performance"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_performance"
                      columnName="engine_performance"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title=" Max Power Output"
                      selectedOptions={selectedOptions}
                      category="max_poweroutput"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_performance"
                      columnName="max_poweroutput"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Max. Power (BHP)"
                      selectedOptions={selectedOptions}
                      category="max_power"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_performance"
                      columnName="max_power"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Max. Speed (Knots)"
                      selectedOptions={selectedOptions}
                      category="max_speed"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_performance"
                      columnName="max_speed"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Engine Speed Range (RPM)"
                      selectedOptions={selectedOptions}
                      category="engine_speedrange"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_performance"
                      columnName="engine_speedrange"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Engine Efficiency"
                      selectedOptions={selectedOptions}
                      category="engine_efficiency"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_performance"
                      columnName="engine_efficiency"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Cylinders</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Number Cylinders"
                      selectedOptions={selectedOptions}
                      category="number_cylinders"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_performance"
                      columnName="number_cylinders"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title=" Number Valves"
                      selectedOptions={selectedOptions}
                      category="number_valves"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_performance"
                      columnName="number_valves"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Bore"
                      selectedOptions={selectedOptions}
                      category="bore"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_performance"
                      columnName="bore"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Stroke"
                      selectedOptions={selectedOptions}
                      category=" bore_stroke"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_performance"
                      columnName="bore_stroke"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>RPM</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Rated Speed (RPM)"
                      selectedOptions={selectedOptions}
                      category="rated_speed"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_performance"
                      columnName="rated_speed"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Torque</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Maximum Torque (Nm)"
                      selectedOptions={selectedOptions}
                      category="max_torque"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_performance"
                      columnName="max_torque"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Maximum Torque At Speed (RPM)"
                      selectedOptions={selectedOptions}
                      category="max_torquerpm"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_performance"
                      columnName="max_torquerpm"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Cooling System</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Aftercooled"
                      selectedOptions={selectedOptions}
                      category="after_cooled"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_cooling"
                      columnName="after_cooled"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title=" Cooling System"
                      selectedOptions={selectedOptions}
                      category="cooling_system"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_cooling"
                      columnName="cooling_system"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Type Of Cooling"
                      selectedOptions={selectedOptions}
                      category="cooling_type"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_cooling"
                      columnName="cooling_type"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Lubrication System"
                      selectedOptions={selectedOptions}
                      category="lubrication_sytem"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_cooling"
                      columnName="lubrication_sytem"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Cooling Fluid Type"
                      selectedOptions={selectedOptions}
                      category="cooling_fluidtype"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_cooling"
                      columnName="cooling_fluidtype"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Circulation Pump Type"
                      selectedOptions={selectedOptions}
                      category="circulation_pumptype"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_cooling"
                      columnName="circulation_pumptype"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Raw Water Pump Type"
                      selectedOptions={selectedOptions}
                      category="rawwater_pumptype"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_cooling"
                      columnName="rawwater_pumptype"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Propulsion System</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Propulsion"
                      selectedOptions={selectedOptions}
                      category="propulsion"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_propulsion"
                      columnName="propulsion"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title=" Bowthruster"
                      selectedOptions={selectedOptions}
                      category="bowthruster"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_propulsion"
                      columnName="bowthruster"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Propulsion System Type"
                      selectedOptions={selectedOptions}
                      category="propulsion_systemtype"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_propulsion"
                      columnName="propulsion_systemtype"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Propeller Blade Material"
                      selectedOptions={selectedOptions}
                      category="propeller_bladematerial"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_propulsion"
                      columnName="propeller_bladematerial"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Steering Control Type"
                      selectedOptions={selectedOptions}
                      category="steering_controltype"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_propulsion"
                      columnName="steering_controltype"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Trim System"
                      selectedOptions={selectedOptions}
                      category="trim_system"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_propulsion"
                      columnName="trim_system"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Trim Tab Type"
                      selectedOptions={selectedOptions}
                      category="trim_tab_type"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_propulsion"
                      columnName="rawwater_pumptype"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Fuel System</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Fuel Filter Type"
                      selectedOptions={selectedOptions}
                      category="fuel_filtertype"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_fuel"
                      columnName="fuel_filtertype"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title=" Fuel System"
                      selectedOptions={selectedOptions}
                      category="fuel_system"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_fuel"
                      columnName="fuel_system"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Fuel Type"
                      selectedOptions={selectedOptions}
                      category="fuel_type"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_fuel"
                      columnName="fuel_type"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Fuel Consumption At Cruising Speed (Litres)"
                      selectedOptions={selectedOptions}
                      category="fuel_reserve"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_fuel"
                      columnName="fuel_reserve"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Fuel Consumption Rate"
                      selectedOptions={selectedOptions}
                      category="fuel_consumptionrate"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_fuel"
                      columnName="fuel_consumptionrate"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithRadioButtons
                      title="Fuel Tank Material"
                      selectedOptions={selectedOptions}
                      category="Fuel_tankmaterial"
                      onSelect={handleSingleSelectOption}
                      tableName="engine_fuel"
                      columnName="Fuel_tankmaterial"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Oil</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Oil Filter Type"
                      selectedOptions={selectedOptions}
                      category="oil_filtertype"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_oil"
                      columnName="oil_filtertype"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Electrical System</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Alternator"
                      selectedOptions={selectedOptions}
                      category="alternator"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_electrical"
                      columnName="alternator"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Battery Type"
                      selectedOptions={selectedOptions}
                      category="battery_type"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_electrical"
                      columnName="battery_type"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset>
              <legend className="fieldset-legend">
                <h6>Emissions & Environment</h6>
              </legend>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Exhaust System"
                      selectedOptions={selectedOptions}
                      category="exhaust_system"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_emissions"
                      columnName="exhaust_system"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="row-margin">
                <Col md={12}>
                  <Form.Group>
                    <DropdownWithCheckBoxes
                      title="Exhaust System Type"
                      selectedOptions={selectedOptions}
                      category="exhaust_systemtype"
                      onSelect={handleMultiSelectOption}
                      tableName="engine_emissions"
                      columnName="exhaust_systemtype"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>
          </Row>
        </Col>
        <Col md={9}>
          <Row>
            <Col md={12}>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "200",
                  padding: "20px",
                }}
              >
                Engines For Sale
              </h1>
            </Col>
          </Row>
          {loading ? (
            // <p>Loading...</p>
            <Loader />
          ) : (
            <Row>
              {engines.length === 0 ? (
                <Col md={12}>
                  <p>No Results Found</p>
                </Col>
              ) : (
                engines.map((engine) => (
                  <Col key={engine.engine_id} md={4}>
                    <EngineCard {...engine} />
                  </Col>
                ))
              )}
            </Row>
          )}
          {!loading ? <Pagination totalPages={pagination.totalPages} /> : <></>}
        </Col>
      </Row>
    </Container>
  );
};

export default Engines;
