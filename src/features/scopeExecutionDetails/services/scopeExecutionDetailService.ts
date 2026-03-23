import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { ScopeExecutionDetail, CreateScopeExecutionDetailCommand, UpdateScopeExecutionDetailCommand } from "../types/scopeExecutionDetail.types";

export const scopeExecutionDetailService = {
    getAll: (): Promise<TResult<ScopeExecutionDetail[]>> => {
        return api.get("/ScopeExecutionDetails") as unknown as Promise<TResult<ScopeExecutionDetail[]>>;
    },

    searchByScopeExecutionName: (name: string): Promise<TResult<ScopeExecutionDetail[]>> => {
        return api.get(`/ScopeExecutionDetails/search?name=${encodeURIComponent(name)}`) as unknown as Promise<TResult<ScopeExecutionDetail[]>>;
    },

    getById: (id: string): Promise<TResult<ScopeExecutionDetail>> => {
        return api.get(`/ScopeExecutionDetails/${id}`) as unknown as Promise<TResult<ScopeExecutionDetail>>;
    },

    create: (data: CreateScopeExecutionDetailCommand): Promise<TResult<string>> => {
        return api.post("/ScopeExecutionDetails", data) as unknown as Promise<TResult<string>>;
    },

    update: (id: string, data: UpdateScopeExecutionDetailCommand): Promise<TResult<boolean>> => {
        return api.put(`/ScopeExecutionDetails/${id}`, data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/ScopeExecutionDetails/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
