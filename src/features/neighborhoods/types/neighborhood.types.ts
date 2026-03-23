export interface Neighborhood {
    NeighborhoodID: string;
    DistrictID: string;
    NeighborhoodName: string;
    DistrictName: string; // From backend DTO
}

export interface CreateNeighborhoodCommand {
    DistrictID: string;
    NeighborhoodName: string;
}

export interface UpdateNeighborhoodCommand {
    NeighborhoodID: string;
    DistrictID: string;
    NeighborhoodName: string;
}

export interface NeighborhoodFilters {
    SearchTerm?: string;
    DistrictID?: string;
}
