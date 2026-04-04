import { useQuery } from '@tanstack/react-query';
import { api } from '../../../core/api';

export const useRegistrationsByStudentEnrollmentIdQuery = (studentEnrollmentId: string | null) => {
    return useQuery({
        queryKey: ['registrationsByEnrollment', studentEnrollmentId],
        queryFn: async () => {
            const { data } = await api.get(`/StudentScopeExecutionsDetailsRegisters/ByStudentEnrollment/${studentEnrollmentId}`);
            return data;
        },
        enabled: !!studentEnrollmentId,
    });
};
