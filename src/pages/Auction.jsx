import AuctionAdvert from "../components/Auction/AuctionAdvert";
import AuctionSearch from "../components/Auction/AuctionSearch";
import PropTypes from "prop-types";

const Auction = ({ type }) => {
    return (
        <main
            style={{
                minHeight: `100vh`,
                overflow: "hidden",
            }}
        >
            {type === "search" ? <AuctionSearch /> : <AuctionAdvert />}
        </main>
    );
};

Auction.propTypes = {
    type: PropTypes.string.isRequired,
};

export default Auction;
