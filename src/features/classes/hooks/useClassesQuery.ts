import { useQuery } from "@tanstack/react-query";
import { classService } from "../services/classService";

export const useClassesQuery = () => {
    return useQuery({
        queryKey: ["classes"],
        queryFn: () => classService.getAll(),
    });
};
