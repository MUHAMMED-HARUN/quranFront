import { useMutation, useQueryClient } from '@tanstack/react-query';
import { countryService } from '../services/countryService';
import { CreateCountryCommand } from '../types';

export const useCreateCountryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCountryCommand) => countryService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['countries'] });
        }
    });
};
