import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { CreateDailyEvaluationCommand, UpdateDailyEvaluationCommand, DailyEvaluation } from "../types/dailyEvaluation.types";

export const dailyEvaluationService = {
    getAll: (): Promise<TResult<DailyEvaluation[]>> => {
        return api.get("/DailyEvaluations") as unknown as Promise<TResult<DailyEvaluation[]>>;
    },
    getById: (id: string): Promise<TResult<DailyEvaluation>> => {
        return api.get(`/DailyEvaluations/${id}`) as unknown as Promise<TResult<DailyEvaluation>>;
    },
    create: (data: CreateDailyEvaluationCommand): Promise<TResult<string>> => {
        return api.post("/DailyEvaluations", data) as unknown as Promise<TResult<string>>;
    },
    update: (id: string, data: UpdateDailyEvaluationCommand): Promise<TResult<boolean>> => {
        return api.put(`/DailyEvaluations/${id}`, data) as unknown as Promise<TResult<boolean>>;
    },
    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/DailyEvaluations/${id}`) as unknown as Promise<TResult<boolean>>;
    }
};
