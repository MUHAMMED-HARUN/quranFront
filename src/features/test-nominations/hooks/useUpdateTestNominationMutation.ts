import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testNominationService } from "../services/testNominationService";
import { UpdateTestNominationDTO } from "../types/testNomination.types";

export const useUpdateTestNominationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTestNominationDTO) => testNominationService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testNominationsFilter"] });
    },
  });
};
