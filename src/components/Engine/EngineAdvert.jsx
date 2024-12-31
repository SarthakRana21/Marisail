import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import InputComponentDynamic from "../InputComponentDynamic";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "./EngineAdvertInfo";
import { makeString } from "../../services/common_functions";
import { useNavigate } from "react-router-dom"; 
import FormFieldCard from "../../services/FormFieldCard";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function EngineAdvert() {
  const navigate = useNavigate(); 
  const [error, setError] = useState({});
  const hasFetched = useRef(false);
  const [engines, setEngines] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [engineDetails, setEngineDetails] = useState({
    engineMake: "",
    engineModel: "",
    engineModelYear: "",
    engineType: "",
    typeDesignation: "",
    askingPrice: "",
  });
  const [condition, setCondition] = useState({
    condition: "",
    usedCondition: "",
    seller: "",
    offeredBy: "",
    lastSurveyDate: new Date(),
    brokerValuation: "",
  });
  const [general, setGeneral] = useState({
    engineClassification: "",
    certification: "",
    manufacturerWarranty: "",
    engineSerialNumber: "",
    ce_DesignCategory: "",
    numberDrives: "",
    numberEngines: "",
    rangeMiles: "",
    cruisingSpeed: "",
    driveType: "",
    engineHours: "",
    ignitionSystem: "",
    noiseLevel: "",
    engineSoundproofingKits: "",
  });
  const [transmission, setTransmission] = useState({
    transmissionType: "",
    gearShift: "",
    gearRatio: "",
    gearShiftType: "",
    flywheelSAE14: "",
    siluminFlywheelHousing: "",
    camShaft: "",
    camShaftAlloy: "",
    crankcaseDesign: "",
  });
  const [installationAndMounting, setInstallationAndMounting] = useState({
    engineMountingOrientation: "",
    engineSuspension: "",
    engineMountingType: "",
    mountingBracketMaterial: "",
    alignmentRequirements: "",
    engineBlock: "",
  });
  const [serviceAndMaintenance, setServiceAndMaintenance] = useState({
    scheduledMaintenancePlan: "",
    serviceInterval: "",
    maintenanceLogRequirements: "",
    availabilityOfSpareParts: "",
    operationMode: "",
    lastServiceDate: "",
  });
  const [equipment, setEquipment] = useState({
    engineManagementSystem: "",
    engineControlSystem: "",
    unitInjectors: "",
    turboCharger: "",
    turboCharging: "",
    starterMotor: "",
    protectionCovers: "",
    closedCrankcaseVentilation: "",
    heatExchanger: "",
    heatExchangerWithExpansionTank: "",
    seaWaterPump: "",
    seaWaterCooledChargeAirCooler: "",
    workingPrinciple: "",
    compressionRatio: "",
    pistonSpeedAt1500Rpm: "",
    pistonSpeedAt1800Rpm: "",
    firingOrder: "",
    pistons: "",
    connectionRods: "",
    auxiliaryPowerTakeOff: "",
    remoteControlSystems: "",
  });
  const [dimensions, setDimensions] = useState({
    displacement: "",
    length: "",
    width: "",
    height: "",
    lengthFromFrontEndOfFlywheelHousing: "",
    engineWeight: "",
    dryWeight: "",
    exclOilWeight: "",
    weightWithHeatExchanger: "",
    weightWithKeelCooling: "",
  });
  const [performance, setPerformance] = useState({
    nominalRating: "",
    enginePerformance: "",
    maxPowerOutput: "",
    maxPowerBHP: "",
    maxSpeedKnots: "",
    supercharged: "",
    valveTrain: "",
    grossPowerFullLoadKW: "",
    grossPowerFullLoadHpMetric: "",
    GrossPowerPropellerCurveKw: "",
    GrossPowerPropellerCurveHpMetric: "",
    grossTorque: "",
    powerToWeightRatio: "",
    engineEfficiency: "",
    engineSpeedRange: "",
    maximumContinuousRating: "",
    continuousPower: "",
  });
  const [cylinders, setCylinders] = useState({
    cylinderConfiguration: "",
    numberCylinders: "",
    cylindersAndArrangement: "",
    numberValves: "",
    valvePerCylinder: "",
    boreXStroke: "",
    bore: "",
    stroke: "",
  });
  const [rpm, setRpm] = useState({
    idleRPM: "",
    ratedSpeedRPM: "",
    rpmAtMaxPower: "",
  });
  const [torque, setTorque] = useState({
    maximumTorque: "",
    maximumTorqueAtSpeed: "",
    torqueAtRatedSpeed: "",
  });
  const [coolingSystem, setCoolingSystem] = useState({
    afterCooled: "",
    coolingSystem: "",
    openCoolingSystem: "",
    closedCoolingSystem: "",
    intercooled: "",
    recommendedCoolant: "",
    typeOfCooling: "",
    heatDissipationRate: "",
    heatExchangerMaterial: "",
    engineLubrication: "",
    lubricationSystem: "",
    coolingCapacity: "",
    coolingFluidType: "",
    coolingSystemPressure: "",
    airFilterType: "",
    circulationPumpType: "",
    rawWaterpumpType: "",
  });
  const [propulsion, setPropulsion] = useState({
    propulsion: "",
    bowthruster: "",
    propulsionSystem: "",
    propulsionSystemType: "",
    propellerDiameter: "",
    propellerMaterial: "",
    propellerPitch: "",
    propellerType: "",
    propellerShaftDiameter: "",
    gearboxType: "",
    transmissionCooling: "",
    propellerBladeMaterial: "",
    propellerShaftMaterial: "",
    steeringSystem: "",
    steeringControlType: "",
    trimSystem: "",
    trimTabMaterial: "",
    trimTabType: "",
  });
  const [fuelSystem, setFuelSystem] = useState({
    electronicFuelinjection: "",
    fuelPreFilter: "",
    fuelFilter: "",
    fuelFilterType: "",
    fuelReserve: "",
    fuelSystem: "",
    fuelTankCapacity: "",
    fuelType: "",
    lowestSpecificFuelConsumption: "",
    recommendedFuel: "",
    fuelConsumptionAtCruisingSpeed: "",
    fuelConsumptionRate: "",
    fuelConsumtpionAtFullLoad: "",
    fuelInjectionSystemType: "",
    fuelDeliveryPressure: "",
    fuelTankMaterial: "",
    fuelLineDiameter: "",
  });
  const [fuelConsumption, setFuelConsumption] = useState({
    fuelConsumption: "",
    fuelConsumptionHalfLoad: "",
    fuelConsumptionPropellerCurve: "",
    heatRejectionToCoolant: "",
  });
  const [oil, setOil] = useState({
    oilFilter: "",
    oilFilterType: "",
    centrifugalOilCleaner: "",
    oilCooler: "",
    oilFiller: "",
    oilDipstick: "",
    recommendedOil: "",
    oilCapacity: "",
    oilChangeInterval: "",
    oilCoolingMethod: "",
    lubricationOilPressure: "",
    oilFilterBypassValve: "",
  });
  const [electricalSystem, setElectricalSystem] = useState({
    alternator: "",
    alternatorOutput: "",
    batteryType: "",
    batteryVoltage: "",
    generatorOutputKw: "",
    alternatorOutputAmps: "",
    starterMotorVoltage: "",
    engineControlUnitModel: "",
    batteryChargingSystem: "",
    integratedGenerator: "",
  });
  const [emissionsAndEnvironment, setEmissionsAndEnvironment] = useState({
    emissionCompliance: "",
    exhaustSystem: "",
    exhaustSystemType: "",
    exhaustGasAfterTreatment: "",
    exhaustGasStatus: "",
    exhaustValveTiming: "",
    intakeValveTiming: "",
    emissionControlTechnology: "",
    noxEmissions: "",
    coxEmissions: "",
    soxEmissions: "",
    complianceWithIMOStandards: "",
  });
  const [safetyAndMonitoring, setSafetyAndMonitoring] = useState({
    emergencyStopSystem: "",
    engineMonitoringSystems: "",
    overheatProtection: "",
    lowOilPressureAlarm: "",
  });
  const [engineParts, setEngineParts] = useState({
    engineBearings: "",
    engineBed: "",
    engineBlock: "",
    engineBracket: "",
    engineBreather: "",
    engineCompartment: "",
    engineCompartmentVentilation: "",
    engineCoolingSystem: "",
    engineCover: "",
    engineDrivenPump: "",
    engineExhaustSystem: "",
    engineGasketSet: "",
    engineGearshift: "",
    engineHatch: "",
    engineHourMeter: "",
    engineInstrumentPanel: "",
    engineMaintenance: "",
    engineMounts: "",
    enginePanel: "",
    engineRemoteControl: "",
    engineStartButton: "",
    engineStopButton: "",
    engineTachometer: "",
    engineTelegraph: "",
    engineTemperatureGauge: "",
    engineThrottle: "",
    engineTransmission: "",
    engineTrunk: "",
    engineVoltageMeter: "",
    engineWarningLight: "",
    engineControlLever: "",
    engineControlPartsAccessories: "",
    engineControlRoom: "",
  });
  const [engineMeasurements, setEngineMeasurements] = useState({
    engineCoolingWaterFlow: "",
    engineExhaustTemperature: "",
    engineOperatingHours: "",
    enginePowerHpKw: "",
    engineRoomVolume: "",
    engineRpm: "",
    engineTorque: "",
  });
  const [engineRoom, setEngineRoom] = useState({
    engineRoom: "",
    engineRoomFan: "",
    engineRoomFanExtractor: "",
    engineRoomInsulation: "",
    engineRoomLight: "",
    engineRoomSoundproofing: "",
    engineRoomVentilation: "",
  });
  const [engineShaft, setEngineShaft] = useState({
    engineShaftBearing: "",
    engineShaftCollar: "",
    engineShaftCoupling: "",
    engineShaftKey: "",
    engineShaftLog: "",
    engineShaftNut: "",
    engineShaftSeal: "",
    engineShaftSealant: "",
    engineShaftSize: "",
    engineShaftSpacer: "",
    engineShaftStrut: "",
    engineShaftTube: "",
    engineShaftWasher: "",
  });
  const [engineType, setEngineType] = useState({
    ecuEngineControlUnit: "",
    engineFuelType: "",
    engineStroke: "",
    engineTier: "",
    inboardOutboard: "",
    mainOrAuxiliary: "",
    podEngine: "",
    saildriveEngine: "",
    steeringAndEngineControls: "",
    sternDriveEngine: "",
    engineType: "",
  });

  /*const checkRequired = () => {
    const errors = {};
    Object.keys(typeDef).forEach((sectionKey) => {
      const section = typeDef[sectionKey];
      const sectionData = sections[sectionKey];
      Object.keys(section).forEach((fieldKey) => {
        const field = section[fieldKey];
        if (field.mandatory) {
          const fieldValue = sectionData[fieldKey];
          if (field.type === "radio") {
            if (!field.value || String(field.value).trim() === "") {
              errors[`${fieldKey}`] = true;
            }
          } else if (field.type === "number") {
            if (
              fieldValue === undefined ||
              fieldValue === "" ||
              isNaN(fieldValue)
            ) {
              errors[`${fieldKey}`] = true;
            }
          }
        }
      });
    });

    setError(errors);
    return Object.keys(errors).length === 0;
  };*/

  const sections = {
    engineDetails,
    condition,
    performance,
    general,
    transmission,
    cylinders,
    propulsion,
    fuelSystem,
    serviceAndMaintenance,
    installationAndMounting,
    safetyAndMonitoring,
    fuelConsumption,
    torque,
    rpm,
    oil,
    emissionsAndEnvironment,
    dimensions,
    electricalSystem,
    engineShaft,
    engineType,
    engineRoom,
    engineMeasurements,
    engineParts,
    equipment,
    coolingSystem,
  };

  const setStateFunctions = {
    engineDetails: setEngineDetails,
    condition: setCondition,
    general: setGeneral,
    transmission: setTransmission,
    installationAndMounting: setInstallationAndMounting,
    serviceAndMaintenance: setServiceAndMaintenance,
    equipment: setEquipment,
    dimensions: setDimensions,
    performance: setPerformance,
    cylinders: setCylinders,
    rpm: setRpm,
    torque: setTorque,
    coolingSystem: setCoolingSystem,
    propulsion: setPropulsion,
    fuelSystem: setFuelSystem,
    fuelConsumption: setFuelConsumption,
    oil: setOil,
    electricalSystem: setElectricalSystem,
    emissionsAndEnvironment: setEmissionsAndEnvironment,
    safetyAndMonitoring: setSafetyAndMonitoring,
    engineParts: setEngineParts,
    engineMeasurements: setEngineMeasurements,
    engineRoom: setEngineRoom,
    engineShaft: setEngineShaft,
    engineType: setEngineType,
  };

  const handleOptionSelect = (category, field, selectedOption) => {
    setAllSelectedOptions((prevState) => {
      const updatedOptions = {
        ...prevState,
        [category]: {
          ...prevState[category],
          [field]: selectedOption,
        },
      };

      if (category === "engineDetails" && field === "typeDesignation") {
        const {
          engineMake,
          engineModel,
          engineModelYear,
          engineType,
          typeDesignation,
        } = updatedOptions.engineDetails;
        fetchRelevantOptions(
          engineMake,
          engineModel,
          engineModelYear,
          engineType,
          typeDesignation
        );
      }

      return updatedOptions;
    });

    if (
      category === "engineDetails" &&
      (field === "engineModel" ||
        field === "engineModelYear" ||
        field === "engineMake" ||
        field === "engineType")
    ) {
      // Fetch manufacturers based on selected trailerId
      fetchEngineDetailsSectionOptions(category, selectedOption, field);
    }
  };
  const handleSubmit = (e) => {
      e.preventDefault();
      try {
          // if (checkRequired()) {
              console.log("001 Form is valid, submitting...");
              localStorage.setItem("EngineData", JSON.stringify(allSelectedOptions));
              navigate("/view-engine");
              // localStorage.setItem("advertise_engine", JSON.stringify(form));
          // } else {
          //     console.warn(error);
          // }
      } catch (error) {
          console.error(error);
      }
  };
  function setPageData(key, newData) {
    const setStateFunction = setStateFunctions[key];
    if (setStateFunction) {
      setStateFunction((prevState) => ({
        ...prevState,
        ...newData,
      }));
    } else {
      console.error(`No setState function found for key: ${key}`);
    }
  }

  const cacheKey = "enginesFilterData";
  const URL = apiUrl +"/advert_engine/";

  const fetchDistinctData = async () => {
    try {
      setLoading(true);
      const promises = Object.keys(sections).map(async (key) => {
        const response = await fetch(`${URL}engines`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sections[key]),
        });
        const data = await response.json();
        return { key, data: data.res };
      });
      const results = await Promise.all(promises);
      results.forEach(({ key, data }) => {
        setPageData(key, data);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      console.log("done");
    }
  };
  const fetchRelevantOptions = async (
    engineMake,
    engineModel,
    engineModelYear,
    engineType,
    typeDesignation
  ) => {
    try {
      setLoading(true);
      const requestBody = {
        engineMake,
        engineModel,
        engineModelYear,
        engineType,
        typeDesignation,
      };
      const response = await fetch(`${URL}relevant_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestBody }),
      });
      const data = await response.json();
      const result = data?.result;

      if (result) {
        const updatePromises = Object.keys(result).map((fieldKey) => {
          if (Object.keys(requestBody).includes(fieldKey)) {
            return Promise.resolve();
          }
          return Promise.all(
            Object.keys(sections).map((sectionKey) => {
              return new Promise((resolve) => {
                if (sections[sectionKey][fieldKey] !== undefined) {
                  const fieldValue =
                    Array.isArray(result[fieldKey]) &&
                      result[fieldKey].length > 0
                      ? result[fieldKey]?.[0]
                      : sections[sectionKey][fieldKey];

                  setAllSelectedOptions((prevState) => ({
                    ...prevState,
                    [sectionKey]: {
                      ...prevState[sectionKey],
                      [fieldKey]: [fieldValue],
                    },
                  }));

                  resolve();
                } else {
                  resolve();
                }
              });
            })
          );
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);
      }
    } catch (error) {
      console.error("Error fetching other section:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchEngineDetailsSectionOptions = async (
    category,
    selectedOption,
    Key
  ) => {
    try {
      setLoading(true);
      const tableName = "General";

      // Define the order of keys for request body construction
      const keyHierarchy = [
        "engineMake",
        "engineModel",
        "engineModelYear",
        "engineType",
        "typeDesignation",
      ];

      // Find the index of the current key
      const currentKeyIndex = keyHierarchy.indexOf(Key);

      // The next column to be fetched will be the one after the current key
      const fetchColumn = keyHierarchy[currentKeyIndex + 1];

      // Dynamically construct the requestBody by including all prior selections
      let requestBody = {};
      for (let i = 0; i <= currentKeyIndex; i++) {
        const key = keyHierarchy[i];
        // If it's the current key, assign the selected option, otherwise use the already selected options
        requestBody[key] =
          key === Key ? selectedOption : allSelectedOptions[category]?.[key];
      }

      // Make sure fetchColumn is defined before proceeding
      if (!fetchColumn) {
        throw new Error(
          "No further data to fetch. All selections are complete."
        );
      }

      // Send the request
      const response = await fetch(`${URL}${tableName}/${fetchColumn}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestBody }),
      });

      const data = await response.json();

      // Update the page data with the fetched results
      setPageData(category, {
        ...sections[category],
        [fetchColumn]: data.result,
      });
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setPageData(JSON.parse(cachedData));
    } else {
      if (!hasFetched.current) {
        fetchDistinctData();
        hasFetched.current = true;
      }
    }
  }, [setPageData]);

  const handleInputChange = (title, fieldKey, newValue) => {
    setEngines((prevTrailers) => ({
      ...prevTrailers,
      [title]: {
        ...prevTrailers[title],
        [fieldKey]: newValue,
      },
    }));
  };

  const errorDisplay = (fieldName) => {
    return (
      <div style={{ color: "red", paddingLeft: 10 }}>
        {fieldName} field is required
      </div>
    );
  };

  return (
    <Container className="mb-5">
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            {Object.keys(sections).map((title) => (
              <Col md={6} key={title} className="mt-2">
                <legend className="fieldset-legend">
                  <h6 style={{ padding: "15px 10px 0px 10px" }}>
                    {makeString(title, keyToExpectedValueMap)}
                  </h6>
                </legend>
                {Object.keys(sections[title]).map((fieldKey) => {
                  const field = typeDef[title][fieldKey];
                  if (field && field.type === "radio") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <Col xs={3} md={12}>
                          <DropdownWithRadio
                            heading={fieldKey}
                            title={makeString(fieldKey, keyToExpectedValueMap)}
                            options={sections[title][fieldKey]  || []}
                            selectedOption={
                              allSelectedOptions[title]?.[fieldKey] || ""
                            }
                            setSelectedOption={(selectedOption) =>
                              handleOptionSelect(
                                title,
                                fieldKey,
                                selectedOption
                              )
                            }
                            isMandatory={field.mandatory}
                            setOpenKey={setOpenKey}
                            openKey={openKey || ""}
                          />
                          {error[`${fieldKey}`] && (
                            <div>
                              {errorDisplay(
                                makeString(fieldKey, keyToExpectedValueMap)
                              )}
                            </div>
                          )}
                        </Col>
                      </Col>
                    );
                  } else if (field && field.type === "number") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <InputComponentDynamic
                          label={makeString(fieldKey, keyToExpectedValueMap)}
                          value={engines[title]?.[fieldKey] || ""}
                          setValue={(e) =>
                            handleInputChange(title, fieldKey, e.target.value)
                          }
                          formType="number"
                          setOpenKey={setOpenKey}
                          openKey={openKey}
                          isMandatory={field.mandatory}
                        />
                        {error[`${fieldKey}`] && (
                          <div>
                            {errorDisplay(
                              makeString(fieldKey, keyToExpectedValueMap)
                            )}
                          </div>
                        )}
                      </Col>
                    );
                  }
                  return null;
                })}
              </Col>
            ))}
            <FormFieldCard countryVisible={true} />
          </Row>
          <SubmitButton
            text="Submit"
            name="advert_engine_submit"
            onClick={handleSubmit}
          />
        </Form>
      )}
    </Container>
  );
}
