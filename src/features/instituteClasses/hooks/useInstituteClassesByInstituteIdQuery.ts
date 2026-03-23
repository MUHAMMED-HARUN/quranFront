import { useQuery } from "@tanstack/react-query";
import { instituteClassService } from "../services/instituteClassService";

export const useInstituteClassesByInstituteIdQuery = (instituteId: string) => {
    return useQuery({
        queryKey: ["instituteClasses", "byInstitute", instituteId],
        queryFn: () => instituteClassService.getByInstituteId(instituteId),
        enabled: !!instituteId, // Only fetch if we have an instituteId
    });
};
