export const varToColumn = {
  // identification
  marisailVesselID: "Marisail_Vessel_ID",
  marisailCharterID: "Marisail_Charter_ID",
  dataSouce: "DATA_SOURCE",

  // Guest Accommodation
  guestCapacity: "Guest_Capacity",
  bedroomConfiguration: "Bedroom_Configuration",
  bathroomConfiguration: "Bathroom_Configuration",
  crewAccommodations: "Crew_Accommodations",
  accessibilityInformation: "Accessibility_Information",
  cleaningAndMaintenanceProcedures: "Maintenance_Procedures",
  vesselDecorAndSetupRequests: "Vessel_Decor",

  // Location Details
  boardingPortArrivalTime: "Boarding_Arrival_Time",
  boardingPortDepartureTime: "Boarding_Departure_Time",
  summerCruisingAreas: "Summer_Cruising_Areas",
  boardingPort: "Boarding_Port",
  winterCruisingAreas: "Winter_Cruising_Areas",
  disembarkationPort: "Disembarkation_Port",
  embarkationDisembarkationLogistics: "Logistics",
  disembarkationPortArrivalTime: "Disembarkation_Arrival_Time",
  dockingMooringInstructions: "Mooring_Instructions",

  // Guest Requirements
  skipperIncluded: "Captain_Included",
  crewIncluded: "Crew_Included",
  crewUniformPreferences: "Crew_Uniform",
  localCuisinePreferences: "Cuisine_Preferences",
  cateringRequired: "Catering_Required",
  carParkingAvailable: "Car_Parking",
  specialRequirementsRequests: "Special_Requirements",

  // Charter Agreement Terms & Conditions
  smokingPolicy: "Smoking_Policy",
  petFriendlyPolicy: "Pet_Policy",
  localRegulationsRestrictions: "Local_Regulations",
  environmentalPolicies: "Environmental_Policies",
  waterConservationMeasures: "Water_Conservation",
  wasteManagementProtocols: "Waste_Management",
  alcoholPolicy: "Alcohol",
  photographyVideographyPolicies: "Photography_Policies",

  // Guest Safety
  weatherContingencyPlans: "Weather_Contingency",
  emergencyProcedures: "Emergency_Procedures",
  medicalFacilitiesOnboard: "Medical_Facilities",
  emergencyContacts: "Emergency_Contacts",
  weatherForecastServices: "Weather_Forecast",
  securityMeasures: "Security_Measures",
  guestOrientationSafetyBriefing: "Safety_Briefing",
  insuranceForGuestsPersonalBelongings: "Guest_Insurance",
  insuranceCoverageDetails: "Insurance_Coverage",

  // Costs
  summerRatePerNight: "Summerrate_Per_Night	",
  winterRatePerWeek: "Winterrate_Per_week",
  winterRatePerNight: "Winterrate_Per_Night",
  summerRatePerWeek: "Summerrate_Per_Week",
  securityDepositAmount: "Deposit_Amount",
  totalPrice: "Total_Price",
  refundableDeposit: "Refundable_Deposit",
  additionalFuelCosts: "Additional_Fuel",
  additionalFees: "Additional_Fees",
  fuelIncluded: "Fuel_Included",
  lateCheckInCheckOutFees: "Late_Fees",
  vat: "VAT",

  // Availabile Dates
  minimumNightsPolicy: "Minimum_Nights",
  datesAvailable: "Dates_Available",
  cancellationPolicy: "Cancellation_Policy",

  // Dates
  startDate: "Start_Date",
  endDate: "End_Date",
  numberNights: "Number_Nights",

  // Payment Terms
  paymentTerms: "Payment_Terms",
  currency: "Currency",
  preferredPaymentMethods: "Payment_Payment",
  invoiceReceiptProcedures: "Invoice_Receipt",

  // Calculate Price & Pay
  calculatePricePay: "Calculate",
  priceLabel: "Price_Label",
  priceDrop: "Price_Drop",
};

export const varToTable = {
  identification: "Accomodation",
  guestAccommodation: "Accomodation",
  locationDetails: "Accomodation",
  guestRequirements: "Requirements",
  charterAgreementTerms: "Policy",
  guestSafety: "Charter_Safety",
  costs: "Charter_Costs",
  availableDates: "Date",
  dates: "Date",
  paymentTerms: "Charter_Payment",
  calculatePricePay: "Sales",
};

export const uniqueTable = [
  "Accomodation",
  "Requirements",
  "Policy",
  "Safety_Measures",
  "Charter_Costs",
  "Dates",
  "Charter_Payment",
  "Charter_Sales",
];
