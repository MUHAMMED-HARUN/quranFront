import { useQuery } from '@tanstack/react-query';
import { api } from '../../../core/api';

export const useActiveEnrollStudentInScopeExecutionByStudentIdQuery = (studentId: string | null) => {
    return useQuery({
        queryKey: ['activeEnrollStudentInScopeExecution', studentId],
        queryFn: async () => {
            const { data } = await api.get(`/EnrollStudentInScopeExecutions/ActiveForStudent/${studentId}`);
            return data;
        },
        enabled: !!studentId,
    });
};
