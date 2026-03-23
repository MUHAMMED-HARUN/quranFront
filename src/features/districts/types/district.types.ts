export interface District {
    DistrictID: string;
    CityID: string;
    DistrictName: string;
    CityName: string; // From backend DTO
}

export interface CreateDistrictCommand {
    CityID: string;
    DistrictName: string;
}

export interface UpdateDistrictCommand {
    DistrictID: string;
    CityID: string;
    DistrictName: string;
}

export interface DistrictFilters {
    SearchTerm?: string;
    CityID?: string;
}
