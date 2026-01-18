// Country
export interface Country {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

// City
export interface City {
  id: string;
  name: string;
  countryId: string;
  createdAt: string;
}

// Response Types
export interface CountriesResponse {
  success: boolean;
  data: Country[];
}

export interface CitiesResponse {
  success: boolean;
  data: City[];
}

// Location State for Redux (if needed)
export interface LocationState {
  countries: Country[];
  cities: City[];
  isLoading: boolean;
  error: string | null;
}
