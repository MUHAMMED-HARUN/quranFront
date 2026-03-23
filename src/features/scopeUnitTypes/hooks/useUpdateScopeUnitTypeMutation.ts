import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scopeUnitTypeService } from "../services/scopeUnitTypeService";
import { UpdateScopeUnitTypeCommand } from "../types/scopeUnitType.types";

export const useUpdateScopeUnitTypeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateScopeUnitTypeCommand) => scopeUnitTypeService.update(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["scopeUnitTypes"] });
            queryClient.invalidateQueries({ queryKey: ["scopeUnitType", variables.ID] });
        },
    });
};
