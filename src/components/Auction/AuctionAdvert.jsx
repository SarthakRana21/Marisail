import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "./AuctionAdvertInfo";
import { makeString } from "../../services/common_functions";
import { useNavigate } from "react-router-dom";
import DatePickerComponent from "../DatePickerComponent"
import InputComponentDynamic from "../InputComponentDynamic";
import CustomTimePicker from '../CustomTimePicker';
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function AuctionAdvert() {
    const [selectedTime, setSelectedTime] = useState('');
    const handleTimeChange = (time) => {
        console.log("001 Selected time--", time);
        setSelectedTime(time);
    };
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState("");
    const [error, setError] = useState({});
    const [auction, setAuction] = useState("");
    const hasFetched = useRef(false);
    const [openKey, setOpenKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allSelectedOptions, setAllSelectedOptions] = useState({});
    const [boatDetails, setBoatDetails] = useState({
        boatDetails: "",
        lotNumber: "",
        descriptionOfItemProperty: "",
        auctionStatus: "",
        conditionsOfSale: "",
        auctioneerContactInformation: "",
        resultsOrOutcome: "",
        sellerInformation: "",
    });
    const [auctionDetails, setAuctionDetails] = useState({
        auctionDetails: "",
        marisailAuctionId: "",
        auctionDate: "",
        auctionVenue: "",
        startTime: "10:00",
        closingTime: "10:00",
        biddingPeriod: "",
    });
    const [inspectionPeriod, setInspectionPeriod] = useState({
        inspection: "",
        withdrawalDeadline: "",
        inspectionPeriod: "",
        postAuctionSettlementPeriod: "",
    });
    const [biddingDetails, setBiddingDetails] = useState({
        bids: "",
        bidPrice: "",
        bidTimestamp: "",
        startingBid: "",
        bidIncrement: "",
        openingBid: "",
        minimumBid: "",
        winningBid: "",
        reservePriceBuyItNow: "",
        sellersReserveStatus: "",
    });
    const [bidderDetails, setBidderDetails] = useState({
        bidderDetails: "",
        highestBidder: "",
        bidderRegistrationRequirements: "",
        marisailBidderId: "",
        numberBidders: "",
        buyersPremium: "",
    });
    const [paymentTerms, setPaymentTerms] = useState({
        paymentTermsTitle: "",
        paymentTerms: "",
        currency: "",
        preferredPaymentMethods: "",
        invoiceReceiptProcedures: "",

        calculatePricePay: "",
        priceLabel: "",
        priceDrop: "",
        vat: "",
        totalPrice: "",
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
                        // if(field.value){
                        //   console.log("001 field value--",field);
                        // }
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
        boatDetails,
        auctionDetails,
        biddingDetails,
        bidderDetails,
        inspectionPeriod,
        paymentTerms,
    };

    const setStateFunctions = {
        boatDetails: setBoatDetails,
        auctionDetails: setAuctionDetails,
        inspectionPeriod: setInspectionPeriod,
        biddingDetails: setBiddingDetails,
        bidderDetails: setBidderDetails,
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

            /*if (category === "boatDetails" && field === "type") {
                const { marisailBerthId, boatDetails, termsAndConditions, type } =
                    updatedOptions.boatDetails;
                fetchRelevantOptions(
                    marisailBerthId,
                    boatDetails,
                    termsAndConditions,
                    type
                );
            }*/

            return updatedOptions;
        });

        /*if (
            category === "boatDetails" &&
            (field === "marisailBerthId" ||
                field === "boatDetails" ||
                field === "termsAndConditions")
        ) {
            fetchboatDetailsSectionOptions(category, selectedOption, field);
        }*/
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            // if (checkRequired()) {
            console.log("001 Form is valid, submitting...");
            localStorage.setItem("AuctionData", JSON.stringify(allSelectedOptions));
            navigate("/view-berth");
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

    const cacheKey = "auctionFilterData";
    const URL = apiUrl +"/advert_auction/";

    const fetchDistinctData = async () => {
        try {
            setLoading(true);
            const promises = Object.keys(sections).map(async (key) => {
                const response = await fetch(`${URL}auction`, {
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
        }
    };
    /*const fetchRelevantOptions = async (
        marisailBerthId,
        boatDetails,
        termsAndConditions,
        type
    ) => {
        try {
            setLoading(true);
            const requestBody = {
                marisailBerthId,
                boatDetails,
                termsAndConditions,
                type,
            };
            const response = await fetch(`${URL}relevant_data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
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
            console.log("001 relevant data all options after--", allSelectedOptions);
        }
    };
    const fetchboatDetailsSectionOptions = async (
        category,
        selectedOption,
        Key
    ) => {
        try {
            setLoading(true);
            const tableName = "berths_ID";
            const keyMapping = {
                marisailBerthId: {
                    fetchColumn: "boatDetails",
                    dependencies: ["marisailBerthId"],
                },
                boatDetails: {
                    fetchColumn: "termsAndConditions",
                    dependencies: ["marisailBerthId", "boatDetails"],
                },
                termsAndConditions: {
                    fetchColumn: "type",
                    dependencies: [
                        "marisailBerthId",
                        "boatDetails",
                        "termsAndConditions",
                    ],
                },
            };
            if (!keyMapping[Key]) {
                throw new Error(`Invalid key provided: ${Key}`);
            }
            const { fetchColumn, dependencies } = keyMapping[Key];
            const requestBody = dependencies.reduce((body, depKey) => {
                body[depKey] =
                    depKey === Key
                        ? selectedOption
                        : allSelectedOptions[category]?.[depKey];
                return body;
            }, {});

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
            console.error("Error fetching identification section options:", error);
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

    const errorDisplay = (fieldName) => {
        return (
            <div style={{ color: "red", paddingLeft: 10 }}>
                {fieldName} field is required
            </div>
        );
    };

    const handleInputChange = (title, fieldKey, newValue) => {
        setAuction((prevAuction) => ({
            ...prevAuction,
            [title]: {
                ...prevAuction[title],
                [fieldKey]: newValue,
            },
        }));
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
                                    } else if (field && field.type === "date") {
                                        return (
                                            <Col
                                                md={12}
                                                className="mr-3"
                                                key={fieldKey}
                                                style={{ width: 480 }}
                                            >
                                                <DatePickerComponent
                                                    label={makeString(fieldKey, keyToExpectedValueMap)}
                                                    value={auction[title]?.[fieldKey] || ""}
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
                                                    value={auctions[title]?.[fieldKey] || ""}
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
                                    } else if (field && field.type === "time") {
                                        return (
                                            <Col
                                                md={12}
                                                className="mr-3"
                                                key={fieldKey}
                                                style={{ width: 480 }}
                                            >
                                                <CustomTimePicker
                                                    style={{width: '100%'}}
                                                    setValue={(e) =>
                                                        handleInputChange(title, fieldKey, e.target.value)
                                                    }
                                                    value={auctions[title]?.[fieldKey] || ""}
                                                    label={makeString(fieldKey, keyToExpectedValueMap)}
                                                    initialTime="12:00"
                                                    onTimeChange={handleTimeChange}
                                                    setOpenKey={setOpenKey}
                                                    openKey={openKey}
                                                    isMandatory={field.mandatory}
                                                />
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
                        name="advert_auction_submit"
                        onClick={handleSubmit}
                    />
                </Form>
            )}
        </Container>
    );
}
