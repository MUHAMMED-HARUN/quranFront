import { api } from "../../../core/api";
import { TResult } from "../../../types/index";
import { CreateTestNominationDTO, UpdateTestNominationDTO, StudentScopeRegisterUnionDto, TestNominationsDTOInfo, TestNominationsDtoFilter } from "../types/testNomination.types";

export const testNominationService = {
  getScopeExecutionEnrollmentByEnrollmentStudent: async (
    enrollmentStudentId: string
  ): Promise<TResult<StudentScopeRegisterUnionDto[]>> => {
    const response = await api.get(
      `/ScopeEnrollments/ScopeExecutionUnionEnrollments/${enrollmentStudentId}`
    );
    return response as unknown as TResult<StudentScopeRegisterUnionDto[]>;
  },

  create: async (data: CreateTestNominationDTO): Promise<TResult<string>> => {
    const response = await api.post("/TestNominations", data);
    return response as unknown as TResult<string>;
  },

  update: async (data: UpdateTestNominationDTO): Promise<TResult<string>> => {
    const response = await api.put("/TestNominations", data);
    return response as unknown as TResult<string>;
  },

  getFilteredItems: async (filter: TestNominationsDtoFilter): Promise<TResult<TestNominationsDTOInfo[]>> => {
    const response = await api.post("/TestNominations/Filter", filter);
    return response as unknown as TResult<TestNominationsDTOInfo[]>;
  },
};
