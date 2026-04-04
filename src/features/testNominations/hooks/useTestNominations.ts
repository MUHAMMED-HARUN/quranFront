import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testNominationService } from '../services/testNominationService';
import { CreateTestNominationCommand, UpdateTestNominationCommand } from '../types/testNomination.types';

export const useTestNominationsQuery = () => {
  return useQuery({
    queryKey: ['testNominations'],
    queryFn: () => testNominationService.getAll(),
  });
};

export const useTestNominationQuery = (id: string) => {
  return useQuery({
    queryKey: ['testNominations', id],
    queryFn: () => testNominationService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTestNominationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTestNominationCommand) => testNominationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testNominations'] });
    },
  });
};

export const useUpdateTestNominationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTestNominationCommand) => testNominationService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testNominations'] });
    },
  });
};

export const useDeleteTestNominationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => testNominationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testNominations'] });
    },
  });
};
