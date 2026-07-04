import { DestroyRef, computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { CombinationsApiService } from '../../../core/api/combinations-api.service';
import { ApiResponse } from '../../../shared/models/api-response.model';
import {
  CurrentCombination,
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  MAX_N,
  MIN_N,
  ViewMode,
} from '../models/combination.models';
import {
  BrowsePageResponse,
  StartCombinationResponse,
} from '../models/responses';

const FIRST_PAGE_AS_STRING = String(FIRST_PAGE);

@Injectable()
export class CombinationGeneratorFacade {
  private readonly api = inject(CombinationsApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly viewMode = signal<ViewMode>('start');

  readonly sessionId = signal<string | null>(null);
  readonly n = signal<number | null>(null);
  readonly totalPermutations = signal<string | null>(null);

  readonly currentCombination = signal<CurrentCombination | null>(null);
  readonly browsePage = signal<BrowsePageResponse | null>(null);

  readonly pageSize = signal<number>(DEFAULT_PAGE_SIZE);
  readonly currentPageNumber = signal<string>(FIRST_PAGE_AS_STRING);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly infoMessage = signal<string | null>(null);

  readonly hasSession = computed(() => this.sessionId() !== null);

  readonly isStartMode = computed(() => this.viewMode() === 'start');
  readonly isSingleMode = computed(() => this.viewMode() === 'single');
  readonly isBrowseMode = computed(() => this.viewMode() === 'browse');

  readonly hasCurrentCombination = computed(
    () => this.currentCombination() !== null,
  );

  readonly hasBrowseItems = computed(
    () => (this.browsePage()?.items.length ?? 0) > 0,
  );

  readonly canGetNext = computed(
    () => this.hasSession() && !this.isLoading(),
  );

  readonly canReset = computed(
    () => this.hasSession() && !this.isLoading(),
  );

  readonly canEnterBrowse = computed(
    () => this.hasSession() && !this.isLoading(),
  );

  readonly canExitBrowse = computed(
    () => this.isBrowseMode() && this.hasSession() && !this.isLoading(),
  );

  readonly canGoToPreviousPage = computed(
    () =>
      this.isBrowseMode() &&
      this.isValidPositiveInteger(this.currentPageNumber()) &&
      BigInt(this.currentPageNumber()) > BigInt(FIRST_PAGE) &&
      !this.isLoading(),
  );

  readonly canGoToNextPage = computed(
    () =>
      this.isBrowseMode() &&
      (this.browsePage()?.hasMore ?? false) &&
      !this.isLoading(),
  );

  readonly canGoToLastPage = computed(
    () =>
      this.isBrowseMode() &&
      !!this.browsePage() &&
      !this.isLoading(),
  );

  start(n: number): void {
    this.clearMessages();

    if (!this.isValidN(n)) {
      this.errorMessage.set(`Please enter a number between ${MIN_N} and ${MAX_N}.`);
      return;
    }

    this.setLoading(true);

    this.api
      .start({ n })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.setLoading(false)),
      )
      .subscribe({
        next: (response) => {
          const data = this.extractData(response);
          if (!data) {
            return;
          }

          this.sessionId.set(data.sessionId);
          this.n.set(data.n);
          this.totalPermutations.set(data.totalPermutations);
          this.currentCombination.set(null);
          this.browsePage.set(null);
          this.currentPageNumber.set(FIRST_PAGE_AS_STRING);
          this.viewMode.set('single');
        },
        error: (error) => this.setGenericError(error),
      });
  }

  getNext(): void {
    const sessionId = this.requireSessionId();
    if (!sessionId) {
      return;
    }

    this.clearMessages();
    this.setLoading(true);

    this.api
      .getNext({ sessionId })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.setLoading(false)),
      )
      .subscribe({
        next: (response) => {
          const data = this.extractData(response);
          if (!data) {
            return;
          }

          this.currentCombination.set(data);
          this.browsePage.set(null);
          this.currentPageNumber.set(FIRST_PAGE_AS_STRING);
          this.viewMode.set('single');

          if (!data.hasMore) {
            this.infoMessage.set('No more combinations.');
          }
        },
        error: (error) => this.setGenericError(error),
      });
  }

  enterBrowse(): void {
    this.loadBrowsePage(FIRST_PAGE_AS_STRING);
  }

  loadBrowsePage(pageNumber: string | number | bigint): void {
    const sessionId = this.requireSessionId();
    if (!sessionId) {
      return;
    }

    const normalizedPageNumber = this.normalizePageNumber(pageNumber);

    if (!normalizedPageNumber) {
      this.errorMessage.set('Invalid page number.');
      return;
    }

    this.clearMessages();
    this.setLoading(true);

    this.api
      .getBrowsePage({
        sessionId,
        pageNumber: normalizedPageNumber,
        pageSize: this.pageSize(),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.setLoading(false)),
      )
      .subscribe({
        next: (response) => {
          const data = this.extractData(response);
          if (!data) {
            return;
          }

          this.browsePage.set(data);
          this.pageSize.set(data.pageSize);
          this.currentPageNumber.set(data.pageNumber);
          this.viewMode.set('browse');

          if (!data.hasMore) {
            this.infoMessage.set('No more combinations to display.');
          }
        },
        error: (error) => this.setGenericError(error),
      });
  }

  goToNextPage(): void {
    if (!this.canGoToNextPage()) {
      return;
    }

    const nextPage = BigInt(this.currentPageNumber()) + 1n;
    this.loadBrowsePage(nextPage.toString());
  }

  goToPreviousPage(): void {
    if (!this.canGoToPreviousPage()) {
      return;
    }

    const previousPage = BigInt(this.currentPageNumber()) - 1n;
    this.loadBrowsePage(previousPage.toString());
  }

  goToFirstPage(): void {
    this.loadBrowsePage(FIRST_PAGE_AS_STRING);
  }

  goToLastPage(): void {
    const page = this.browsePage();

    if (!page || this.isLoading()) {
      return;
    }

    this.loadBrowsePage(page.totalPages);
  }

  goToPage(pageNumber: string | number): void {
    this.loadBrowsePage(pageNumber);
  }

  changePageSize(pageSize: number): void {
    const sessionId = this.requireSessionId();

    if (!sessionId) {
      return;
    }

    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      this.errorMessage.set('Invalid page size.');
      return;
    }

    this.clearMessages();
    this.setLoading(true);

    this.api
      .resizeBrowsePage({
        sessionId,
        pageSize,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.setLoading(false)),
      )
      .subscribe({
        next: (response) => {
          const data = this.extractData(response);
          if (!data) {
            return;
          }

          this.browsePage.set(data);
          this.currentPageNumber.set(data.pageNumber);
          this.pageSize.set(data.pageSize);
          this.viewMode.set('browse');

          if (!data.hasMore) {
            this.infoMessage.set('No more combinations to display.');
          }
        },
        error: (error) => this.setGenericError(error),
      });
  }

  exitBrowse(): void {
    const sessionId = this.requireSessionId();
    if (!sessionId) {
      return;
    }

    this.clearMessages();
    this.setLoading(true);

    this.api
      .exitBrowse({ sessionId })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.setLoading(false)),
      )
      .subscribe({
        next: (response) => {
          const data = this.extractData(response);
          if (!data) {
            return;
          }

          this.currentCombination.set(data);
          this.browsePage.set(null);
          this.currentPageNumber.set(FIRST_PAGE_AS_STRING);
          this.viewMode.set('single');

          if (!data.hasMore) {
            this.infoMessage.set('No more combinations.');
          }
        },
        error: (error) => this.setGenericError(error),
      });
  }

  reset(): void {
    const sessionId = this.sessionId();

    if (!sessionId) {
      this.clearLocalState();
      return;
    }

    this.clearMessages();
    this.setLoading(true);

    this.api
      .reset({ sessionId })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.setLoading(false)),
      )
      .subscribe({
        next: (response) => {
          const data = this.extractData(response);
          if (data === null) {
            return;
          }

          this.clearLocalState();
        },
        error: (error) => this.setGenericError(error),
      });
  }

  clearError(): void {
    this.errorMessage.set(null);
  }

  clearInfo(): void {
    this.infoMessage.set(null);
  }

  private extractData<T>(response: ApiResponse<T>): T | null {
    if (!response.success) {
      this.errorMessage.set(response.message || 'The server returned an error.');
      return null;
    }

    return response.data;
  }

  private requireSessionId(): string | null {
    const sessionId = this.sessionId();

    if (!sessionId) {
      this.errorMessage.set('Please start a new session first.');
      return null;
    }

    return sessionId;
  }

  private isValidN(value: number): boolean {
    return Number.isInteger(value) && value >= MIN_N && value <= MAX_N;
  }

  private setLoading(value: boolean): void {
    this.isLoading.set(value);
  }

  private clearMessages(): void {
    this.errorMessage.set(null);
    this.infoMessage.set(null);
  }

  private setGenericError(error?: unknown): void {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error
    ) {
      this.errorMessage.set(String(error.message));
      return;
    }

    this.errorMessage.set('Something went wrong. Please try again.');
  }

  private normalizePageNumber(pageNumber: string | number | bigint): string | null {
    const value = String(pageNumber).trim();

    if (!this.isValidPositiveInteger(value)) {
      return null;
    }

    return value;
  }

  private isValidPositiveInteger(value: string): boolean {
    return /^[1-9]\d*$/.test(value);
  }

  private clearLocalState(): void {
    this.viewMode.set('start');
    this.sessionId.set(null);
    this.n.set(null);
    this.totalPermutations.set(null);
    this.currentCombination.set(null);
    this.browsePage.set(null);
    this.currentPageNumber.set(FIRST_PAGE_AS_STRING);
    this.pageSize.set(DEFAULT_PAGE_SIZE);
    this.errorMessage.set(null);
    this.infoMessage.set(null);
  }
}