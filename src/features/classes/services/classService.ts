import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Class, CreateClassCommand, UpdateClassCommand } from "../types/class.types";

export const classService = {
    getAll: (): Promise<TResult<Class[]>> => {
        return api.get("/Classes") as unknown as Promise<TResult<Class[]>>;
    },

    getById: (id: string): Promise<TResult<Class>> => {
        return api.get(`/Classes/${id}`) as unknown as Promise<TResult<Class>>;
    },

    getByProgramId: (programId: string): Promise<TResult<Class[]>> => {
        return api.get(`/Classes/program/${programId}`) as unknown as Promise<TResult<Class[]>>;
    },

    getByName: (name: string): Promise<TResult<Class[]>> => {
        return api.get(`/Classes/search/${name}`) as unknown as Promise<TResult<Class[]>>;
    },

    searchAutocomplete: (name: string): Promise<TResult<{ Id: string, Name: string, Level: number }[]>> => {
        return api.get(`/Classes/searchAutocomplete/${name}`) as unknown as Promise<TResult<{ Id: string, Name: string, Level: number }[]>>;
    },

    create: (data: CreateClassCommand): Promise<TResult<string>> => {
        return api.post("/Classes", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateClassCommand): Promise<TResult<boolean>> => {
        return api.put("/Classes", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Classes/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
