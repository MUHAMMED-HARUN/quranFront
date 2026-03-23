export interface Person {
    PersonID: string;
    FirstName: string;
    FatherName: string;
    LastName: string;
    MotherName: string;
    MotherLastName: string;
    NationalNumber: string;
    Gender: boolean;
    BirthDate: string;
}

export interface AddPersonWithAddressCommand {
    FirstName: string;
    FatherName: string;
    LastName: string;
    MotherName: string;
    MotherLastName: string;
    NationalNumber: string;
    Gender: boolean;
    BirthDate: string;
    CountryID: string;
    CityID: string;
    DistrictID: string;
    NeighborhoodID: string;
    Notes?: string;
}

export interface UpdatePersonCommand {
    PersonID: string;
    FirstName: string;
    FatherName: string;
    LastName: string;
    MotherName: string;
    MotherLastName: string;
    NationalNumber: string;
    Gender: boolean;
    BirthDate: string;
}
