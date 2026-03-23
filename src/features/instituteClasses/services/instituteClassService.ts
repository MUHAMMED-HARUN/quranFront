import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { InstituteClass, CreateInstituteClassCommand, UpdateInstituteClassCommand } from "../types/instituteClass.types";

export const instituteClassService = {
    getAll: (): Promise<TResult<InstituteClass[]>> => {
        return api.get("/InstituteClasses") as unknown as Promise<TResult<InstituteClass[]>>;
    },

    getById: (id: string): Promise<TResult<InstituteClass>> => {
        return api.get(`/InstituteClasses/${id}`) as unknown as Promise<TResult<InstituteClass>>;
    },

    getByInstituteId: (instituteId: string): Promise<TResult<InstituteClass[]>> => {
        return api.get(`/InstituteClasses/institute/${instituteId}`) as unknown as Promise<TResult<InstituteClass[]>>;
    },

    create: (data: CreateInstituteClassCommand): Promise<TResult<string>> => {
        return api.post("/InstituteClasses", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateInstituteClassCommand): Promise<TResult<boolean>> => {
        return api.put("/InstituteClasses", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/InstituteClasses/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
