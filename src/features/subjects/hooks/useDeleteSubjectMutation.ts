import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "../services/subjectService";

export const useDeleteSubjectMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => subjectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
    });
};
