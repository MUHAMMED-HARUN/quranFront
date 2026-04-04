import { api } from '../../../core/api';
import { TResult } from '../../../types';
import { TestSessionDto, CreateTestSessionCommand, UpdateTestSessionCommand } from '../types/testSession.types';

export const testSessionService = {
  getAll: async (): Promise<TResult<TestSessionDto[]>> => {
    return (await api.get('/api/testSessions')) as unknown as TResult<TestSessionDto[]>;
  },

  getById: async (id: string): Promise<TResult<TestSessionDto>> => {
    return (await api.get(`/api/testSessions/${id}`)) as unknown as TResult<TestSessionDto>;
  },

  create: async (data: CreateTestSessionCommand): Promise<TResult<string>> => {
    return (await api.post('/api/testSessions', data)) as unknown as TResult<string>;
  },

  update: async (data: UpdateTestSessionCommand): Promise<TResult<string>> => {
    return (await api.put(`/api/testSessions/${data.Id}`, data)) as unknown as TResult<string>;
  },

  delete: async (id: string): Promise<TResult<string>> => {
    return (await api.delete(`/api/testSessions/${id}`)) as unknown as TResult<string>;
  }
};
