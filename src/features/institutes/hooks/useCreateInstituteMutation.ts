import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instituteService } from "../services/instituteService";
import { AddInstituteWithAddressCommand } from "../types/institute.types";

export const useCreateInstituteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddInstituteWithAddressCommand) => instituteService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutes"] });
        },
    });
};
