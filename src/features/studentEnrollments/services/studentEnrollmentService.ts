import { api } from "../../../core/api";
import { TResult } from "../../../types";
import {
    StudentEnrollment,
    CreateStudentEnrollmentCommand,
    UpdateStudentEnrollmentCommand,
} from "../types/studentEnrollment.types";

export const studentEnrollmentService = {
    getAll: (): Promise<TResult<StudentEnrollment[]>> => {
        return api.get("/StudentEnrollments") as unknown as Promise<TResult<StudentEnrollment[]>>;
    },

    getById: (id: string): Promise<TResult<StudentEnrollment>> => {
        return api.get(`/StudentEnrollments/${id}`) as unknown as Promise<TResult<StudentEnrollment>>;
    },

    getByGroupId: (groupId: string): Promise<TResult<StudentEnrollment[]>> => {
        return api.get(`/StudentEnrollments/group/${groupId}`) as unknown as Promise<TResult<StudentEnrollment[]>>;
    },

    getByStudentAndGroup: (studentId: string, groupId: string): Promise<TResult<StudentEnrollment>> => {
        return api.get(`/StudentEnrollments/student/${studentId}/group/${groupId}`) as unknown as Promise<TResult<StudentEnrollment>>;
    },

    create: (data: CreateStudentEnrollmentCommand): Promise<TResult<string>> => {
        return api.post("/StudentEnrollments", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateStudentEnrollmentCommand): Promise<TResult<boolean>> => {
        return api.put("/StudentEnrollments", data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/StudentEnrollments/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
