import { useQuery } from '@tanstack/react-query';
import { studentService } from '../services/studentService';

export const useStudentByNationalNumberQuery = (nationalNumber: string | null) => {
    return useQuery({
        queryKey: ['students', 'nationalNumber', nationalNumber],
        queryFn: () => {
            if (!nationalNumber) return null;
            return studentService.getByNationalNumber(nationalNumber);
        },
        enabled: !!nationalNumber,
    });
};
