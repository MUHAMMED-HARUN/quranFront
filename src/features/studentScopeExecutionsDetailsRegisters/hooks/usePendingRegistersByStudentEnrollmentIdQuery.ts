import { useQuery } from '@tanstack/react-query';
import { studentScopeExecutionsDetailsRegisterService } from '../services/studentScopeExecutionsDetailsRegisterService';

export const usePendingRegistersByStudentEnrollmentIdQuery = (studentEnrollmentId: string | null) => {
    return useQuery({
        queryKey: ['studentScopeExecutionsDetailsRegisters', 'pending', studentEnrollmentId],
        queryFn: () => {
            if (!studentEnrollmentId) return null;
            return studentScopeExecutionsDetailsRegisterService.getPendingByStudentEnrollmentId(studentEnrollmentId);
        },
        enabled: !!studentEnrollmentId,
    });
}
