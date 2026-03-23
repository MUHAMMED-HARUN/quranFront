import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Subject, CreateSubjectCommand, UpdateSubjectCommand } from "../types/subject.types";

export const subjectService = {
    getAll: (): Promise<TResult<Subject[]>> => {
        return api.get("/Subjects") as unknown as Promise<TResult<Subject[]>>;
    },

    getById: (id: string): Promise<TResult<Subject>> => {
        return api.get(`/Subjects/${id}`) as unknown as Promise<TResult<Subject>>;
    },

    getByName: (name: string): Promise<TResult<Subject>> => {
        return api.get(`/Subjects/name/${name}`) as unknown as Promise<TResult<Subject>>;
    },

    searchByName: (name: string): Promise<TResult<Subject[]>> => {
        return api.get(`/Subjects/search/${name}`) as unknown as Promise<TResult<Subject[]>>;
    },

    create: (data: CreateSubjectCommand): Promise<TResult<string>> => {
        return api.post("/Subjects", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateSubjectCommand): Promise<TResult<boolean>> => {
        return api.put("/Subjects", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Subjects/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
