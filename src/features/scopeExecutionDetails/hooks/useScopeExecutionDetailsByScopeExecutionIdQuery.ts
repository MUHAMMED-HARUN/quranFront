import { useQuery } from '@tanstack/react-query';
import { api } from '../../../core/api';

export const useScopeExecutionDetailsByScopeExecutionIdQuery = (scopeExecutionId: string | null) => {
    return useQuery({
        queryKey: ['scopeExecutionDetailsByScopeExecution', scopeExecutionId],
        queryFn: async () => {
            const { data } = await api.get(`/ScopeExecutionDetails/scopeExecution/${scopeExecutionId}`);
            return data;
        },
        enabled: !!scopeExecutionId,
    });
};
