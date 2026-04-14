export interface StudentScopeRegisterUnionDto {
  Id: string;
  StudentEnrollmentID: string;
  StudentName: string;
  TargetName: string;
  Status: string;
  StartDate?: string | null;
  CompletionDate?: string | null;
  Notes?: string | null;
  ScopeID: string;
  Type: "ScopeExecution" | "ScopeExecutionDetail";
}

export interface CreateTestNominationDTO {
  StudentEnrollmentID: string;
  ScopeExecutionID?: string | null;
  ScopeExecutionDetailID?: string | null;
  NominationStatus: number;
  NominatedByPersonID?: string | null;
  SuggestedDate?: string | null;
}

export interface UpdateTestNominationDTO {
  Id: string;
  StudentEnrollmentID: string;
  ScopeExecutionID?: string | null;
  ScopeExecutionDetailID?: string | null;
  NominationStatus: number;
  NominatedByPersonID?: string | null;
  SuggestedDate?: string | null;
}

export interface TestNomination {
  Id: string;
  StudentEnrollmentID: string;
  ScopeExecutionID?: string | null;
  ScopeExecutionDetailID?: string | null;
  NominationStatus: number;
  NominatedByPersonID?: string | null;
  SuggestedDate?: string | null;
  // Additional properties added as needed from backend DTO
}

export interface TestNominationsDTOInfo {
  TestNominationID: string;
  StudentEnrollmentID?: string | null;
  NominatedByPersonID?: string | null;
  ScopeID?: string | null;
  ScopeType: string;
  TargetName: string;
  StudentName: string;
  NominatedByPersonName: string;
  NominationStatus: number;
  SuggestedDate?: string | null;
  NationalNumber: string;
}

export interface TestNominationsDtoFilter {
  TargetName?: string;
  StudentName?: string;
  SuggestedDateFrom?: string | null;
  SuggestedDateTo?: string | null;
  NominationStatus?: number | null;
  NationalNumber?: string;
  TestNominationID?: string | null;
}
