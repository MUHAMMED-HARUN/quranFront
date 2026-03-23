import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scopeUnitTypeService } from "../services/scopeUnitTypeService";
import { CreateScopeUnitTypeCommand } from "../types/scopeUnitType.types";

export const useCreateScopeUnitTypeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateScopeUnitTypeCommand) => scopeUnitTypeService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scopeUnitTypes"] });
        },
    });
};
