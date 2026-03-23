import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Program, CreateProgramCommand, UpdateProgramCommand } from "../types/program.types";

export const programService = {
    getAll: (): Promise<TResult<Program[]>> => {
        return api.get("/Programs") as unknown as Promise<TResult<Program[]>>;
    },

    getById: (id: string): Promise<TResult<Program>> => {
        return api.get(`/Programs/${id}`) as unknown as Promise<TResult<Program>>;
    },

    getByName: (name: string): Promise<TResult<Program[]>> => {
        return api.get(`/Programs/search/${name}`) as unknown as Promise<TResult<Program[]>>;
    },

    create: (data: CreateProgramCommand): Promise<TResult<string>> => {
        return api.post("/Programs", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateProgramCommand): Promise<TResult<boolean>> => {
        return api.put("/Programs", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Programs/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
