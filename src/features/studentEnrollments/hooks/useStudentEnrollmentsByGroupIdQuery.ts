import { useQuery } from '@tanstack/react-query';
import { studentEnrollmentService } from '../services/studentEnrollmentService';

export const useStudentEnrollmentsByGroupIdQuery = (groupId?: string) => {
    return useQuery({
        queryKey: ['studentEnrollmentsByGroup', groupId],
        queryFn: () => {
            if (!groupId) return Promise.resolve({ IsSuccess: true, Value: [] });
            return studentEnrollmentService.getByGroupId(groupId);
        },
        enabled: !!groupId,
        select: (data: any) => data?.Value || data,
    });
};
