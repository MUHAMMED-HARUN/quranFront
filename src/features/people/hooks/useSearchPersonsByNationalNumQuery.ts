import { useQuery } from "@tanstack/react-query";
import { personService } from "../services/personService";

export const useSearchPersonsByNationalNumQuery = (searchTerm: string) => {
    return useQuery({
        queryKey: ["persons", "search", searchTerm],
        queryFn: () => personService.searchByNationalNumber(searchTerm),
        enabled: searchTerm.trim().length > 0,
        staleTime: 1000 * 60 * 5,
    });
};
