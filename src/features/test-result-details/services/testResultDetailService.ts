import { api } from "../../../core/api";
import { TResult } from "../../../types/index";
import { TestResultDetailDTOInfo, TestResultDetailDTOInfoFilter } from "../types/testResultDetail.types";

export const testResultDetailService = {
  getFilteredItems: async (filter: TestResultDetailDTOInfoFilter): Promise<TResult<TestResultDetailDTOInfo[]>> => {
    const response = await api.post("/TestResultDetails/Filter", filter);
    return response as unknown as TResult<TestResultDetailDTOInfo[]>;
  },
};
