import { useQuery } from '@tanstack/react-query';
import { countryService } from '../services/countryService';

export const useCountryQuery = (id: string | null) => {
    return useQuery({
        queryKey: ['country', id],
        queryFn: () => countryService.getById(id!),
        enabled: !!id
    });
};
