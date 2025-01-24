import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import InputComponentDynamic from "../InputComponentDynamic";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "./CharterAdvertInfo";
import { makeString } from "../../services/common_functions";
import { useNavigate } from "react-router-dom"; 
import FormFieldCard from "../../services/FormFieldCard";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function CharterAdvert() {
    const navigate = useNavigate(); 
    const [error, setError] = useState({});
    const hasFetched = useRef(false);
    const [engines, setEngines] = useState("");
    const [openKey, setOpenKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allSelectedOptions, setAllSelectedOptions] = useState({});
    const [guestAccomodation, setGuestAccomodation] = useState({
        marisailVesselId: "",
        marisailCharterId: "",
        guestCapacity: "",
        bedroomConfiguration: "",
        bathroomConfiguration: "",
        crewAccommodations: "",
        accessibilityInformation: "",
        cleaningAndMaintenanceProcedures: "",
        vesselDecorAndSetupRequests: "",
    });
    const [locationDetails, setLocationDetails] = useState({
        boardingPortArrivalTime: "",
        boardingPortDepartureTime: "",
        summerCruisingAreas: "",
        boardingPort: "",
        winterCruisingAreas: "",
        disembarkationPort: "",
        embarkationAndDisembarkationLogistics: "",
        disembarkationPortArrivalTime: "",
        dockingAndMooringInstructions: "",
    });
    const [guestRequirements, setGuestRequirements] = useState({
        skipperIncluded: "",
        crewIncluded: "",
        crewUniformPreferences: "",
        localCuisinePreferences: "",
        cateringRequired: "",
        carParkingAvailable: "",
        specialRequirementsRequests: "",
    });
    const [
        charterAgreementTermsAndConditions,
        setCharterAgreementTermsAndConditions,
    ] = useState({
        smokingPolicy: "",
        petFriendlyPolicy: "",
        localRegulationsAndRestrictions: "",
        charterAgreementTermsAndConditions: "",
        environmentalPolicies: "",
        waterConservationMeasures: "",
        wasteManagementProtocols: "",
        alcoholPolicy: "",
        photographyAndVideographyPolicies: "",
    });
    const [guestSafety, setGuestSafety] = useState({
        weatherContingencyPlans: "",
        emergencyProcedures: "",
        medicalFacilitiesOnboard: "",
        emergencyContacts: "",
        weatherForecastServices: "",
        securityMeasures: "",
        guestOrientationAndSafetyBriefing: "",
        insuranceGuestsAndPersonalBelongings: "",
        insuranceCoverageDetails: "",
    });
    const [costs, setCosts] = useState({
        summerRatePerNight: "",
        winterRatePerWeek: "",
        winterRatePerNight: "",
        summerRatePerWeek: "",
        securityDepositAmount: "",
        totalPrice: "",
        refundableDeposit: "",
        additionalFuelCosts: "",
        additionalFees: "",
        fuelIncluded: "",
        lateCheckInOutFees: "",
        vat: "",
    });
    const [availableDates, setAvailableDates] = useState({
        minimumNightsPolicy: "",
        datesAvailable: "",
        cancellationPolicy: "",
    });
    const [dates, setDates] = useState({
        startDate: "",
        endDate: "",
        numberNights: "",
    });
    const [paymentTerms, setPaymentTerms] = useState({
        paymentTerms: "",
        currency: "",
        preferredPaymentMethods: "",
        invoiceAndReceiptProcedures: "",
        calculatePriceAndPay: "",
        priceLabel: "",
        priceDrop: "",
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
            // if (checkRequired()) {
                console.log("001 Form is valid, submitting...");
                localStorage.setItem("CharterData", JSON.stringify(allSelectedOptions));
                navigate("/view-charter");
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

    const cacheKey = "charterFilterData";
    const URL = apiUrl +"/advert_charter/";

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
        setEngines((prevCharter) => ({
            ...prevCharter,
            [title]: {
                ...prevCharter[title],
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
                        <FormFieldCard countryVisible={true} dateVisible={true} />
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
