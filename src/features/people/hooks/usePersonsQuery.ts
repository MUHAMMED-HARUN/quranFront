import { useQuery } from "@tanstack/react-query";
import { personService } from "../services/personService";

export const usePersonsQuery = () => {
    return useQuery({
        queryKey: ["persons"],
        queryFn: () => personService.getAll(),
    });
};
