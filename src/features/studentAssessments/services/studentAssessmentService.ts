import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { StudentAssessment, CreateStudentAssessmentCommand, UpdateStudentAssessmentCommand } from "../types/studentAssessment.types";

export const studentAssessmentService = {
    getAll: (): Promise<TResult<StudentAssessment[]>> => {
        return api.get("/StudentAssessments") as unknown as Promise<TResult<StudentAssessment[]>>;
    },

    getById: (id: string): Promise<TResult<StudentAssessment>> => {
        return api.get(`/StudentAssessments/${id}`) as unknown as Promise<TResult<StudentAssessment>>;
    },

    create: (data: CreateStudentAssessmentCommand): Promise<TResult<string>> => {
        return api.post("/StudentAssessments", data) as unknown as Promise<TResult<string>>;
    },

    update: (id: string, data: UpdateStudentAssessmentCommand): Promise<TResult<boolean>> => {
        // According to UpdateStudentAssessmentDto, the backend might expect Id inside the body
        return api.put(`/StudentAssessments/${id}`, { ...data, Id: id }) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/StudentAssessments/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
