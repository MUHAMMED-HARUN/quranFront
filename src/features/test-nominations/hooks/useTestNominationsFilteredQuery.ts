import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { testNominationService } from "../services/testNominationService";
import { TestNominationsDtoFilter, TestNominationsDTOInfo } from "../types/testNomination.types";
import { TResult } from "../../../types/index";

export const useTestNominationsFilteredQuery = (
  filter: TestNominationsDtoFilter,
  options?: Omit<UseQueryOptions<TResult<TestNominationsDTOInfo[]>, Error, TResult<TestNominationsDTOInfo[]>, any>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ["testNominationsFilter", filter],
    queryFn: () => testNominationService.getFilteredItems(filter),
    ...options,
  });
};
