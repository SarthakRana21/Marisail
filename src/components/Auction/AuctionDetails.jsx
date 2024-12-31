import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuctionDetailsPanel from "./AuctionDetailsPanel";
import Loader from "../Loader";
import { Row, Col } from "react-bootstrap";
import { varToDb, detailStateType } from "./AuctionInfo";

const URL = "http://localhost:3001/api/search_auction/";

const AuctionDetails = () => {
  // console.log("detailStateType", detailStateType);
  // console.log("varToDb", varToDb);
  const { id } = useParams();
  const [auction, setAuction] = useState(detailStateType);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(id);

  // console.log("trailer", trailer);

  useEffect(() => {
    // fetch trailer details
    console.log("fetching auction details: ", id);

    const fetchAuctionDetails = async (id) => {
      try {
        const response = await fetch(`${URL}auction-details/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("data", data.res[0][0]);

        Object.keys(auction).map((key) => {
          Object.keys(auction[key]).map((key2) => {
            // console.log("key2", key2);
            var name = varToDb[key2];
            // console.log("size", data.res[0].length);
            // console.log("name", name);
            // console.log("data[name] ooutside", data.res[0][0][name]);
            if (data.res[0][0][name] !== undefined)
              // console.log("data[name] inside", data.res[0][0][name]);
              setAuction((prevState) => ({
                ...prevState,
                [key]: {
                  ...prevState[key],
                  [key2]: data.res[0][0][name],
                },
              }));
            // trailer[key][key2] = data[name];
          });
        });

        // console.log("trailer", trailer);
        // console.log("data[name] trailer", data.res[0]["Trailer_ID"]);
        setLoading(false);
        // console.log("trailer", trailer);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuctionDetails(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  if (!auction) return <p>No auction details available.</p>;

  return (
    <div className="engine-detail-page">
      <div className="engine-main-section">
        {/* <div className="engine-image-gallery">
          <img
            src="../images/engine.jpg"
            alt="Engine"
            className="engine-main-image"
          />
          <div className="engine-thumbnails">
            <img
              src="../images/engine.jpg"
              alt="Thumbnail 1"
              className="thumbnail"
            />
            <img
              src="../images/engine.jpg"
              alt="Thumbnail 2"
              className="thumbnail"
            />
          </div>
        </div> */}
        <div>
          <Row>
            {Object.keys(trailer).map((key) => (
              <Col key={key} md={6}>
                <AuctionDetailsPanel title={key} details={trailer[key]} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
