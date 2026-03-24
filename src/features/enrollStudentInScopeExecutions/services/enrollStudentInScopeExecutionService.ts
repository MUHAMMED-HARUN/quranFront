import { api } from "../../../core/api";
import { TResult } from "../../../types";
import {
    EnrollStudentInScopeExecution,
    CreateEnrollStudentInScopeExecutionCommand,
    UpdateEnrollStudentInScopeExecutionCommand
} from "../types/enrollStudentInScopeExecution.types";

export const enrollStudentInScopeExecutionService = {
    getById: async (id: string): Promise<TResult<EnrollStudentInScopeExecution>> => {
        return (await api.get(`/EnrollStudentInScopeExecutions/${id}`)) as unknown as TResult<EnrollStudentInScopeExecution>;
    },

    getByScopeExecutionId: async (scopeExecutionId: string): Promise<TResult<EnrollStudentInScopeExecution[]>> => {
        return (await api.get(`/EnrollStudentInScopeExecutions/ScopeExecution/${scopeExecutionId}`)) as unknown as TResult<EnrollStudentInScopeExecution[]>;
    },

    create: async (data: CreateEnrollStudentInScopeExecutionCommand): Promise<TResult<string>> => {
        return (await api.post("/EnrollStudentInScopeExecutions", data)) as unknown as TResult<string>;
    },

    update: async (id: string, data: UpdateEnrollStudentInScopeExecutionCommand): Promise<TResult<string>> => {
        return (await api.put(`/EnrollStudentInScopeExecutions/${id}`, data)) as unknown as TResult<string>;
    },

    delete: async (id: string): Promise<TResult<boolean>> => {
        return (await api.delete(`/EnrollStudentInScopeExecutions/${id}`)) as unknown as TResult<boolean>;
    }
};
