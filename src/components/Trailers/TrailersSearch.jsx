import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useReducer } from "react";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import Loader from "../Loader";
import TrailerCard from "../TrailerCard";
import ResetBar from "../ResetBar";
import { varToScreen } from "./trailerInfo";
import RangeInput from "../RangeInput";
import { v4 as uuidv4 } from "uuid";

// import TimePicker from "react-time-picker";
// import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';
// import DatePickerComponent from "../DatePickerComponent";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function TrailersSearch() {
  const [selectedRadios, setSelectedRadios] = useState({});
  const [trailers, setTrailers] = useState([]);
  const [page, setPage] = useState(0);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  // const [lastpage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const toggleReducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE":
        return {
          ...state,
          [action.key]: !state[action.key],
        };
      default:
        return state;
    }
  };
  const [openStates, dispatch] = useReducer(toggleReducer, {});
  const toggleAccordion = (key) => {
    dispatch({ type: "TOGGLE", key });
  };
  const [identification, setIdentification] = useState({
    manufacturer: [],
    make: [],
    model: [],
    year: [],
    askingPrice: [],
  });
  const [basics, setBasics] = useState({
    type: [],
    gvwr: [],
    loadCapacity: [],
    length: [],
    width: [],
    totalHeight: [],
    axleHeightFromGround: [],
  });
  const [constructionMaterials, setConstructionMaterials] = useState({
    frameMaterial: [],
    frameCoating: [],
    frameCrossmemberType: [],
    frameWeldType: [],
    floorMaterial: [],
    sidesMaterial: [],
    roofMaterial: [],
  });
  const [maintenanceFeatures, setMaintenanceFeatures] = useState({
    bearingType: [],
  });
  const [userFeatures, setUserFeatures] = useState({
    // storage: [],
    tieDownPoints: [],
    // toolBox: [],
    bumperType: [],
  });
  const [specialFeatures, setSpecialFeatures] = useState({
    // hydraulicTilt: [],
    // extendableTongue: [],
    adjustableDeckHeight: [],
    // detachableSidePanels: [],
  });
  const [additionalAccessories, setAdditionalAccessories] = useState({
    rampType: [],
    winchPost: [],
    splashGuards: [],
    fenders: [],
    sideRails: [],
  });
  const [customizationOptions, setCustomizationOptions] = useState({
    color: [],
    // decals: [],
    // storageBox: [],
    // lightingPackage: [],
    // suspensionUpgrade: [],
  });

  const [axlesAndSuspension, setAxlesAndSuspension] = useState({
    axleType: [],
    axleCapacity: [],
    axleSealType: [],
    axleHubSize: [],
    // axlePosition: [],
    // dropAxleOption: [],
    suspensionType: [],
    suspensionCapacity: [],
    suspensionAdjustment: [],
  });
  const [tyresAndWheels, setTyresAndWheels] = useState({
    tyreSize: [],
    tyreLoadRange: [],
    tyreType: [],
    wheelType: [],
    // wheelBoltPattern: [],
    // hubLubricationSystem: [],
  });
  const [brakes, setBrakes] = useState({
    brakeType: [],
    // brakeActuator: [],
    // brakeLineMaterial: [],
    // brakeDrumDiameter: [],
    brakeFluidType: [],
    // brakes: [],
    couplerSize: [],
    couplerType: [],
    couplerLockType: [],
    // hitchClass: [],
    hitchReceiverSize: [],
    // safetyChains: [],
    // breakawaySystem: [],
  });
  const [winchAndWrinchAccessories, setWinchAndWrinchAccessories] = useState({
    winchType: [],
    winchCapacity: [],
    // winchRopeLength: [],
    // winchDrumMaterial: [],
    // winchGearRatio: [],
    // winchRemoteControl: [],
    winchBrakeType: [],
    winchCableType: [],
    // winchStrapLength: [],
    // winchHandleLength: [],
    // winchMounting: [],
  });

  const [lightingAndElectrical, setLightingAndElectrical] = useState({
    // lighting: [],
    // lightMountingPosition: [],
    lightType: [],
    electricalConnectorType: [],
    electricalWiringType: [],
    batteryType: [],
    batteryChargerType: [],
  });

  const [acessories, setAcessories] = useState({
    // spareTyreCarrier: [],
    spareTyreSize: [],
    // spareTyreMountingLocation: [],
    jackType: [],
    jackWheelType: [],
    jackCapacity: [],
    jackLiftHeight: [],
  });

  const [loadingAndTransportFeatures, setLoadingAndTransportFeatures] =
    useState({
      loadingSystem: [],
      // bunks: [],
      // bunkMaterial: [],
      // bunkWidth: [],
      bunkHeightAdjustment: [],
      // bunkMountingBracketMaterial: [],
      // rollers: [],
      // rollerMaterial: [],
      // rollerAxleDiameter: [],
    });

  const [securityFeatures, setSecurityFeatures] = useState({
    // wheelLocks: [],
    lockType: [],
    // alarmSystem: [],
    gpsTrackingDevice: [],
  });

  const [
    environmentalAndCorrosionResistance,
    setEnvironmentalAndCorrosionResistance,
  ] = useState({
    corrosionProtection: [],
    // rustInhibitors: [],
  });
  const [performanceAndHandling, setPerformanceAndHandling] = useState({
    // maximumSpeedRating: [],
    turningRadius: [],
  });
  const [tongue, setTongue] = useState({
    // tongueMaterial: [],
    // tongueShape: [],
    tongueJackWheelSize: [],
    tongueJackType: [],
    tongueWeight: [],
    // tongueWeightRatio: [],
  });

  // const [value, onChange] = useState("");
  const filters = {
    identification,
    basics,
    constructionMaterials,
    maintenanceFeatures,
    userFeatures,
    specialFeatures,
    additionalAccessories,
    customizationOptions,
    axlesAndSuspension,
    tyresAndWheels,
    brakes,
    winchAndWrinchAccessories,
    lightingAndElectrical,
    acessories,
    loadingAndTransportFeatures,
    securityFeatures,
    environmentalAndCorrosionResistance,
    performanceAndHandling,
    tongue,
  };

  const lookUpTable = {};
  Object.keys(filters).forEach((key) => {
    Object.keys(filters[key]).forEach((key2) => {
      lookUpTable[key2] = key;
    });
  });

  const handleRadioChange = (key2, value) => {
    console.log("001 Key 2--", key2, "--value--", value);
    setSelectedRadios((prev) => ({ ...prev, [key2]: value }));
  };

  const setStateFunctions = {
    identification: setIdentification,
    basics: setBasics,
    constructionMaterials: setConstructionMaterials,
    maintenanceFeatures: setMaintenanceFeatures,
    userFeatures: setUserFeatures,
    specialFeatures: setSpecialFeatures,
    additionalAccessories: setAdditionalAccessories,
    customizationOptions: setCustomizationOptions,
    axlesAndSuspension: setAxlesAndSuspension,
    tyresAndWheels: setTyresAndWheels,
    brakes: setBrakes,
    winchAndWrinchAccessories: setWinchAndWrinchAccessories,
    lightingAndElectrical: setLightingAndElectrical,
    acessories: setAcessories,
    loadingAndTransportFeatures: setLoadingAndTransportFeatures,
    securityFeatures: setSecurityFeatures,
    environmentalAndCorrosionResistance: setEnvironmentalAndCorrosionResistance,
    performanceAndHandling: setPerformanceAndHandling,
    tongue: setTongue,
  };

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
    if (setStateFunction) {
      setStateFunction(data);
    } else {
      console.error(`No setState function found for key: ${key}`);
    }
  }

  const cacheKey = "trailersFilterData";
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const URL = apiUrl + "/search_trailer/";

  // fetch all the count of the available columns
  var data;
  const fetchFilterData = async () => {
    for (const key of Object.keys(filters)) {
      try {
        const response = await fetch(`${URL}trailers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableName: key,
            filter: filters[key],
          }),
        });
        data = await response.json();
        setFilters(key, data.res);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("done");
      }
    }
  };

  function mergeSpaces(str) {
    return str.replace(/\s+/g, ' ').trim();
  }

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setFilters(JSON.parse(cachedData));
      console.log("Data fetched from cache", JSON.parse(cachedData));
    } else {
      // Fetch data if not cached
      fetchFilterData();
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    let currInfo = {
      selectedOptions: allSelectedOptions,
      page: page,
    };
    const fetchTrailerData = async () => {
      try {
        const response = await fetch(`${URL}trailersData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currInfo),
        });
        const data = await response.json();
        setTrailers(data?.res[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        console.log("done");
      }
    };

    fetchTrailerData();
  }, [allSelectedOptions, page, URL]);

  return (
    <Container>
      <Row>
        <Col md={3}>
          <Row>
            <h4
              className="py-3"
              // style={{ borderBottom: "2px solid #f5f5f5", width: "80%" }}
            >
              Search For Trailer
            </h4>
          </Row>
          <Row>
            <ResetBar
              selectedTags={allSelectedOptions}
              removeTag={removeTag}
              resetTags={resetTags}
            />
          </Row>
          <Row>
            {Object.keys(filters).map((key) => (
              <fieldset
                // style={{ borderBottom: "2px solid #f5f5f5", width: "80%" }}
                key={uuidv4()}
              >
                <legend className="fieldset-legend">
                  <h6
                    style={{
                      padding: "15px 0px 0px 0px",
                    }}
                  >
                    {varToScreen[key]?.displayText}
                  </h6>
                </legend>
                {Object.keys(filters[key]).map((key2) => (
                  <Row key={uuidv4()} className="row-margin">
                    <Col md={12}>
                      <Form.Group>
                        {varToScreen[key2].type != "range" && (
                          <DropdownWithCheckBoxes
                            heading={key2}
                            title={varToScreen[key2].displayText}
                            options={filters[key][key2]}
                            selectedOptions={allSelectedOptions}
                            setSelectedOptions={setAllSelectedOptions}
                          />
                        )}
                        {varToScreen[key2].type == "range" && (
                          <>
                            <RangeInput
                              key2={mergeSpaces(key2)}
                              title={varToScreen[key2].displayText}
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
                          </>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                ))}
              </fieldset>
            ))}
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
                Trailers For Sale
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
                    <Col key={uuidv4()} md={4}>
                      {/* <h1>{trailer}</h1> */}
                      <TrailerCard {...trailer} />
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
                disabled={page === 1}
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

{
  /* <div> */
}
{
  /* <TimePicker onChange={onChange} value={value} /> */
}
// <DatePickerComponent
//   label="Date of Birth"
//   value={value}
//   setValue={onChange}
//   setOpenKey={setOpenKey}
//   openKey={openKey}
//   isMandatory={true}
// />
// </div>;
