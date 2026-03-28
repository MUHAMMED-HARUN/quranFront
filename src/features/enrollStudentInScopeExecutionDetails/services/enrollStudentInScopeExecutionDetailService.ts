import { api } from "../../../core/api";
import { TResult } from "../../../types";
import {
    EnrollStudentInScopeExecutionDetail,
    CreateEnrollStudentInScopeExecutionDetailCommand,
    UpdateEnrollStudentInScopeExecutionDetailCommand
} from "../types/enrollStudentInScopeExecutionDetail.types";

const BASE_URL = "/EnrollStudentInScopeExecutionDetails";

export const enrollStudentInScopeExecutionDetailService = {
    getAll: async (): Promise<TResult<EnrollStudentInScopeExecutionDetail[]>> => {
        const response = await api.get<TResult<EnrollStudentInScopeExecutionDetail[]>>(BASE_URL);
        return response.data;
    },

    getById: async (id: string): Promise<TResult<EnrollStudentInScopeExecutionDetail>> => {
        const response = await api.get<TResult<EnrollStudentInScopeExecutionDetail>>(`${BASE_URL}/${id}`);
        return response.data;
    },

    getByScopeExecutionDetailId: async (scopeExecutionDetailId: string): Promise<TResult<EnrollStudentInScopeExecutionDetail[]>> => {
        const response = await api.get<TResult<EnrollStudentInScopeExecutionDetail[]>>(`${BASE_URL}/ByScopeExecutionDetailId/${scopeExecutionDetailId}`);
        return response.data;
    },

    create: async (data: CreateEnrollStudentInScopeExecutionDetailCommand): Promise<TResult<string>> => {
        const response = await api.post<TResult<string>>(BASE_URL, data);
        return response.data;
    },

    update: async (data: UpdateEnrollStudentInScopeExecutionDetailCommand): Promise<TResult<string>> => {
        const response = await api.put<TResult<string>>(BASE_URL, data);
        return response.data;
    },

    delete: async (id: string): Promise<TResult<boolean>> => {
        const response = await api.delete<TResult<boolean>>(`${BASE_URL}/${id}`);
        return response.data;
    }
};
