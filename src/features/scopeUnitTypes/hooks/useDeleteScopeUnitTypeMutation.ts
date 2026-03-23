import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scopeUnitTypeService } from "../services/scopeUnitTypeService";

export const useDeleteScopeUnitTypeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => scopeUnitTypeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scopeUnitTypes"] });
        },
    });
};
