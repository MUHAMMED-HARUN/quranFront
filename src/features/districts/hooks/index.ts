import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { districtService } from "../services/districtService";
import { CreateDistrictCommand, UpdateDistrictCommand } from "../types/district.types";

export const useDistrictsQuery = (cityId?: string) => {
    return useQuery({
        queryKey: cityId ? ["districts", "byCity", cityId] : ["districts"],
        queryFn: () =>
            cityId ? districtService.getByCityId(cityId) : districtService.getAll(),
    });
};

export const useDistrictQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["districts", id],
        queryFn: () => (id ? districtService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};

export const useCreateDistrictMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateDistrictCommand) => districtService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
        },
    });
};

export const useUpdateDistrictMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateDistrictCommand) => districtService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
        },
    });
};

export const useDeleteDistrictMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => districtService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
        },
    });
};
