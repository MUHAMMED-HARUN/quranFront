export interface City {
  CityID: string;
  CountryID: string;
  CityName: string;
  CityCode: string | null;
  CountryName: string; // Optional property to hold the country name for display purposes
}

export interface CreateCityCommand {
  CountryID: string;
  CityName: string;
  CityCode?: string | null;
}

export interface UpdateCityCommand {
  CityID: string;
  CountryID: string;
  CityName: string;
  CityCode?: string | null;
}

export interface CityFilters {
  SearchTerm?: string;
  CountryID?: string;
}
