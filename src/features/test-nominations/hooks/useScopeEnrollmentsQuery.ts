import { useQuery } from "@tanstack/react-query";
import { testNominationService } from "../services/testNominationService";

export const useScopeEnrollmentsQuery = (studentEnrollmentId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["scopeEnrollments", studentEnrollmentId],
    queryFn: () => testNominationService.getScopeExecutionEnrollmentByEnrollmentStudent(studentEnrollmentId as string),
    enabled: enabled && !!studentEnrollmentId,
  });
};
