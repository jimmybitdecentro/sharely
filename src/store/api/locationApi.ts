import {baseApi} from './baseApi';
import {API_ENDPOINTS} from '../../services/api/endpoints';
import {Country, City} from '../../types/location.types';

// Response types for RTK Query
interface CountriesApiResponse {
  success: boolean;
  data: Country[];
}

interface CitiesApiResponse {
  success: boolean;
  data: City[];
}

export const locationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get countries
    getCountries: builder.query<Country[], void>({
      query: () => API_ENDPOINTS.LOCATION.COUNTRIES,
      transformResponse: (response: CountriesApiResponse) => response.data,
      providesTags: ['Countries'],
    }),

    // Get cities
    getCities: builder.query<City[], void>({
      query: () => API_ENDPOINTS.LOCATION.CITIES,
      transformResponse: (response: CitiesApiResponse) => response.data,
      providesTags: ['Cities'],
    }),

    // Get cities by country (client-side filtering)
    getCitiesByCountry: builder.query<City[], string>({
      query: () => API_ENDPOINTS.LOCATION.CITIES,
      transformResponse: (response: CitiesApiResponse, meta, countryId) =>
        response.data.filter((city) => city.countryId === countryId),
      providesTags: (result, error, countryId) => [
        {type: 'Cities', id: countryId},
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCountriesQuery,
  useGetCitiesQuery,
  useGetCitiesByCountryQuery,
} = locationApi;
