import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "../services/subjectService";
import { CreateSubjectCommand } from "../types/subject.types";

export const useCreateSubjectMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSubjectCommand) => subjectService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
    });
};
