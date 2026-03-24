import { useQuery } from "@tanstack/react-query";
import { studentService } from "../services/studentService";

export const useSearchStudentsByNationalNumberQuery = (nationalNumber: string) => {
    return useQuery({
        queryKey: ["students", "search", nationalNumber],
        queryFn: () => studentService.searchByNationalNumber(nationalNumber),
        enabled: nationalNumber.length > 0,
    });
};
