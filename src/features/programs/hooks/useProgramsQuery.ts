import { useQuery } from "@tanstack/react-query";
import { programService } from "../services/programService";

export const useProgramsQuery = () => {
    return useQuery({
        queryKey: ["programs"],
        queryFn: () => programService.getAll(),
    });
};
