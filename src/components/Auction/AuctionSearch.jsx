import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import Loader from "../Loader";
import ResetBar from "../ResetBar";
import { varToScreen } from "./AuctionInfo";

export default function AuctionSearch() {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allSelectedOptions, setAllSelectedOptions] = useState([]);

  const [boatDetails, setBoatDetails] = useState({
    lotNumber: [],
    description: [],
    auctionStatus: [],
    conditionsOfSale: [],
    auctioneerContactInformation: [],
    resultsOrOutcome: [],
    sellerInformation: [],
  });

  const [auctionDetails, setAuctionDetails] = useState({
    auctionNumber: [],
    auctionDate: [],
    auctionVenue: [],
    startTime: [],
    closingTime: [],
    biddingPeriod: [],
  });

  const [inspection, setInspection] = useState({
    withdrawalDeadline: [],
    inspectionPeriod: [],
    postAuctionSettlementPeriod: [],
  });

  const [bids, setBids] = useState({
    bidPrice: [],
    bidTimestamp: [],
    startingBid: [],
    bidIncrement: [],
    openingBid: [],
    minimumBid: [],
    winningBid: [],
    reservePrice: [],
    sellersReserveStatus: [],
  });

  const [bidderDetails, setBidderDetails] = useState({
    highestBidder: [],
    bidderRegistrationRequirements: [],
    bidderNumberOrID: [],
    numberBidders: [],
    buyersPremium: [],
  });

  const [paymentTerms, setPaymentTerms] = useState({
    paymentTerms: [],
    currency: [],
    preferredPaymentMethods: [],
    invoiceAndReceiptProcedures: [],
  });

  const [calculatePriceAndPay, setCalculatePriceAndPay] = useState({
    priceLabel: [],
    priceDrop: [],
    currency: [],
    vat: [],
    totalPrice: [],
  });

  const filters = {
    boatDetails,
    auctionDetails,
    inspection,
    bids,
    bidderDetails,
    paymentTerms,
    calculatePriceAndPay,
  };

  const lookUpTable = {};
  Object.keys(filters).forEach((key) => {
    Object.keys(filters[key]).forEach((key2) => {
      lookUpTable[key2] = key;
    });
  });

  const setStateFunctions = {
    boatDetails: setBoatDetails,
    auctionDetails: setAuctionDetails,
    inspection: setInspection,
    bids: setBids,
    bidderDetails: setBidderDetails,
    paymentTerms: setPaymentTerms,
    calculatePriceAndPay: setCalculatePriceAndPay,
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
    console.log(key);
    console.log(data);
    if (setStateFunction) {
      setStateFunction(data);
    } else {
      console.error(`No setState function found for key: ${key}`);
    }

    console.log("Data fetched from API", filters);
  }

  const cacheKey = "auctionFilterData";
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const URL = "http://localhost:3001/api/search_auction/";

  var data;
  const fetchFilterData = async () => {
    for (const key of Object.keys(filters)) {
      console.log("filters", filters[key]);
      try {
        const response = await fetch(`${URL}Auction`, {
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
        // console.log(data.res);
        setFilters(key, data.res);
      } catch (err) {
        console.log(err);
      } finally {
        // console.log("done");
      }
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setFilters(JSON.parse(cachedData));
      console.log("Data fetched from cache", JSON.parse(cachedData));
    } else {
      // Fetch data if not cached
      fetchFilterData();
    }

    console.log(filters);
  }, []);

  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    setLoading(true);
    let currInfo = {
      selectedOptions: allSelectedOptions,
      page: page,
    };
    const fetchTrailerData = async () => {
      try {
        const response = await fetch(`${URL}auctionData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currInfo),
        });

        const data = await response.json();
        console.log(data);
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
                key={key}
              >
                <legend className="fieldset-legend">
                  <h6
                    style={{
                      padding: "15px 0px 0px 0px",
                    }}
                  >
                    {varToScreen[key]}
                  </h6>
                </legend>
                {Object.keys(filters[key]).map((key2) => (
                  <Row key={key2} className="row-margin">
                    <Col md={12}>
                      <Form.Group>
                        <DropdownWithCheckBoxes
                          heading={key2}
                          title={varToScreen[key2]}
                          options={filters[key][key2]}
                          selectedOptions={allSelectedOptions}
                          setSelectedOptions={setAllSelectedOptions}
                        />
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
                    <Col key={trailer} md={4}>
                      {/* <h1>{trailer.m}</h1> */}
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
