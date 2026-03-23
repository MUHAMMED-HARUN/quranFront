import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Person, AddPersonWithAddressCommand, UpdatePersonCommand } from "../types/person.types";

export const personService = {
    getAll: (): Promise<TResult<Person[]>> => {
        return api.get("/Persons") as unknown as Promise<TResult<Person[]>>;
    },

    getById: (id: string): Promise<TResult<Person>> => {
        return api.get(`/Persons/${id}`) as unknown as Promise<TResult<Person>>;
    },

    getByNationalNumber: (nationalNumber: string): Promise<TResult<Person>> => {
        return api.get(`/Persons/national/${nationalNumber}`) as unknown as Promise<TResult<Person>>;
    },

    searchByNationalNumber: (nationalNumber: string): Promise<TResult<Person[]>> => {
        return api.get(`/Persons/searchByNationalNum/${nationalNumber}`) as unknown as Promise<TResult<Person[]>>;
    },

    create: (data: AddPersonWithAddressCommand): Promise<TResult<string>> => {
        return api.post("/Persons", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdatePersonCommand): Promise<TResult<boolean>> => {
        return api.put("/Persons", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Persons/${id}`) as unknown as Promise<TResult<boolean>>;
    },

    checkExistsById: (id: string): Promise<TResult<boolean>> => {
        return api.get(`/Persons/exists/id/${id}`) as unknown as Promise<TResult<boolean>>;
    },

    checkExistsByNationalNumber: (nationalNumber: string): Promise<TResult<boolean>> => {
        return api.get(`/Persons/exists/national/${nationalNumber}`) as unknown as Promise<TResult<boolean>>;
    },
};
