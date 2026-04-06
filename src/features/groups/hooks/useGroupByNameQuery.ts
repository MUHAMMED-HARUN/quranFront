import { useQuery } from '@tanstack/react-query';
import { groupService } from '../services/groupService';

export const useGroupByNameQuery = (name: string | null) => {
    return useQuery({
        queryKey: ['groups', 'name', name],
        queryFn: () => {
            if (!name) return null;
            return groupService.getByName(name);
        },
        enabled: !!name,
    });
};
