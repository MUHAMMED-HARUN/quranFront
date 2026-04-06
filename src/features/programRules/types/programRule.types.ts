export enum ProgramRuleType {
    SingleSubject = 1,
    TotalScore = 2,
    AverageScore = 3,
    AttendancePercentage = 4,
    MaxAbsenceDays = 5
}

export enum ComparisonType {
    GreaterThanOrEqual = 1,
    Equal = 2,
    LessThanOrEqual = 3,
    GreaterThan = 4,
    LessThan = 5
}

export interface ProgramRuleDto {
    Id: string;
    ScopeExecutionID?: string | null;
    ScopeExecutionDetailID?: string | null;
    RuleType: ProgramRuleType;
    ComparisonType: ComparisonType;
    RequiredValue: number;
    IsMandatory: boolean;
    Notes?: string | null;
}

export interface CreateProgramRuleCommand {
    ScopeExecutionID?: string | null;
    ScopeExecutionDetailID?: string | null;
    RuleType: ProgramRuleType;
    ComparisonType: ComparisonType;
    RequiredValue: number;
    IsMandatory: boolean;
    Notes?: string | null;
}

export interface UpdateProgramRuleCommand extends CreateProgramRuleCommand {
    Id: string;
}
