import { api } from '../../../core/api';
import { TResult } from '../../../types';
import { ProgressDecisionDto, CreateProgressDecisionCommand, UpdateProgressDecisionCommand } from '../types/progressDecision.types';

export const progressDecisionService = {
    getAll: async (): Promise<TResult<ProgressDecisionDto[]>> => {
        return (await api.get('/ProgressDecisions')) as unknown as TResult<ProgressDecisionDto[]>;
    },

    getById: async (id: string): Promise<TResult<ProgressDecisionDto>> => {
        return (await api.get(`/ProgressDecisions/${id}`)) as unknown as TResult<ProgressDecisionDto>;
    },

    create: async (data: CreateProgressDecisionCommand): Promise<TResult<string>> => {
        return (await api.post('/ProgressDecisions', data)) as unknown as TResult<string>;
    },

    update: async (id: string, data: UpdateProgressDecisionCommand): Promise<TResult<string>> => {
        return (await api.put(`/ProgressDecisions/${id}`, data)) as unknown as TResult<string>;
    },

    delete: async (id: string): Promise<TResult<boolean>> => {
        return (await api.delete(`/ProgressDecisions/${id}`)) as unknown as TResult<boolean>;
    }
};
