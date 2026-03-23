import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "../services/groupService";
import { UpdateGroupCommand } from "../types/group.types";

export const useUpdateGroupMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateGroupCommand) => groupService.update(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            queryClient.invalidateQueries({ queryKey: ["group", variables.GroupID] });
        },
    });
};
