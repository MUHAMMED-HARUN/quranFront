import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { AssessmentScope, CreateAssessmentScopeCommand, UpdateAssessmentScopeCommand } from "../types/assessmentScope.types";

export interface SearchAssessmentScopeDto {
    Id: string;
    Name: string;
}

export const assessmentScopeService = {
    getAll: (): Promise<TResult<AssessmentScope[]>> => {
        return api.get("/AssessmentScopes") as unknown as Promise<TResult<AssessmentScope[]>>;
    },

    getById: (id: string): Promise<TResult<AssessmentScope>> => {
        return api.get(`/AssessmentScopes/${id}`) as unknown as Promise<TResult<AssessmentScope>>;
    },

    searchByName: (name: string): Promise<TResult<SearchAssessmentScopeDto[]>> => {
        return api.get(`/AssessmentScopes/search/${name}`) as unknown as Promise<TResult<SearchAssessmentScopeDto[]>>;
    },

    create: (data: CreateAssessmentScopeCommand): Promise<TResult<string>> => {
        return api.post("/AssessmentScopes", data) as unknown as Promise<TResult<string>>;
    },

    update: (id: string, data: UpdateAssessmentScopeCommand): Promise<TResult<boolean>> => {
        return api.put(`/AssessmentScopes/${id}`, data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/AssessmentScopes/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
