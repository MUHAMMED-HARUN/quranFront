import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matterService } from "../services/matterService";
import { UpdateMatterCommand } from "../types/matter.types";

export const useUpdateMatterMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMatterCommand }) =>
            matterService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["matters"] });
            queryClient.invalidateQueries({ queryKey: ["matter", variables.id] });
        },
    });
};
