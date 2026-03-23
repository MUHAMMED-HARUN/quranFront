import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Neighborhood, CreateNeighborhoodCommand, UpdateNeighborhoodCommand } from "../types/neighborhood.types";

export const neighborhoodService = {
    getAll: (): Promise<TResult<Neighborhood[]>> => {
        return api.get("/Neighborhoods/neighborhoods") as unknown as Promise<TResult<Neighborhood[]>>;
    },
    getByDistrictId: (districtId: string): Promise<TResult<Neighborhood[]>> => {
        return api.get(`/Neighborhoods/district/${districtId}`) as unknown as Promise<TResult<Neighborhood[]>>;
    },
    getById: (id: string): Promise<TResult<Neighborhood>> => {
        return api.get(`/Neighborhoods/${id}`) as unknown as Promise<TResult<Neighborhood>>;
    },
    getByName: (name: string): Promise<TResult<Neighborhood>> => {
        return api.get(`/Neighborhoods/name/${name}`) as unknown as Promise<TResult<Neighborhood>>;
    },
    create: (data: CreateNeighborhoodCommand): Promise<TResult<string>> => {
        return api.post("/Neighborhoods", data) as unknown as Promise<TResult<string>>;
    },
    update: (data: UpdateNeighborhoodCommand): Promise<TResult<boolean>> => {
        return api.put("/Neighborhoods", data) as unknown as Promise<TResult<boolean>>;
    },
    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Neighborhoods/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
