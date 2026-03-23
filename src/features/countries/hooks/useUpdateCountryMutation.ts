import { useMutation, useQueryClient } from '@tanstack/react-query';
import { countryService } from '../services/countryService';
import { UpdateCountryCommand } from '../types';

export const useUpdateCountryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateCountryCommand) => countryService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['countries'] });
            // Depending on usage, we might also want to invalidate a specific country's query
        }
    });
};
