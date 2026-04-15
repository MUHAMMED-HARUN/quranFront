import { api } from "../../../core/api";
import { TResult } from "../../../types/index";
import { TestSessionDTOInfo, TestSessionDTOInfoFilter } from "../types/testSession.types";

export const testSessionService = {
  getFilteredItems: async (filter: TestSessionDTOInfoFilter): Promise<TResult<TestSessionDTOInfo[]>> => {
    const response = await api.post("/TestSessions/Filter", filter);
    return response as unknown as TResult<TestSessionDTOInfo[]>;
  },
};
