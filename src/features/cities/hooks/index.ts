import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cityService } from "../services/cityService";
import { CreateCityCommand, UpdateCityCommand } from "../types/city.types";

export const useCitiesQuery = (countryId?: string) => {
    return useQuery({
        queryKey: countryId ? ["cities", "byCountry", countryId] : ["cities"],
        queryFn: () =>
            countryId ? cityService.getByCountryId(countryId) : cityService.getAll(),
    });
};

export const useCityQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["cities", id],
        queryFn: () => (id ? cityService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};

export const useCreateCityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCityCommand) => cityService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cities"] });
        },
    });
};

export const useUpdateCityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateCityCommand) => cityService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cities"] });
        },
    });
};

export const useDeleteCityMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => cityService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cities"] });
        },
    });
};
