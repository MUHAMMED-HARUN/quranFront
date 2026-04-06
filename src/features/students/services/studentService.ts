import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Student, SetPersonAsStudentCommand, UpdateStudentCommand } from "../types/student.types";

export const studentService = {
    getAll: (): Promise<TResult<Student[]>> => {
        return api.get("/Students") as unknown as Promise<TResult<Student[]>>;
    },

    getById: (id: string): Promise<TResult<Student>> => {
        return api.get(`/Students/${id}`) as unknown as Promise<TResult<Student>>;
    },

    searchByNationalNumber: (nationalNumber: string): Promise<TResult<any[]>> => {
        return api.get(`/Students/search/${nationalNumber}`) as unknown as Promise<TResult<any[]>>;
    },

    getByNationalNumber: (nationalNumber: string): Promise<TResult<Student>> => {
        return api.get(`/Students/national/${nationalNumber}`) as unknown as Promise<TResult<Student>>;
    },

    create: (data: SetPersonAsStudentCommand): Promise<TResult<string>> => {
        return api.post("/Students", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateStudentCommand): Promise<TResult<boolean>> => {
        return api.put("/Students", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Students/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
