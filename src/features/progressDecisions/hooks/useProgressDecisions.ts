import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressDecisionService } from '../services/progressDecisionService';
import { CreateProgressDecisionCommand, UpdateProgressDecisionCommand } from '../types/progressDecision.types';

export const useProgressDecisionsQuery = () => {
    return useQuery({
        queryKey: ['progressDecisions'],
        queryFn: progressDecisionService.getAll
    });
};

export const useProgressDecisionByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['progressDecisions', id],
        queryFn: () => progressDecisionService.getById(id),
        enabled: !!id
    });
};

export const useCreateProgressDecisionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProgressDecisionCommand) => progressDecisionService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['progressDecisions'] });
        },
        onError: (err) => {
            console.error('حدث خطأ أثناء حفظ القرار', err);
        }
    });
};

export const useUpdateProgressDecisionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProgressDecisionCommand }) => 
            progressDecisionService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['progressDecisions'] });
        },
        onError: (err) => {
            console.error('حدث خطأ أثناء التعديل', err);
        }
    });
};

export const useDeleteProgressDecisionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => progressDecisionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['progressDecisions'] });
        },
        onError: (err) => {
            console.error('حدث خطأ أثناء الحذف', err);
        }
    });
};
