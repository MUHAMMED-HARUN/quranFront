import { api } from "../../../core/api";
import { TResult } from "../../../types";
import {
    ScopeUnitType,
    CreateScopeUnitTypeCommand,
    UpdateScopeUnitTypeCommand,
} from "../types/scopeUnitType.types";

export const scopeUnitTypeService = {
    getAll: (): Promise<TResult<ScopeUnitType[]>> => {
        return api.get("/ScopeUnitTypes") as unknown as Promise<TResult<ScopeUnitType[]>>;
    },

    getById: (id: string): Promise<TResult<ScopeUnitType>> => {
        return api.get(`/ScopeUnitTypes/${id}`) as unknown as Promise<TResult<ScopeUnitType>>;
    },

    create: (data: CreateScopeUnitTypeCommand): Promise<TResult<string>> => {
        return api.post("/ScopeUnitTypes", data) as unknown as Promise<TResult<string>>;
    },

    update: (data: UpdateScopeUnitTypeCommand): Promise<TResult<boolean>> => {
        return api.put(`/ScopeUnitTypes/${data.ID}`, data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/ScopeUnitTypes/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
