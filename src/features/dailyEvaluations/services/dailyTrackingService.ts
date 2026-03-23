import { api } from "../../../core/api";
import { TResult } from "../../../types";
import { DailyTracking, CreateDailyTrackingCommand, UpdateDailyTrackingCommand } from "../types/dailyTracking.types";

export const dailyTrackingService = {
    getAll: (): Promise<TResult<DailyTracking[]>> => {
        return api.get("/DailyTrackings") as unknown as Promise<TResult<DailyTracking[]>>;
    },

    getById: (id: string): Promise<TResult<DailyTracking>> => {
        return api.get(`/DailyTrackings/${id}`) as unknown as Promise<TResult<DailyTracking>>;
    },

    create: (data: CreateDailyTrackingCommand): Promise<TResult<string>> => {
        return api.post("/DailyTrackings", data) as unknown as Promise<TResult<string>>;
    },

    update: (id: string, data: UpdateDailyTrackingCommand): Promise<TResult<boolean>> => {
        return api.put(`/DailyTrackings/${id}`, data) as unknown as Promise<TResult<boolean>>;
    },

    delete: (id: string): Promise<TResult<boolean>> => {
        return api.delete(`/DailyTrackings/${id}`) as unknown as Promise<TResult<boolean>>;
    },
};
