import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instituteService } from "../services/instituteService";
import { UpdateInstituteCommand } from "../types/institute.types";

export const useUpdateInstituteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateInstituteCommand) => instituteService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutes"] });
        },
    });
};
