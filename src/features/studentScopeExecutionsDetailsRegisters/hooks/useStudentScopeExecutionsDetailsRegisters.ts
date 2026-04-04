import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentScopeExecutionsDetailsRegisterService } from '../services/studentScopeExecutionsDetailsRegisterService';
import { CreateStudentScopeExecutionsDetailsRegisterCommand, UpdateStudentScopeExecutionsDetailsRegisterCommand } from '../types/studentScopeExecutionsDetailsRegister.types';

export const useStudentScopeExecutionsDetailsRegistersQuery = () => {
    return useQuery({
        queryKey: ['studentScopeExecutionsDetailsRegisters'],
        select: (data: any) => data?.Value || data,
    });
};

export const useStudentScopeExecutionsDetailsRegistersWithDetailsQuery = () => {
    return useQuery({
        queryKey: ['studentScopeExecutionsDetailsRegistersWithDetails'],
        queryFn: studentScopeExecutionsDetailsRegisterService.getAllWithDetails,
        select: (data: any) => data?.Value || data,
    });
};

export const useCreateStudentScopeExecutionsDetailsRegisterMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateStudentScopeExecutionsDetailsRegisterCommand) => studentScopeExecutionsDetailsRegisterService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentScopeExecutionsDetailsRegisters'] });
            queryClient.invalidateQueries({ queryKey: ['scopeExecutionDetails'] });
        },
        onError: () => {
            alert("حدث خطأ أثناء تسجيل الطالب");
        }
    });
};

export const useUpdateStudentScopeExecutionsDetailsRegisterMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStudentScopeExecutionsDetailsRegisterCommand }) => {
            return studentScopeExecutionsDetailsRegisterService.update(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentScopeExecutionsDetailsRegisters'] });
        },
        onError: () => {
            alert("حدث خطأ أثناء التحديث");
        }
    });
};

export const useDeleteStudentScopeExecutionsDetailsRegisterMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => studentScopeExecutionsDetailsRegisterService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentScopeExecutionsDetailsRegisters'] });
        },
        onError: () => {
            alert("حدث خطأ أثناء الحذف");
        }
    });
};

