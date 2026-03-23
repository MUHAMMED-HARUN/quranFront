import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "../services/groupService";
import { CreateGroupCommand } from "../types/group.types";

export const useCreateGroupMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGroupCommand) => groupService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};
