import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { City, CreateCityCommand, UpdateCityCommand } from "../types/city.types";

export const cityService = {
    getAll: (): Promise<TResult<City[]>> => {
        return api.get("/Cities/cities") as unknown as Promise<TResult<City[]>>;
    },
    getByCountryId: (countryId: string): Promise<TResult<City[]>> => {
        return api.get(`/Cities/country/${countryId}`) as unknown as Promise<TResult<City[]>>;
    },
    getById: (id: string): Promise<TResult<City>> => {
        return api.get(`/Cities/${id}`) as unknown as Promise<TResult<City>>;
    },
    getByName: (name: string): Promise<TResult<City>> => {
        return api.get(`/Cities/name/${name}`) as unknown as Promise<TResult<City>>;
    },
    create: (data: CreateCityCommand): Promise<TResult<string>> => {
        return api.post("/Cities", data) as unknown as Promise<TResult<string>>;
    },
    update: (data: UpdateCityCommand): Promise<TResult<boolean>> => {
        return api.put("/Cities", data) as unknown as Promise<TResult<boolean>>;
    },
    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Cities/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
