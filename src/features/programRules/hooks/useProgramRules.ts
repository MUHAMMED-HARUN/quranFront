import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { programRuleService } from '../services/programRuleService';
import { CreateProgramRuleCommand, UpdateProgramRuleCommand } from '../types/programRule.types';

export const useProgramRulesQuery = () => {
    return useQuery({
        queryKey: ['programRules'],
        queryFn: programRuleService.getAll
    });
};

export const useProgramRuleByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['programRules', id],
        queryFn: () => programRuleService.getById(id),
        enabled: !!id
    });
};

export const useCreateProgramRuleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProgramRuleCommand) => programRuleService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programRules'] });
        },
        onError: (err) => {
            console.error('حدث خطأ أثناء إضافة القاعدة', err);
        }
    });
};

export const useUpdateProgramRuleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProgramRuleCommand }) => 
            programRuleService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programRules'] });
        },
        onError: (err) => {
            console.error('حدث خطأ أثناء التعديل', err);
        }
    });
};

export const useDeleteProgramRuleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => programRuleService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programRules'] });
        },
        onError: (err) => {
            console.error('حدث خطأ أثناء الحذف', err);
        }
    });
};
