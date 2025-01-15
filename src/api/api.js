const apiUrl = import.meta.env.VITE_BACKEND_URL;
export const BASE_URL = apiUrl;
export const api={
  allBaseUrls:BASE_URL,
  searchBerth:BASE_URL+ "/search_berth/berths",
  allFilters:BASE_URL+ "/search_berth/allFilters",


  //add new api endpoint here 
}
