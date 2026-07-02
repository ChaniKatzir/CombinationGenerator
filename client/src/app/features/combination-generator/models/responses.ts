import { Combination, CurrentCombination } from './combination.models';

export interface StartCombinationResponse {
  sessionId: string;
  n: number;
  totalPermutations: string;
}

export type NextCombinationResponse = CurrentCombination;

export interface BrowsePageResponse {
  pageNumber: string;
  pageSize: number;

  totalPermutations: string;

  browseBaseIndex: string;
  startIndex: string;
  endIndex: string;

  items: Combination[];

  hasMore: boolean;
  message: string;
}

export type BrowseExitResponse = CurrentCombination;

export type ResetCombinationResponse = boolean;