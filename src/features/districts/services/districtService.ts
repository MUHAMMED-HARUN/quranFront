import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { District, CreateDistrictCommand, UpdateDistrictCommand } from "../types/district.types";

export const districtService = {
    getAll: (): Promise<TResult<District[]>> => {
        return api.get("/Districts/districts") as unknown as Promise<TResult<District[]>>;
    },
    getByCityId: (cityId: string): Promise<TResult<District[]>> => {
        return api.get(`/Districts/city/${cityId}`) as unknown as Promise<TResult<District[]>>;
    },
    getById: (id: string): Promise<TResult<District>> => {
        return api.get(`/Districts/${id}`) as unknown as Promise<TResult<District>>;
    },
    getByName: (name: string): Promise<TResult<District>> => {
        return api.get(`/Districts/name/${name}`) as unknown as Promise<TResult<District>>;
    },
    create: (data: CreateDistrictCommand): Promise<TResult<string>> => {
        return api.post("/Districts", data) as unknown as Promise<TResult<string>>;
    },
    update: (data: UpdateDistrictCommand): Promise<TResult<boolean>> => {
        return api.put("/Districts", data) as unknown as Promise<TResult<boolean>>;
    },
    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Districts/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
