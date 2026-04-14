import { useMutation, useQueryClient } from "@tanstack/react-query";
import { testNominationService } from "../services/testNominationService";
import { CreateTestNominationDTO } from "../types/testNomination.types";

export const useCreateTestNominationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTestNominationDTO) => testNominationService.create(data),
    onSuccess: (result) => {
      if ((result as any)?.IsSuccess || (result as any)?.isSuccess) {
        // success indication
        queryClient.invalidateQueries({ queryKey: ["testNominations"] });
      } else {
        window.alert((result as any)?.ErrorMessage || (result as any)?.errorMessage || "حدث خطأ أثناء الترشيح");
      }
    },
    onError: () => {
      window.alert("حدث خطأ أثناء الترشيح");
    },
  });
};
