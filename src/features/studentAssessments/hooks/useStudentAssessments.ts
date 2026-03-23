import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentAssessmentService } from "../services/studentAssessmentService";
import { CreateStudentAssessmentCommand, UpdateStudentAssessmentCommand } from "../types/studentAssessment.types";

export const useStudentAssessmentsQuery = () => {
    return useQuery({
        queryKey: ["studentAssessments"],
        queryFn: () => studentAssessmentService.getAll()
    });
};

export const useCreateStudentAssessmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateStudentAssessmentCommand) => studentAssessmentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentAssessments"] });
        }
    });
};

export const useUpdateStudentAssessmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStudentAssessmentCommand }) => studentAssessmentService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentAssessments"] });
        }
    });
};

export const useDeleteStudentAssessmentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => studentAssessmentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentAssessments"] });
        }
    });
};
