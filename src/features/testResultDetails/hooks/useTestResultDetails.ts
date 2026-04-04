import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testResultDetailService } from '../services/testResultDetailService';
import { CreateTestResultDetailCommand, UpdateTestResultDetailCommand } from '../types/testResultDetail.types';

export const useTestResultDetailsQuery = () => {
  return useQuery({
    queryKey: ['testResultDetails'],
    queryFn: () => testResultDetailService.getAll(),
  });
};

export const useTestResultDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ['testResultDetails', id],
    queryFn: () => testResultDetailService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTestResultDetailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTestResultDetailCommand) => testResultDetailService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testResultDetails'] });
    },
  });
};

export const useUpdateTestResultDetailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTestResultDetailCommand) => testResultDetailService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testResultDetails'] });
    },
  });
};

export const useDeleteTestResultDetailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => testResultDetailService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testResultDetails'] });
    },
  });
};
