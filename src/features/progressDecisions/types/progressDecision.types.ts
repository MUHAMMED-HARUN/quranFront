export enum DecisionType {
    Pass = 1,
    Fail = 2,
    ConditionalPass = 3
}

export enum DecisionAuthority {
    System = 1,
    Principal = 2,
    Teacher = 3,
    Committee = 4
}

export interface ProgressDecisionDto {
    Id: string;
    StudentEnrollmentID: string;
    ScopeExecutionID: string;
    ScopeExecutionDetailID?: string;
    DecisionType: DecisionType;
    DecisionAuthority: DecisionAuthority;
    DecisionAuthorityId?: string;
    DecisionDate: string; // DateOnly maps to string usually "YYYY-MM-DD"
    Notes?: string;
}

export interface CreateProgressDecisionCommand {
    StudentEnrollmentID: string;
    ScopeExecutionID: string;
    ScopeExecutionDetailID?: string;
    DecisionType: DecisionType;
    DecisionAuthority: DecisionAuthority;
    DecisionAuthorityId?: string;
    DecisionDate: string;
    Notes?: string;
}

export interface UpdateProgressDecisionCommand extends CreateProgressDecisionCommand {
    Id: string;
}
