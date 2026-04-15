import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { testSessionService } from "../services/testSessionService";
import { TestSessionDTOInfoFilter, TestSessionDTOInfo } from "../types/testSession.types";
import { TResult } from "../../../types/index";

export const useTestSessionsFilteredQuery = (
  filter: TestSessionDTOInfoFilter,
  options?: Omit<UseQueryOptions<TResult<TestSessionDTOInfo[]>, Error, TResult<TestSessionDTOInfo[]>, any>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ["testSessionsFilter", filter],
    queryFn: () => testSessionService.getFilteredItems(filter),
    ...options,
  });
};
