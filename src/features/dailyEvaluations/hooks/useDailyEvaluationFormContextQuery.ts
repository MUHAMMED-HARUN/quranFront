import { useQuery } from "@tanstack/react-query";
import { api } from "../../../core/api";

export interface DailyEvaluationFormContextDto {
    ScopeTo: number | null;
    ScopeFrom: number | null;
    LastEvaluationTo: number | null;
    NextFrom: number | null;
    ScopeExecutionDetailID: string | null;
    ScopeUnitTypeID: string | null;
}

export interface TResult<T> {
    isSuccess: boolean;
    value?: T;
    Value?: T;
    message?: string;
}

const fetchFormContext = async (studentEnrollmentId: string, matterId: string): Promise<TResult<DailyEvaluationFormContextDto>> => {
    return (await api.get(`/DailyEvaluations/form-context`, {
        params: { studentEnrollmentId, matterId }
    })) as unknown as TResult<DailyEvaluationFormContextDto>;
};

export const useDailyEvaluationFormContextQuery = (studentEnrollmentId: string | null, matterId: string | null) => {
    return useQuery({
        queryKey: ["dailyEvaluationFormContext", studentEnrollmentId, matterId],
        queryFn: () => fetchFormContext(studentEnrollmentId!, matterId!),
        enabled: !!studentEnrollmentId && !!matterId,
    });
};
