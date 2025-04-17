import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import InputComponentDynamic from "../InputComponentDynamic";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "../Charter/CharterAdvertInfo";
import { makeString } from "../../services/common_functions";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function MyCharter() {
  const storedUser = localStorage.getItem("user");
  const formData = localStorage.getItem("CharterData");
  let charterData;
  if (storedUser && formData) {
    charterData = JSON.parse(formData);
  }
  const [error, setError] = useState({});
  const hasFetched = useRef(false);
  const [engines, setEngines] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [guestAccomodation, setGuestAccomodation] = useState({
    marisailVesselId: charterData?.marisailVesselId || "",
    marisailCharterId: charterData?.marisailCharterId || "",
    guestCapacity: charterData?.guestCapacity || "",
    bedroomConfiguration: charterData?.bedroomConfiguration || "",
    bathroomConfiguration: charterData?.bathroomConfiguration || "",
    crewAccommodations: charterData?.crewAccommodations || "",
    accessibilityInformation: charterData?.accessibilityInformation || "",
    cleaningAndMaintenanceProcedures:
      charterData?.cleaningAndMaintenanceProcedures || "",
    vesselDecorAndSetupRequests: charterData?.vesselDecorAndSetupRequests || "",
  });

  const [locationDetails, setLocationDetails] = useState({
    boardingPortArrivalTime: charterData?.boardingPortArrivalTime || "",
    boardingPortDepartureTime: charterData?.boardingPortDepartureTime || "",
    summerCruisingAreas: charterData?.summerCruisingAreas || "",
    boardingPort: charterData?.boardingPort || "",
    winterCruisingAreas: charterData?.winterCruisingAreas || "",
    disembarkationPort: charterData?.disembarkationPort || "",
    embarkationAndDisembarkationLogistics:
      charterData?.embarkationAndDisembarkationLogistics || "",
    disembarkationPortArrivalTime:
      charterData?.disembarkationPortArrivalTime || "",
    dockingAndMooringInstructions:
      charterData?.dockingAndMooringInstructions || "",
  });

  const [guestRequirements, setGuestRequirements] = useState({
    skipperIncluded: charterData?.skipperIncluded || "",
    crewIncluded: charterData?.crewIncluded || "",
    crewUniformPreferences: charterData?.crewUniformPreferences || "",
    localCuisinePreferences: charterData?.localCuisinePreferences || "",
    cateringRequired: charterData?.cateringRequired || "",
    carParkingAvailable: charterData?.carParkingAvailable || "",
    specialRequirementsRequests: charterData?.specialRequirementsRequests || "",
  });

  const [
    charterAgreementTermsAndConditions,
    setCharterAgreementTermsAndConditions,
  ] = useState({
    smokingPolicy: charterData?.smokingPolicy || "",
    petFriendlyPolicy: charterData?.petFriendlyPolicy || "",
    localRegulationsAndRestrictions:
      charterData?.localRegulationsAndRestrictions || "",
    charterAgreementTermsAndConditions:
      charterData?.charterAgreementTermsAndConditions || "",
    environmentalPolicies: charterData?.environmentalPolicies || "",
    waterConservationMeasures: charterData?.waterConservationMeasures || "",
    wasteManagementProtocols: charterData?.wasteManagementProtocols || "",
    alcoholPolicy: charterData?.alcoholPolicy || "",
    photographyAndVideographyPolicies:
      charterData?.photographyAndVideographyPolicies || "",
  });

  const [guestSafety, setGuestSafety] = useState({
    weatherContingencyPlans: charterData?.weatherContingencyPlans || "",
    emergencyProcedures: charterData?.emergencyProcedures || "",
    medicalFacilitiesOnboard: charterData?.medicalFacilitiesOnboard || "",
    emergencyContacts: charterData?.emergencyContacts || "",
    weatherForecastServices: charterData?.weatherForecastServices || "",
    securityMeasures: charterData?.securityMeasures || "",
    guestOrientationAndSafetyBriefing:
      charterData?.guestOrientationAndSafetyBriefing || "",
    insuranceGuestsAndPersonalBelongings:
      charterData?.insuranceGuestsAndPersonalBelongings || "",
    insuranceCoverageDetails: charterData?.insuranceCoverageDetails || "",
  });

  const [costs, setCosts] = useState({
    summerRatePerNight: charterData?.summerRatePerNight || "",
    winterRatePerWeek: charterData?.winterRatePerWeek || "",
    winterRatePerNight: charterData?.winterRatePerNight || "",
    summerRatePerWeek: charterData?.summerRatePerWeek || "",
    securityDepositAmount: charterData?.securityDepositAmount || "",
    totalPrice: charterData?.totalPrice || "",
    refundableDeposit: charterData?.refundableDeposit || "",
    additionalFuelCosts: charterData?.additionalFuelCosts || "",
    additionalFees: charterData?.additionalFees || "",
    fuelIncluded: charterData?.fuelIncluded || "",
    lateCheckInOutFees: charterData?.lateCheckInOutFees || "",
    vat: charterData?.vat || "",
  });

  const [availableDates, setAvailableDates] = useState({
    minimumNightsPolicy: charterData?.minimumNightsPolicy || "",
    datesAvailable: charterData?.datesAvailable || "",
    cancellationPolicy: charterData?.cancellationPolicy || "",
  });

  const [dates, setDates] = useState({
    startDate: charterData?.startDate || "",
    endDate: charterData?.endDate || "",
    numberNights: charterData?.numberNights || "",
  });

  const [paymentTerms, setPaymentTerms] = useState({
    paymentTerms: charterData?.paymentTerms || "",
    currency: charterData?.currency || "",
    preferredPaymentMethods: charterData?.preferredPaymentMethods || "",
    invoiceAndReceiptProcedures: charterData?.invoiceAndReceiptProcedures || "",
    calculatePriceAndPay: charterData?.calculatePriceAndPay || "",
    priceLabel: charterData?.priceLabel || "",
    priceDrop: charterData?.priceDrop || "",
  });

  const checkRequired = () => {
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
  };

  const sections = {
    guestAccomodation,
    locationDetails,
    charterAgreementTermsAndConditions,
    guestSafety,
    costs,
    guestRequirements,
    availableDates,
    dates,
    paymentTerms,
  };

  const setStateFunctions = {
    guestAccomodation: setGuestAccomodation,
    locationDetails: setLocationDetails,
    guestRequirements: setGuestRequirements,
    charterAgreementTermsAndConditions: setCharterAgreementTermsAndConditions,
    guestSafety: setGuestSafety,
    costs: setCosts,
    availableDates: setAvailableDates,
    dates: setDates,
    paymentTerms: setPaymentTerms,
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

      /*if (category === "guestAccomodation" && field === "crewAccommodations") {
                      const {
                          guestCapacity,
                          bedroomConfiguration,
                          bathroomConfiguration,
                          crewAccommodations,
                      } = updatedOptions.guestAccomodation;
                      fetchRelevantOptions(
                          guestCapacity,
                          bedroomConfiguration,
                          bathroomConfiguration,
                          crewAccommodations
                      );
                  }*/

      return updatedOptions;
    });

    /*if (
                category === "guestAccomodation" &&
                (   field === "guestCapacity" ||
                    field === "bedroomConfiguration" ||
                    field === "bathroomConfiguration"
                )
            ) {
                fetchGuestAccomodationSectionOptions(category, selectedOption, field);
            }*/
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (checkRequired()) {
        // If no errors, proceed with form submission logic
        console.log("001 Form is valid, submitting...");
        // localStorage.setItem("advertise_engine", JSON.stringify(form));
      } else {
        console.warn(error);
      }
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

  const cacheKey = "charterFilterData";
  const URL = apiUrl + "/advert_charter/";

  const fetchDistinctData = async () => {
    try {
      setLoading(true);
      const promises = Object.keys(sections).map(async (key) => {
        const response = await fetch(`${URL}charter`, {
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
  /*const fetchRelevantOptions = async (
          guestCapacity,
          bedroomConfiguration,
          bathroomConfiguration,
          crewAccommodations
      ) => {
          try {
              setLoading(true);
              const requestBody = {
                  guestCapacity,
                  bedroomConfiguration,
                  bathroomConfiguration,
                  crewAccommodations,
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
      const fetchGuestAccomodationSectionOptions = async (
          category,
          selectedOption,
          Key
      ) => {
          try {
              setLoading(true);
              const tableName = "Accommodation_Location";
              const keyHierarchy = [
                  "guestCapacity",
                  "bedroomConfiguration",
                  "bathroomConfiguration",
                  "crewAccommodations",
              ];
  
              const currentKeyIndex = keyHierarchy.indexOf(Key);
              const fetchColumn = keyHierarchy[currentKeyIndex + 1];
              let requestBody = {};
              for (let i = 0; i <= currentKeyIndex; i++) {
                  const key = keyHierarchy[i];
                  requestBody[key] =
                      key === Key ? selectedOption : allSelectedOptions[category]?.[key];
              }
  
              if (!fetchColumn) {
                  throw new Error(
                      "No further data to fetch. All selections are complete."
                  );
              }
              const response = await fetch(`${URL}${tableName}/${fetchColumn}`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ requestBody }),
              });
  
              const data = await response.json();
              setPageData(category, {
                  ...sections[category],
                  [fetchColumn]: data.result,
              });
          } catch (error) {
              console.error("Error fetching manufacturers:", error);
          } finally {
              setLoading(false);
          }
      };*/

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
                            options={sections[title][fieldKey]}
                            selectedOption={
                              allSelectedOptions[title]?.[fieldKey] ||
                              charterData[title]?.[fieldKey] ||
                              ""
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
                            openKey={openKey}
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
          </Row>
          <SubmitButton
            text="Submit"
            name="advert_charter_submit"
            onClick={handleSubmit}
          />
        </Form>
      )}
    </Container>
  );
}
