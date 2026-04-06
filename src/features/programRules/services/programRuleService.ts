import { api } from '../../../core/api';
import { TResult } from '../../../types';
import { ProgramRuleDto, CreateProgramRuleCommand, UpdateProgramRuleCommand } from '../types/programRule.types';

export const programRuleService = {
    getAll: async (): Promise<TResult<ProgramRuleDto[]>> => {
        return (await api.get('/ProgramRules')) as unknown as TResult<ProgramRuleDto[]>;
    },

    getById: async (id: string): Promise<TResult<ProgramRuleDto>> => {
        return (await api.get(`/ProgramRules/${id}`)) as unknown as TResult<ProgramRuleDto>;
    },

    create: async (data: CreateProgramRuleCommand): Promise<TResult<string>> => {
        return (await api.post('/ProgramRules', data)) as unknown as TResult<string>;
    },

    update: async (id: string, data: UpdateProgramRuleCommand): Promise<TResult<string>> => {
        return (await api.put(`/ProgramRules/${id}`, data)) as unknown as TResult<string>;
    },

    delete: async (id: string): Promise<TResult<boolean>> => {
        return (await api.delete(`/ProgramRules/${id}`)) as unknown as TResult<boolean>;
    }
};
