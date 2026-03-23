export interface Institute {
    InstituteID: string;
    Name: string;
    Notes?: string;
    CountryID?: string;
    CityID?: string;
    DistrictID?: string;
    NeighborhoodID?: string;
    AddressDetails?: string;
}

export interface AddInstituteWithAddressCommand {
    Name: string;
    CountryID: string;
    CityID: string;
    DistrictID: string;
    NeighborhoodID: string;
    Notes?: string;
}

export interface UpdateInstituteCommand {
    InstituteID: string;
    Name: string;
}
