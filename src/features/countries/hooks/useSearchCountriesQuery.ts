import { useQuery } from '@tanstack/react-query';
import { countryService } from '../services/countryService';

export const useSearchCountriesQuery = (prefix: string) => {
    return useQuery({
        queryKey: ['countries', 'search', prefix],
        queryFn: () => (prefix ? countryService.searchByName(prefix) : Promise.resolve({ IsSuccess: true, Value: [] } as any)),
        enabled: !!prefix,
    });
};
