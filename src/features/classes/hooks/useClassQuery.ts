import { useQuery } from "@tanstack/react-query";
import { classService } from "../services/classService";

export const useClassQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["classes", id],
        queryFn: () => (id ? classService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};
