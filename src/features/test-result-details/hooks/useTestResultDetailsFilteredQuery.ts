import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { testResultDetailService } from "../services/testResultDetailService";
import { TestResultDetailDTOInfoFilter, TestResultDetailDTOInfo } from "../types/testResultDetail.types";
import { TResult } from "../../../types/index";

export const useTestResultDetailsFilteredQuery = (
  filter: TestResultDetailDTOInfoFilter,
  options?: Omit<UseQueryOptions<TResult<TestResultDetailDTOInfo[]>, Error, TResult<TestResultDetailDTOInfo[]>, any>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ["testResultDetailsFilter", filter],
    queryFn: () => testResultDetailService.getFilteredItems(filter),
    ...options,
  });
};
