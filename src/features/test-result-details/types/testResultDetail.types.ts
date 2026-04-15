export interface TestResultDetailDTOInfo {
  TestResultDetailID: string;
  TestSessionID: string;
  StudentName: string;
  ScopeID: string;
  ScopeType: string;
  TargetName: string;
  ActualExamDate: string;
  Score?: number;
  EvaluationLevel?: number;
  Notes: string;
}

export interface TestResultDetailDTOInfoFilter {
  TestResultDetailID?: string;
  TestSessionID?: string;
  StudentName?: string;
  ScopeID?: string;
  ScopeType?: string;
  TargetName?: string;
  ActualExamDateFrom?: string;
  ActualExamDateTo?: string;
  ScoreFrom?: number;
  ScoreTo?: number;
  EvaluationLevel?: number;
}
