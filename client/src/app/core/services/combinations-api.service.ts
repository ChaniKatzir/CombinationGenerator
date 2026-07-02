import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../shared/models/api-response.model';

import {
  BrowseExitRequest,
  BrowsePageRequest,
  NextCombinationRequest,
  ResetCombinationRequest,
  StartCombinationRequest,
} from '../../features/combination-generator/models/requests';

import {
  BrowseExitResponse,
  BrowsePageResponse,
  NextCombinationResponse,
  ResetCombinationResponse,
  StartCombinationResponse,
} from '../../features/combination-generator/models/responses';

@Injectable({
  providedIn: 'root',
})
export class CombinationsApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://localhost:5001/api/combinations';

  start(
    request: StartCombinationRequest,
  ): Observable<ApiResponse<StartCombinationResponse>> {
    return this.http.post<ApiResponse<StartCombinationResponse>>(
      `${this.baseUrl}/start`,
      request,
    );
  }

  getNext(
    request: NextCombinationRequest,
  ): Observable<ApiResponse<NextCombinationResponse>> {
    return this.http.post<ApiResponse<NextCombinationResponse>>(
      `${this.baseUrl}/next`,
      request,
    );
  }

  getBrowsePage(
    request: BrowsePageRequest,
  ): Observable<ApiResponse<BrowsePageResponse>> {
    return this.http.post<ApiResponse<BrowsePageResponse>>(
      `${this.baseUrl}/browse/page`,
      request,
    );
  }

  exitBrowse(
    request: BrowseExitRequest,
  ): Observable<ApiResponse<BrowseExitResponse>> {
    return this.http.post<ApiResponse<BrowseExitResponse>>(
      `${this.baseUrl}/browse/exit`,
      request,
    );
  }

  reset(
    request: ResetCombinationRequest,
  ): Observable<ApiResponse<ResetCombinationResponse>> {
    return this.http.post<ApiResponse<ResetCombinationResponse>>(
      `${this.baseUrl}/reset`,
      request,
    );
  }
}