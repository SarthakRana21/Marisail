import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useReducer } from "react";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import RangeInput from "../RangeInput";
import Loader from "../Loader";
import BerthCard from "../BerthCard";
import ResetBar from "../ResetBar";
import { varToScreen } from "./BerthInfo";
import { v4 as uuidv4 } from "uuid";
import { setAllFilters, getAllFilters } from "../../store/filtersSlice";
import { fetchData } from "../../fatch/fatch";
import { useSelector, useDispatch } from "react-redux";
import { api } from "../../api/api";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function BerthSearch() {
  const allFilters = useSelector(getAllFilters)?.filters;
  console.log('allFilters :>> ', allFilters);
  const dispatche = useDispatch(); //be catre full on here is dispatche not dispatch
  const [selectedRadios, setSelectedRadios] = useState({});
  const [page, setPage] = useState(0);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
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

  const [siteDetails, setSiteDetails] = useState({
    siteDetails: [],
    termsAndConditions: [],
    type: [],
    marinaName: [],
    location: [],
    ownership: [],
    yearEstablished: [],
    operatingHours: [],
    seasonalOperation: [],
    languageServices: [],
  });

  const [generalInformation, setGeneralInformation] = useState({
    dockTypes: [],
    numberOfDocks: [],
    boatSlipSizes: [],
    numberOfBerthsAvailable: [],
    length: [],
    beam: [],
    draft: [],
    slipWidth: [],
    slipLength: [],
    mooringType: [],
    tideRange: [],
  });

  const [amenitiesAndServices, setAmenitiesAndServices] = useState({
    electricityAvailable: [],
    waterSupply: [],
    wifiAvailability: [],
    carParking: [],
  });

  const [familyFacilities, setFamilyFacilities] = useState({
    laundryFacilities: [],
    restaurantsAndCafes: [],
    restaurant: [],
    bar: [],
    shoppingFacilities: [],
    retailShops: [],
    hospitalityServices: [],
    clubhouseAccess: [],
    swimmingPool: [],
    fitnessCenter: [],
    marinaStore: [],
    chandlery: [],
    restroomAndShowers: [],
    laundryServices: [],
    gymFacilities: [],
    familyFriendlyAmenities: [],
    petFriendlyServices: [],
  });

  const [communityAndSocial, setCommunityAndSocial] = useState({
    yachtClubMembership: [],
  });

  const [services, setServices] = useState({
    docksideTrolley: [],
    fuelTypesAvailable: [],
    fuelDock: [],
    electricalHookupSpecifications: [],
  });

  const [repairAndMaintenance, setRepairAndMaintenance] = useState({
    boatLiftSpecifications: [],
  });

  const [accessibility, setAccessibility] = useState({
    handicapAccessibleSlips: [],
    proximityToHandicapParking: [],
    accessibleFacilities: [],
    assistanceServicesForDisabled: [],
    signageAndDirections: [],
    accessibleRestroomsAndShowers: [],
  });

  const [connectivityAndTransportation, setconnectivityAndTransportation] =
    useState({
      taxiServices: [],
    });

  const [environmentalConsiderations, setEnvironmentalConsiderations] =
    useState({
      wasteDisposal: [],
      waterHookupSpecifications: [],
    });

  const [securityAndSafety, setSecurityAndSafety] = useState({
    fireSafetyEquipment: [],
    firstAidKits: [],
    securityPatrol: [],
    cctvSurveillance: [],
  });

  const [financialInformation, setFinancialInformation] = useState({
    currency: [],
  });

  const [pricingAndLeaseTerms, setPricingAndLeaseTerms] = useState({
    pricePerAnnum: [],
    pricePerMonth: [],
    pricePerWeek: [],
    availability: [],
    annualLeaseRenewable: [],
    cancellationPolicy: [],
  });

  const [notDefined, setNotDefined] = useState({
    priceLabel: [],
    priceDrop: [],
    country: [],
    addressDetails: [],
    distance: [],
  });

  const filters = {
    siteDetails,
    generalInformation,
    amenitiesAndServices,
    familyFacilities,
    communityAndSocial,
    services,
    repairAndMaintenance,
    accessibility,
    connectivityAndTransportation,
    environmentalConsiderations,
    securityAndSafety,
    financialInformation,
    pricingAndLeaseTerms,
    notDefined,
  };

  console.log('filters :>> ', filters);

  const setStateFunctions = {
    siteDetails: setSiteDetails,
    generalInformation: setGeneralInformation,
    amenitiesAndServices: setAmenitiesAndServices,
    familyFacilities: setFamilyFacilities,
    communityAndSocial: setCommunityAndSocial,
    services: setServices,
    repairAndMaintenance: setRepairAndMaintenance,
    accessibility: setAccessibility,
    connectivityAndTransportation: setconnectivityAndTransportation,
    environmentalConsiderations: setEnvironmentalConsiderations,
    securityAndSafety: setSecurityAndSafety,
    financialInformation: setFinancialInformation,
    pricingAndLeaseTerms: setPricingAndLeaseTerms,
    notDefined: setNotDefined,
  };

  const handleRadioChange = (key2, value) => {
    console.log("001 Key--",key2, "--value--",value);
    setSelectedRadios((prev) => ({ ...prev, [key2]: value }));
  };

  const lookUpTable = {};
  Object.keys(filters).forEach((key) => {
    Object.keys(filters[key]).forEach((key2) => {
      lookUpTable[key2] = key;
    });
  });

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

  const cacheKey = "berthsFilterData";
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const URL = apiUrl + "/search_berth/";

  // fetch all the count of the available columns
  var data;
  // const fetchFilterData = async () => {
  //   for (const key of Object.keys(filters)) {
  //     try {
  //       const response = await fetch(`${URL}berths`, {
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
  //       setFilters(key, data?.res);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       console.log("done");
  //     }
  //   }
  // };

  function mergeSpaces(str) {
    return str.replace(/\s+/g, ' ').trim();
  }

  // useEffect(() => {
  //   const cachedData = localStorage.getItem(cacheKey);
  //   if (cachedData) {
  //     setFilters(JSON.parse(cachedData));
  //     console.log("Data fetched from cache", JSON.parse(cachedData));
  //   } else {
  //     // Fetch data if not cached
  //     fetchFilterData();
  //   }
  // }, []);

  // useEffect(() => {
  //   const fetchFilters = async () => {
  //     try {
  //       const response = await fetch(api.filterByTable, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           tableName: 'siteDetails',
  //           filterColumns: ['location', 'ownership'],
  //           filterName: 'siteDetails',
  //         }),
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //         setFilters(data.data); // Assuming `data.data` contains the relevant filters
  //       } else {
  //         throw new Error(data.message || 'Failed to fetch filters');
  //       }
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFilters();
  // }, [api.filterByTable]);
  
  // useEffect(() => {
  //   setLoading(true);
  //   dispatche(fetchData({
  //     method: "GET",
  //     endpoint: api.searchBerth,
  //     headers: {
  //       "Content-Type": "application/json",
  //     }
  //   }))
  //   .then((result) => {
  //     setSiteDetails(result.payload.tables); // Update state with the fetched data
  //     setLoading(false);
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching site data:", error);
  //     setLoading(false);
  //   });
  // }, []);
  useEffect(() => {
    dispatche(fetchData({
      method: "GET",
      endpoint: api.allFilters,
      headers: {
        "Content-Type": "application/json",
      }
    }))
    .then((result) => {
      console.log('Full result :>> ', result); // Debug API response
      dispatch(setAllFilters(result.payload.filters))
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching filter data:", error);
      setLoading(false);
    });
  }, []);
  

  useEffect(() => {
    if (allFilters) {
      console.log("All filters", allFilters);
      setSiteDetails({
        siteDetails: allFilters.siteDetails || [],
        termsAndConditions: allFilters.termsAndConditions || [],
        type: allFilters.type || [],
        marinaName: allFilters.marinaName || [],
        location: allFilters.location || [],
        ownership: allFilters.ownership || [],
        yearEstablished: allFilters.yearEstablished || [],
        operatingHours: allFilters.operatingHours || [],
        seasonalOperation: allFilters.seasonalOperation || [],
        languageServices: allFilters.languageServices || [],
      });

      setGeneralInformation({
        dockTypes: allFilters.dockTypes || [],
        numberOfDocks: allFilters.numberOfDocks || [],
        boatSlipSizes: allFilters.boatSlipSizes || [],
        numberOfBerthsAvailable: allFilters.numberOfBerthsAvailable || [],
        length: allFilters.length || [],
        beam: allFilters.beam || [],
        draft: allFilters.draft || [],
        slipWidth: allFilters.slipWidth || [],
        slipLength: allFilters.slipLength || [],
        mooringType: allFilters.mooringType || [],
        tideRange: allFilters.tideRange || [],
      });

      setAmenitiesAndServices({
        electricityAvailable: allFilters.electricityAvailable || [],
        waterSupply: allFilters.waterSupply || [],
        wifiAvailability: allFilters.wifiAvailability || [],
        carParking: allFilters.carParking || [],
      });

      setFamilyFacilities({
        laundryFacilities: allFilters.laundryFacilities || [],
        restaurantsAndCafes: allFilters.restaurantsAndCafes || [],
        restaurant: allFilters.restaurant || [],
        bar: allFilters.bar || [],
        shoppingFacilities: allFilters.shoppingFacilities || [],
        retailShops: allFilters.retailShops || [],
        hospitalityServices: allFilters.hospitalityServices || [],
        clubhouseAccess: allFilters.clubhouseAccess || [],
        swimmingPool: allFilters.swimmingPool || [],
        fitnessCenter: allFilters.fitnessCenter || [],
        marinaStore: allFilters.marinaStore || [],
        chandlery: allFilters.chandlery || [],
        restroomAndShowers: allFilters.restroomAndShowers || [],
        laundryServices: allFilters.laundryServices || [],
        gymFacilities: allFilters.gymFacilities || [],
        familyFriendlyAmenities: allFilters.familyFriendlyAmenities || [],
        petFriendlyServices: allFilters.petFriendlyServices || [],
      });

      setCommunityAndSocial({
        yachtClubMembership: allFilters.yachtClubMembership || [],
      });

      setServices({
        docksideTrolley: allFilters.docksideTrolley || [],
        fuelTypesAvailable: allFilters.fuelTypesAvailable || [],
        fuelDock: allFilters.fuelDock || [],
        electricalHookupSpecifications:
          allFilters.electricalHookupSpecifications || [],
      });

      setRepairAndMaintenance({
        boatLiftSpecifications: allFilters.boatLiftSpecifications || [],
      });

      setAccessibility({
        handicapAccessibleSlips: allFilters.handicapAccessibleSlips || [],
        proximityToHandicapParking: allFilters.proximityToHandicapParking || [],
        accessibleFacilities: allFilters.accessibleFacilities || [],
        assistanceServicesForDisabled:
          allFilters.assistanceServicesForDisabled || [],
        signageAndDirections: allFilters.signageAndDirections || [],
        accessibleRestroomsAndShowers:
          allFilters.accessibleRestroomsAndShowers || [],
      });

      setconnectivityAndTransportation({
        taxiServices: allFilters.taxiServices || [],
      });

      setEnvironmentalConsiderations({
        wasteDisposal: allFilters.wasteDisposal || [],
        waterHookupSpecifications: allFilters.waterHookupSpecifications || [],
      });

      setSecurityAndSafety({
        fireSafetyEquipment: allFilters.fireSafetyEquipment || [],
        firstAidKits: allFilters.firstAidKits || [],
        securityPatrol: allFilters.securityPatrol || [],
        cctvSurveillance: allFilters.cctvSurveillance || [],
      });

      setFinancialInformation({
        currency: allFilters.currency || [],
      });

      setPricingAndLeaseTerms({
        pricePerAnnum: allFilters.pricePerAnnum || [],
        pricePerMonth: allFilters.pricePerMonth || [],
        pricePerWeek: allFilters.pricePerWeek || [],
        availability: allFilters.availability || [],
        annualLeaseRenewable: allFilters.annualLeaseRenewable || [],
        cancellationPolicy: allFilters.cancellationPolicy || [],
      });

      setNotDefined({
        priceLabel: allFilters.priceLabel || [],
        priceDrop: allFilters.priceDrop || [],
        country: allFilters.country || [],
        addressDetails: allFilters.addressDetails || [],
        distance: allFilters.distance || [],
      });
    }
  }, [allFilters]);

  const [berths, setBerths] = useState([]);

  useEffect(() => {
    setLoading(true);
    let currInfo = {
      selectedOptions: allSelectedOptions,
      page: page,
    };
    const fetchBerthData = async () => {
      setLoading(true);
      let currInfo = {
        selectedOptions: allSelectedOptions,
        page: page,
      };
      try {
        const response = await fetch(`${URL}berthsData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currInfo),
        });

        const data = await response.json();
        setBerths(data?.res[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        console.log("done");
      }
    };

    fetchBerthData();
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
              Search For Berth
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
            {Object.keys(filters).map((key) => { 
              // console.log('key :>> ', key);
              return(
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
                {Object.keys(filters[key]).map((key2) => {
                  console.log('key2 :>> ',  key, filters[key][key2]);
                  return (
                  <Row key={uuidv4()} className="row-margin">
                    <Col md={12}>
                      <Form.Group>
                        {(varToScreen[key2].type != "range") && (
                          <DropdownWithCheckBoxes
                            heading={key2}
                            title={varToScreen[key2]?.displayText}
                            options={filters[key][key2]}
                            selectedOptions={allSelectedOptions}
                            setSelectedOptions={setAllSelectedOptions}
                            defaultUnit={varToScreen[key2]?.radioOptions && varToScreen[key2]?.radioOptions?.[0].label || ""}
                          />
                        )}
                        {(varToScreen[key2].type == "range") && (
                          <>
                            <RangeInput
                              key2={mergeSpaces(key2)}
                              title={varToScreen[key2]?.displayText}
                              fromValue={fromValue}
                              toValue={toValue}
                              setFromValue={setFromValue}
                              radioOptions={varToScreen[key2]?.radioOptions}
                              setToValue={setToValue}
                              selectedRadio={selectedRadios[key2] || varToScreen[key2]?.radioOptions[0]?.value}
                              onRadioChange={(value) => handleRadioChange(key2, value)}
                              isOpen={!!openStates[key2]}
                              toggleAccordion={() => toggleAccordion(key2)}
                            />
                          </>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                )})}
              </fieldset>
            )})}
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
                Berths For Sale
              </h1>
            </Col>
          </Row>
          {loading ? (
            // <p>Loading...</p>
            <Loader />
          ) : (
            <Row>
              {berths.length === 0 ? (
                <Col md={12}>
                  <p>No Results Found</p>
                </Col>
              ) : (
                berths.map((trailer) => {
                  return (
                    <Col key={uuidv4()} md={4}>
                      {/* <h1>{trailer.m}</h1> */}
                      <BerthCard {...trailer} />
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
