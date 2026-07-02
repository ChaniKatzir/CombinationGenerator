import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
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
  private readonly baseUrl = API_BASE_URL;
  private readonly endpoints = API_ENDPOINTS.combinations;

  start(
    request: StartCombinationRequest,
  ): Observable<ApiResponse<StartCombinationResponse>> {
    return this.http.post<ApiResponse<StartCombinationResponse>>(
      `${this.baseUrl}${this.endpoints.start}`,
      request,
    );
  }

  getNext(
    request: NextCombinationRequest,
  ): Observable<ApiResponse<NextCombinationResponse>> {
    return this.http.post<ApiResponse<NextCombinationResponse>>(
      `${this.baseUrl}${this.endpoints.next}`,
      request,
    );
  }

  getBrowsePage(
    request: BrowsePageRequest,
  ): Observable<ApiResponse<BrowsePageResponse>> {
    return this.http.post<ApiResponse<BrowsePageResponse>>(
      `${this.baseUrl}${this.endpoints.browsePage}`,
      request,
    );
  }

  exitBrowse(
    request: BrowseExitRequest,
  ): Observable<ApiResponse<BrowseExitResponse>> {
    return this.http.post<ApiResponse<BrowseExitResponse>>(
      `${this.baseUrl}${this.endpoints.browseExit}`,
      request,
    );
  }

  reset(
    request: ResetCombinationRequest,
  ): Observable<ApiResponse<ResetCombinationResponse>> {
    return this.http.post<ApiResponse<ResetCombinationResponse>>(
      `${this.baseUrl}${this.endpoints.reset}`,
      request,
    );
  }
}