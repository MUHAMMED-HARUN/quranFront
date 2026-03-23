import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Institute, AddInstituteWithAddressCommand, UpdateInstituteCommand } from "../types/institute.types";

export const instituteService = {
    getAll: (): Promise<TResult<Institute[]>> => {
        return api.get("/Institutes") as unknown as Promise<TResult<Institute[]>>;
    },

    getById: (id: string): Promise<TResult<Institute>> => {
        return api.get(`/Institutes/${id}`) as unknown as Promise<TResult<Institute>>;
    },

    getByName: (name: string): Promise<TResult<Institute[]>> => {
        return api.get(`/Institutes/search/${name}`) as unknown as Promise<TResult<Institute[]>>;
    },

    create: (data: AddInstituteWithAddressCommand): Promise<TResult<string>> => {
        return api.post("/Institutes/with-address", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateInstituteCommand): Promise<TResult<boolean>> => {
        return api.put("/Institutes", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Institutes/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
