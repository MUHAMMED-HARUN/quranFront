import { useMutation, useQueryClient } from '@tanstack/react-query';
import { countryService } from '../services/countryService';

export const useDeleteCountryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => countryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['countries'] });
        }
    });
};
