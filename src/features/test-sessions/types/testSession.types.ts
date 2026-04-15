export interface TestSessionDTOInfo {
  TestSessionID: string;
  TestNominationID: string;
  StudentName: string;
  ScopeID: string;
  ScopeType: string;
  TargetName: string;
  SuggestedDate: string;
  ActualExamDate: string;
  TesterName: string;
  TesterType: string;
  TesterID: string;
  SessionStatus: number;
  Notes: string;
}

export interface TestSessionDTOInfoFilter {
  TestSessionID?: string;
  TestNominationID?: string;
  StudentName?: string;
  ScopeID?: string;
  ScopeType?: string;
  TargetName?: string;
  SuggestedDateFrom?: string;
  SuggestedDateTo?: string;
  ActualExamDateFrom?: string;
  ActualExamDateTo?: string;
  SessionStatus?: number;
}
