export interface StartCombinationRequest {
  n: number;
}

export interface SessionRequest {
  sessionId: string;
}

export interface BrowsePageRequest {
  sessionId: string;
  pageNumber: string;
  pageSize: number;
}

export type NextCombinationRequest = SessionRequest;

export type BrowseExitRequest = SessionRequest;

export type ResetCombinationRequest = SessionRequest;