import { useQuery } from "@tanstack/react-query";
import { scopeUnitTypeService } from "../services/scopeUnitTypeService";

export const useScopeUnitTypesQuery = () => {
    return useQuery({
        queryKey: ["scopeUnitTypes"],
        queryFn: () => scopeUnitTypeService.getAll(),
    });
};
