import { api } from "../../../core/api";
import { TResult } from "../../../types";
import {
    StudentScopeExecutionsDetailsRegister,
    CreateStudentScopeExecutionsDetailsRegisterCommand,
    UpdateStudentScopeExecutionsDetailsRegisterCommand,
} from "../types/studentScopeExecutionsDetailsRegister.types";

export const studentScopeExecutionsDetailsRegisterService = {
    getAll: (): Promise<TResult<StudentScopeExecutionsDetailsRegister[]>> => {
        return api.get("/StudentScopeExecutionsDetailsRegisters") as unknown as Promise<TResult<StudentScopeExecutionsDetailsRegister[]>>;
    },

    getById: (id: string): Promise<TResult<StudentScopeExecutionsDetailsRegister>> => {
        return api.get(`/StudentScopeExecutionsDetailsRegisters/${id}`) as unknown as Promise<TResult<StudentScopeExecutionsDetailsRegister>>;
    },

    create: (data: CreateStudentScopeExecutionsDetailsRegisterCommand): Promise<TResult<string>> => {
        return api.post("/StudentScopeExecutionsDetailsRegisters", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateStudentScopeExecutionsDetailsRegisterCommand): Promise<TResult<boolean>> => {
        return api.put(`/StudentScopeExecutionsDetailsRegisters/${data.Id}`, data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/StudentScopeExecutionsDetailsRegisters/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
