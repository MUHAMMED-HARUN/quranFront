import { useQuery } from "@tanstack/react-query";
import { instituteClassService } from "../services/instituteClassService";

export const useInstituteClassesQuery = () => {
    return useQuery({
        queryKey: ["instituteClasses"],
        queryFn: () => instituteClassService.getAll(),
    });
};
