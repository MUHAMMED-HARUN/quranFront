import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Matter, CreateMatterCommand, UpdateMatterCommand } from "../types/matter.types";

export const matterService = {
    getAll: (): Promise<TResult<Matter[]>> => {
        return api.get("/Matters") as unknown as Promise<TResult<Matter[]>>;
    },

    getById: (id: string): Promise<TResult<Matter>> => {
        return api.get(`/Matters/${id}`) as unknown as Promise<TResult<Matter>>;
    },

    searchByName: (name: string): Promise<TResult<Matter[]>> => {
        return api.get(`/Matters/search/${encodeURIComponent(name)}`) as unknown as Promise<TResult<Matter[]>>;
    },

    create: (data: CreateMatterCommand): Promise<TResult<string>> => {
        return api.post("/Matters", data) as unknown as Promise<TResult<string>>;
    },

    update: (id: string, data: UpdateMatterCommand): Promise<TResult<boolean>> => {
        return api.put(`/Matters/${id}`, data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Matters/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
