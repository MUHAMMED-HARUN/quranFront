import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "../services/subjectService";
import { UpdateSubjectCommand } from "../types/subject.types";

export const useUpdateSubjectMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSubjectCommand) => subjectService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
    });
};
