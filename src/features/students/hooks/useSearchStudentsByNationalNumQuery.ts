import { useQuery } from "@tanstack/react-query";
import { studentService } from "../services/studentService";

export const useSearchStudentsByNationalNumQuery = (nationalNumber: string) => {
    return useQuery({
        queryKey: ["students", "searchByNationalNumber", nationalNumber],
        queryFn: () => studentService.searchByNationalNumber(nationalNumber),
        enabled: nationalNumber.length > 0
    });
};
