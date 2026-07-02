import { DestroyRef, computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { CombinationsApiService } from '../../../core/api/combinations-api.service';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { CurrentCombination } from '../models/combination.models';
import {
  BrowsePageResponse,
  StartCombinationResponse,
} from '../models/responses';

type ViewMode = 'start' | 'single' | 'browse';

const MIN_N = 1;
const MAX_N = 20;
const DEFAULT_PAGE_SIZE = 5;
const FIRST_PAGE = 1;

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
  readonly currentPageNumber = signal<number>(FIRST_PAGE);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

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
    () => this.isBrowseMode() && this.currentPageNumber() > FIRST_PAGE && !this.isLoading(),
  );

  readonly canGoToNextPage = computed(
    () => this.isBrowseMode() && (this.browsePage()?.hasMore ?? false) && !this.isLoading(),
  );

  start(n: number): void {
    this.clearError();

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
          this.currentPageNumber.set(FIRST_PAGE);
          this.viewMode.set('single');
        },
        error: (error) => this.setGenericError(error)
      });
  }

  getNext(): void {
    const sessionId = this.requireSessionId();
    if (!sessionId) {
      return;
    }

    this.clearError();
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
          this.viewMode.set('single');

          if (!data.hasMore && data.message) {
            this.errorMessage.set(data.message);
          }
        },
        error: (error) => this.setGenericError(error)
      });
  }

  enterBrowse(): void {
    this.loadBrowsePage(FIRST_PAGE);
  }

  loadBrowsePage(pageNumber: number): void {
    const sessionId = this.requireSessionId();
    if (!sessionId) {
      return;
    }

    if (!Number.isInteger(pageNumber) || pageNumber < FIRST_PAGE) {
      this.errorMessage.set('Invalid page number.');
      return;
    }

    this.clearError();
    this.setLoading(true);

    this.api
      .getBrowsePage({
        sessionId,
        pageNumber: pageNumber.toString(),
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
          this.currentPageNumber.set(Number(data.pageNumber));
          this.viewMode.set('browse');

          if (!data.hasMore && data.message) {
            this.errorMessage.set(data.message);
          }
        },
        error: (error) => this.setGenericError(error),
      });
  }

  goToNextPage(): void {
    if (!this.canGoToNextPage()) {
      return;
    }

    this.loadBrowsePage(this.currentPageNumber() + 1);
  }

  goToPreviousPage(): void {
    if (!this.canGoToPreviousPage()) {
      return;
    }

    this.loadBrowsePage(this.currentPageNumber() - 1);
  }

  goToFirstPage(): void {
    this.loadBrowsePage(FIRST_PAGE);
  }

  goToLastPage(): void {
    const total = this.totalPermutations();

    if (!total) {
      return;
    }

    const lastPage = this.calculateLastPage(total, this.pageSize());
    this.loadBrowsePage(lastPage);
  }

  private calculateLastPage(totalPermutations: string, pageSize: number): number {
    const total = BigInt(totalPermutations);
    const size = BigInt(pageSize);

    const pages = total / size + (total % size === 0n ? 0n : 1n);

    const maxSafePage = BigInt(Number.MAX_SAFE_INTEGER);

    if (pages > maxSafePage) {
      return Number.MAX_SAFE_INTEGER;
    }

    return Number(pages);
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

    this.clearError();
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
          this.currentPageNumber.set(Number(data.pageNumber));
          this.pageSize.set(data.pageSize);
          this.viewMode.set('browse');
        },
        error: (error) => this.setGenericError(error),
      });
  }

  exitBrowse(): void {
    const sessionId = this.requireSessionId();
    if (!sessionId) {
      return;
    }

    this.clearError();
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
          this.viewMode.set('single');
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

    this.clearError();
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
      error: (error) => this.setGenericError(error)
      });
  }

  clearError(): void {
    this.errorMessage.set(null);
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

  private clearLocalState(): void {
    this.viewMode.set('start');
    this.sessionId.set(null);
    this.n.set(null);
    this.totalPermutations.set(null);
    this.currentCombination.set(null);
    this.browsePage.set(null);
    this.currentPageNumber.set(FIRST_PAGE);
    this.pageSize.set(DEFAULT_PAGE_SIZE);
    this.errorMessage.set(null);
  }
}