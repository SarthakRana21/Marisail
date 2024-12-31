import PropTypes from "prop-types";
import AuctionSearch from "../components/Auction/AuctionSearch";
import BerthAdvert from "../components/Berth/BerthAdvert";

const Auctions = ({ type }) => {
  return (
    <main
      style={{
        minHeight: `100vh`,
        overflow: "hidden",
      }}
    >
      {type === "search" ? <AuctionSearch /> : <BerthAdvert />}
    </main>
  );
};

Auctions.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Auctions;
