import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import InputComponentDynamic from "../InputComponentDynamic";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "./ShopAdvertInfo";
import { makeString } from "../../services/common_functions";
import { useNavigate } from "react-router-dom";
import DatePickerComponent from "../DatePickerComponent"
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function ChandleryAdvert() {
    const navigate = useNavigate();
    const [error, setError] = useState({});
    const hasFetched = useRef(false);
    const [shops, setShops] = useState("");
    const [openKey, setOpenKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allSelectedOptions, setAllSelectedOptions] = useState({});
    const [itemDescription, setItemDescription] = useState({
        marisailProductId: "",
        itemName: "",
        description: "",
        condition: "",
        usedCondition: "",
        size: "",
        quantity: "",
        numberAvailable: "",
        currency: "",
        price: "",
        priceLabel: "",
        priceDrop: "",
        postage: "",
        delivery: "",
        returnsAccepted: "",
        returnsDetails: "",
    });
    const [sellerDetails, setSellerDetails] = useState({
        sellerContactDetails: "",
        marisailSellerId: "",
        sellerName: "",
        sellerAddress: "",
        sellerDistance: "",

        contactSeller: "",
        visitShop: "",
        uploadPictures: ""
    });
    const [paymentTerms, setPaymentTerms] = useState({
        paymentTerms: "",
        preferredPaymentMethods: "",
        invoiceAndReceiptProcedures: "",

        calculatePriceAndPay: "",
        vat: "",
        totalPrice: "",
    });

    const sections = {
        itemDescription,
        sellerDetails,
        paymentTerms,
    };

    const setStateFunctions = {
        itemDescription: setItemDescription,
        sellerDetails:setSellerDetails,
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


            return updatedOptions;
        });

    };
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            // if (checkRequired()) {
            console.log("001 Form is valid, submitting...");
            localStorage.setItem("ChandleryData", JSON.stringify(allSelectedOptions));
            navigate("/view-chandlery");
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

    const cacheKey = "chandleryFilterData";
    const URL = apiUrl +"/advert_chandlery/";

    const fetchDistinctData = async () => {
        try {
            setLoading(true);
            const promises = Object.keys(sections).map(async (key) => {
                const response = await fetch(`${URL}chandlery`, {
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
        setShops((oldValue) => ({
            ...oldValue,
            [title]: {
                ...oldValue[title],
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
                                                    value={shops[title]?.[fieldKey] || ""}
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
                                                    value={shops[title]?.[fieldKey] || ""}
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
                        name="advert_shop_submit"
                        onClick={handleSubmit}
                    />
                </Form>
            )}
        </Container>
    );
}
