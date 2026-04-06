import { api } from '../../../core/api';
import { TResult } from '../../../types';
import { CompletionRecordDto, CreateCompletionRecordCommand, UpdateCompletionRecordCommand } from '../types/completionRecord.types';

export const completionRecordService = {
    getAll: async (): Promise<TResult<CompletionRecordDto[]>> => {
        return (await api.get('/CompletionRecords')) as unknown as TResult<CompletionRecordDto[]>;
    },

    getById: async (id: string): Promise<TResult<CompletionRecordDto>> => {
        return (await api.get(`/CompletionRecords/${id}`)) as unknown as TResult<CompletionRecordDto>;
    },

    create: async (data: CreateCompletionRecordCommand): Promise<TResult<string>> => {
        return (await api.post('/CompletionRecords', data)) as unknown as TResult<string>;
    },

    update: async (id: string, data: UpdateCompletionRecordCommand): Promise<TResult<string>> => {
        return (await api.put(`/CompletionRecords/${id}`, data)) as unknown as TResult<string>;
    },

    delete: async (id: string): Promise<TResult<boolean>> => {
        return (await api.delete(`/CompletionRecords/${id}`)) as unknown as TResult<boolean>;
    }
};
