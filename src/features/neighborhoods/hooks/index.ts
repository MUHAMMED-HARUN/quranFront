import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { neighborhoodService } from "../services/neighborhoodService";
import { CreateNeighborhoodCommand, UpdateNeighborhoodCommand } from "../types/neighborhood.types";

export const useNeighborhoodsQuery = (districtId?: string) => {
    return useQuery({
        queryKey: districtId ? ["neighborhoods", "byDistrict", districtId] : ["neighborhoods"],
        queryFn: () =>
            districtId ? neighborhoodService.getByDistrictId(districtId) : neighborhoodService.getAll(),
    });
};

export const useNeighborhoodQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["neighborhoods", id],
        queryFn: () => (id ? neighborhoodService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};

export const useCreateNeighborhoodMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateNeighborhoodCommand) => neighborhoodService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["neighborhoods"] });
        },
    });
};

export const useUpdateNeighborhoodMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateNeighborhoodCommand) => neighborhoodService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["neighborhoods"] });
        },
    });
};

export const useDeleteNeighborhoodMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => neighborhoodService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["neighborhoods"] });
        },
    });
};
