import { api } from '../../../core/api';
import { TResult } from '../../../types';
import { TestNominationDto, CreateTestNominationCommand, UpdateTestNominationCommand } from '../types/testNomination.types';

export const testNominationService = {
  getAll: async (): Promise<TResult<TestNominationDto[]>> => {
    return (await api.get('/api/testNominations')) as unknown as TResult<TestNominationDto[]>;
  },

  getById: async (id: string): Promise<TResult<TestNominationDto>> => {
    return (await api.get(`/api/testNominations/${id}`)) as unknown as TResult<TestNominationDto>;
  },

  create: async (data: CreateTestNominationCommand): Promise<TResult<string>> => {
    return (await api.post('/api/testNominations', data)) as unknown as TResult<string>;
  },

  update: async (data: UpdateTestNominationCommand): Promise<TResult<string>> => {
    return (await api.put(`/api/testNominations/${data.Id}`, data)) as unknown as TResult<string>;
  },

  delete: async (id: string): Promise<TResult<string>> => {
    return (await api.delete(`/api/testNominations/${id}`)) as unknown as TResult<string>;
  }
};
