const initialState = {
  filters: {},
};

// Action Types
const SET_ALL_FILTERS = 'filters/setAllFilters';

// Action Creators
export const setAllFilters = (payload) => {
  console.log('payload :>> ', payload);
  return {
    payload,
  }
};

// Reducer
const filtersReducer = (state = initialState, action) => {
  console.log('action :>> ', action.payload?.filters);
  switch (action.type) {
    case '/data/fetchData/fulfilled':
      return {
        ...state,
        filters: { ...action.payload?.filters },
      };
    default:
      return state;
  }
};

// Selector
export const getAllFilters = (state) => state.filters;

// Export the reducer as default
export default filtersReducer;
