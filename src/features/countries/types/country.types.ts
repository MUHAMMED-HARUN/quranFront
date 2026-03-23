export interface Country {
    CountryID: string;
    CountryName: string;
    CountryCode: string;
}

export interface CreateCountryCommand {
    CountryName: string;
    CountryCode: string;
}

export interface UpdateCountryCommand {
    CountryID: string;
    CountryName: string;
    CountryCode: string;
}
