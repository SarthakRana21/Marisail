export const varToScreen = {
  // boatDetails
  boatDetails: "Boat Details",
  lotNumber: "Lot Number",
  descriptionOfItemOrProperty: "Description of Item/Property",
  auctionStatus: "Auction Status",
  conditionsOfSale: "Conditions of Sale",
  auctioneerContactInformation: "Auctioneer Contact Information",
  resultsOrOutcome: "Results or Outcome",
  sellerInformation: "Seller Information",

  // auctionDetails
  auctionDetails: "Auction Details",
  auctionNumber: "Auction Number",
  auctionDate: "Auction Date",
  auctionVenue: "Auction Venue",
  startTime: "Start Time",
  closingTime: "Closing Time",
  biddingPeriod: "Bidding Period",

  // inspection
  inspection: "Inspection",
  withdrawalDeadline: "Withdrawal Deadline",
  inspectionPeriod: "Inspection Period",
  postAuctionSettlementPeriod: "Post-Auction Settlement Period",

  // bids
  bids: "Bids",
  bidPrice: "Bid Price",
  bidTimestamp: "Bid Timestamp",
  startingBid: "Starting Bid",
  bidIncrement: "Bid Increment",
  openingBid: "Opening Bid",
  minimumBid: "Minimum Bid",
  winningBid: "Winning Bid",
  reservePrice: "Reserve Price (Buy It Now)",
  sellersReserveStatus: "Seller's Reserve Status",

  // bidderDetails
  bidderDetails: "Bidder Details",
  highestBidder: "Highest Bidder",
  bidderRegistrationRequirements: "Bidder Registration Requirements",
  bidderNumberOrID: "Bidder Number or ID",
  numberBidders: "Number Bidders",
  buyersPremium: "Buyer's Premium",

  // paymentTerms
  paymentTerms: "Payment Terms",
  currency: "Currency",
  preferredPaymentMethods: "Preferred Payment Methods",
  invoiceAndReceiptProcedures: "Invoice and Receipt Procedures",

  // calculatePriceAndPay
  calculatePriceAndPay: "Calculate Price & Pay",
  priceLabel: "Price Label",
  priceDrop: "Price Drop",
  vat: "VAT",
  totalPrice: "Total Price",
};

export const varToDb = {
  // boat details
  lotNumber: "Lot_Number",
  description: "Description",
  auctionStatus: "Auction_Status_(e.g.,_upcoming,_ongoing,_closed)",
  conditionsOfSale: "Conditions_of_Sale",
  auctioneerContactInformation: "Auctioneer_Contact_Information",
  resultsOrOutcome: "Results_or_Outcome",
  sellerInformation: "Seller_Information",

  // auction details
  auctionNumber: "Auction_Number",
  auctionDate: "Auction_Date",
  auctionVenue: "Auction_Venue",
  closingTime: "Closing_Time",
  biddingPeriod: "Bidding_Period",

  // inspection
  withdrawalDeadline: "Withdrawal_Deadline",
  inspectionPeriod: "Inspection_Period",
  postAuctionSettlementPeriod: "Post-Auction_Settlement_Period",

  // bids
  startingBid: "Starting_Bid",
  bidIncrement: "Bid_Increment",
  openingBid: "Opening_Bid",
  minimumBid: "Minimum_Bid",
  winningBid: "Winning_Bid",
  reservePrice: "Reserve_Price",
  sellersReserveStatus: "Seller's_Reserve_Status",

  // bidder details
  highestBidder: "Highest_Bidder",
  bidderRegistrationRequirements: "Bidder_Registration_Requirements",
  bidderNumberOrID: "Bidder_Number_or_ID",
  buyersPremium: "Buyer's_Premium",

  // payment terms
  paymentTerms: "Payment_Terms",
  currency: "Currency",
  preferredPayment: "Preferred_Payment",
  invoiceReceipt: "Invoice_Receipt",

  // calculate price & pay
  calculatePriceAndPay: "Calculate",
  priceLabel: "Price_Label",
  priceDrop: "Price_Drop",
};

export const typeDef = {
  boatDetails: {
    lotNumber: [],
    description: [],
    auctionStatus: [],
    conditionsOfSale: [],
    auctioneerContactInformation: [],
    resultsOrOutcome: [],
    sellerInformation: [],
  },
  auctionDetails: {
    auctionNumber: [],
    auctionDate: [],
    auctionVenue: [],
    startTime: [],
    closingTime: [],
    biddingPeriod: [],
  },
  inspection: {
    withdrawalDeadline: [],
    inspectionPeriod: [],
    postAuctionSettlementPeriod: [],
  },
  bids: {
    bidPrice: [],
    bidTimestamp: [],
    startingBid: [],
    bidIncrement: [],
    openingBid: [],
    minimumBid: [],
    winningBid: [],
    reservePrice: [],
    sellersReserveStatus: [],
  },
  bidderDetails: {
    highestBidder: [],
    bidderRegistrationRequirements: [],
    bidderNumberOrID: [],
    numberBidders: [],
    buyersPremium: [],
  },
  paymentTerms: {
    paymentTerms: [],
    currency: [],
    preferredPaymentMethods: [],
    invoiceAndReceiptProcedures: [],
  },
  calculatePriceAndPay: {
    priceLabel: [],
    priceDrop: [],
    currency: [],
    vat: [],
    totalPrice: [],
  },
};

export const detailStateType = {};
