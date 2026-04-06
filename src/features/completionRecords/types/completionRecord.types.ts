export enum EvaluationLevel {
    Excellent = 1,
    VeryGood = 2,
    Good = 3,
    Acceptable = 4,
    Weak = 5,
    VeryWeak = 6
}

export interface CompletionRecordDto {
    Id: string;
    StudentEnrollmentID: string;
    ScopeExecutionID: string;
    ScopeExecutionDetailID?: string;
    CompletionDate: string; // DateOnly -> string (YYYY-MM-DD)
    EvaluationLevel: EvaluationLevel;
    FinalScore?: number;
    Notes?: string;
}

export interface CreateCompletionRecordCommand {
    StudentEnrollmentID: string;
    ScopeExecutionID: string;
    ScopeExecutionDetailID?: string;
    CompletionDate: string;
    EvaluationLevel: EvaluationLevel;
    FinalScore?: number;
    Notes?: string;
}

export interface UpdateCompletionRecordCommand extends CreateCompletionRecordCommand {
    Id: string;
}
