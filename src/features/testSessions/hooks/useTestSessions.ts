import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testSessionService } from '../services/testSessionService';
import { CreateTestSessionCommand, UpdateTestSessionCommand } from '../types/testSession.types';

export const useTestSessionsQuery = () => {
  return useQuery({
    queryKey: ['testSessions'],
    queryFn: () => testSessionService.getAll(),
  });
};

export const useTestSessionQuery = (id: string) => {
  return useQuery({
    queryKey: ['testSessions', id],
    queryFn: () => testSessionService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTestSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTestSessionCommand) => testSessionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testSessions'] });
    },
  });
};

export const useUpdateTestSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTestSessionCommand) => testSessionService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testSessions'] });
    },
  });
};

export const useDeleteTestSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => testSessionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testSessions'] });
    },
  });
};
