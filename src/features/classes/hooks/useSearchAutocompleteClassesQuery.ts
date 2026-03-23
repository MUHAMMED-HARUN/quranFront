import { useQuery } from "@tanstack/react-query";
import { classService } from "../services/classService";

export const useSearchAutocompleteClassesQuery = (name: string) => {
    return useQuery({
        queryKey: ["classes", "searchAutocomplete", name],
        queryFn: () => classService.searchAutocomplete(name),
        enabled: name.length > 0
    });
};
