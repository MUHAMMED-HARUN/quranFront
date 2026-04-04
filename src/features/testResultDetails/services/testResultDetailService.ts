import { api } from '../../../core/api';
import { TResult } from '../../../types';
import { TestResultDetailDto, CreateTestResultDetailCommand, UpdateTestResultDetailCommand } from '../types/testResultDetail.types';

export const testResultDetailService = {
  getAll: async (): Promise<TResult<TestResultDetailDto[]>> => {
    return (await api.get('/api/testResultDetails')) as unknown as TResult<TestResultDetailDto[]>;
  },

  getById: async (id: string): Promise<TResult<TestResultDetailDto>> => {
    return (await api.get(`/api/testResultDetails/${id}`)) as unknown as TResult<TestResultDetailDto>;
  },

  create: async (data: CreateTestResultDetailCommand): Promise<TResult<string>> => {
    return (await api.post('/api/testResultDetails', data)) as unknown as TResult<string>;
  },

  update: async (data: UpdateTestResultDetailCommand): Promise<TResult<string>> => {
    return (await api.put(`/api/testResultDetails/${data.Id}`, data)) as unknown as TResult<string>;
  },

  delete: async (id: string): Promise<TResult<string>> => {
    return (await api.delete(`/api/testResultDetails/${id}`)) as unknown as TResult<string>;
  }
};
