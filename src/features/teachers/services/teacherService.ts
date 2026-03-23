import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { Teacher, SetPersonAsTeacherCommand, UpdateTeacherCommand } from "../types/teacher.types";

export const teacherService = {
    getAll: (): Promise<TResult<Teacher[]>> => {
        return api.get("/Teachers") as unknown as Promise<TResult<Teacher[]>>;
    },

    getById: (id: string): Promise<TResult<Teacher>> => {
        return api.get(`/Teachers/${id}`) as unknown as Promise<TResult<Teacher>>;
    },

    create: (data: SetPersonAsTeacherCommand): Promise<TResult<string>> => {
        return api.post("/Teachers", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateTeacherCommand): Promise<TResult<boolean>> => {
        return api.put("/Teachers", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/Teachers/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
