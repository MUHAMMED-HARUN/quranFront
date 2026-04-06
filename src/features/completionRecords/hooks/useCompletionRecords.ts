import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { completionRecordService } from '../services/completionRecordService';
import { CreateCompletionRecordCommand, UpdateCompletionRecordCommand } from '../types/completionRecord.types';

export const useCompletionRecordsQuery = () => {
    return useQuery({
        queryKey: ['completionRecords'],
        queryFn: completionRecordService.getAll
    });
};

export const useCompletionRecordByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['completionRecords', id],
        queryFn: () => completionRecordService.getById(id),
        enabled: !!id
    });
};

export const useCreateCompletionRecordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCompletionRecordCommand) => completionRecordService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['completionRecords'] });
        },
        onError: (err) => {
            console.error('حدث خطأ أثناء حفظ سجل الإتمام', err);
        }
    });
};

export const useUpdateCompletionRecordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCompletionRecordCommand }) => 
            completionRecordService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['completionRecords'] });
        },
        onError: (err) => {
            console.error('حدث خطأ أثناء التعديل', err);
        }
    });
};

export const useDeleteCompletionRecordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => completionRecordService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['completionRecords'] });
        },
        onError: (err) => {
            console.error('حدث خطأ أثناء الحذف', err);
        }
    });
};
