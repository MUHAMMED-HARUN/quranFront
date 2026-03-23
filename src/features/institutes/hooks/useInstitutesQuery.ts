import { useQuery } from "@tanstack/react-query";
import { instituteService } from "../services/instituteService";

export const useInstitutesQuery = () => {
    return useQuery({
        queryKey: ["institutes"],
        queryFn: () => instituteService.getAll(),
    });
};
