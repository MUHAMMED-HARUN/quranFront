import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { ScopeExecution, CreateScopeExecutionCommand, UpdateScopeExecutionCommand } from "../types/scopeExecution.types";

export interface SearchScopeExecutionDto {
    Id: string;
    Name: string;
}

export const scopeExecutionService = {
    getAll: (): Promise<TResult<ScopeExecution[]>> => {
        return api.get("/ScopeExecutions") as unknown as Promise<TResult<ScopeExecution[]>>;
    },

    getById: (id: string): Promise<TResult<ScopeExecution>> => {
        return api.get(`/ScopeExecutions/${id}`) as unknown as Promise<TResult<ScopeExecution>>;
    },

    searchByName: (name: string): Promise<TResult<SearchScopeExecutionDto[]>> => {
        return api.get(`/ScopeExecutions/search/${name}`) as unknown as Promise<TResult<SearchScopeExecutionDto[]>>;
    },

    create: (data: CreateScopeExecutionCommand): Promise<TResult<string>> => {
        return api.post("/ScopeExecutions", data) as unknown as Promise<TResult<string>>;
    },

    // Note: Assuming these exist on the backend or will be used. Only Create/Submit is specified, but CRUD uses them.
    update: (id: string, data: UpdateScopeExecutionCommand): Promise<TResult<boolean>> => {
        return api.put(`/ScopeExecutions/${id}`, data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/ScopeExecutions/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
