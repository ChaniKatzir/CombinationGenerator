import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CombinationsApiService } from '../../../core/api/combinations-api.service';
import { CombinationGeneratorFacade } from './combination-generator.facade';

describe('CombinationGeneratorFacade', () => {
  let facade: CombinationGeneratorFacade;

  let api: {
    start: ReturnType<typeof vi.fn>;
    getNext: ReturnType<typeof vi.fn>;
    getBrowsePage: ReturnType<typeof vi.fn>;
    resizeBrowsePage: ReturnType<typeof vi.fn>;
    exitBrowse: ReturnType<typeof vi.fn>;
    reset: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    api = {
      start: vi.fn(),
      getNext: vi.fn(),
      getBrowsePage: vi.fn(),
      resizeBrowsePage: vi.fn(),
      exitBrowse: vi.fn(),
      reset: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CombinationGeneratorFacade,
        {
          provide: CombinationsApiService,
          useValue: api,
        },
      ],
    });

    facade = TestBed.inject(CombinationGeneratorFacade);
  });

  it('should start a session and store session data', () => {
    api.start.mockReturnValue(
      of({
        success: true,
        statusCode: 200,
        message: '',
        data: {
          sessionId: 'session-1',
          n: 3,
          totalPermutations: '6',
        },
      }),
    );

    facade.start(3);

    expect(api.start).toHaveBeenCalledWith({ n: 3 });
    expect(facade.sessionId()).toBe('session-1');
    expect(facade.n()).toBe(3);
    expect(facade.totalPermutations()).toBe('6');
    expect(facade.isSingleMode()).toBe(true);
    expect(facade.isLoading()).toBe(false);
  });

  it('should reject invalid n before calling the API', () => {
    facade.start(21);

    expect(api.start).not.toHaveBeenCalled();
    expect(facade.errorMessage()).toBe('Please enter a number between 1 and 20.');
  });

  it('should load next combination', () => {
    startSession();

    api.getNext.mockReturnValue(
      of({
        success: true,
        statusCode: 200,
        message: '',
        data: {
          index: '1',
          values: [1, 2, 3],
          hasMore: true,
          message: '',
        },
      }),
    );

    facade.getNext();

    expect(api.getNext).toHaveBeenCalledWith({ sessionId: 'session-1' });
    expect(facade.currentCombination()).toEqual({
      index: '1',
      values: [1, 2, 3],
      hasMore: true,
      message: '',
    });
    expect(facade.isSingleMode()).toBe(true);
  });

  it('should load browse page', () => {
    startSession();

    api.getBrowsePage.mockReturnValue(
      of({
        success: true,
        statusCode: 200,
        message: '',
        data: createBrowsePageResponse({
          pageNumber: '1',
          pageSize: 10,
          totalPermutations: '6',
          browseBaseIndex: '1',
          startIndex: '1',
          endIndex: '6',
          items: [
            { index: '1', values: [1, 2, 3] },
            { index: '2', values: [1, 3, 2] },
          ],
          hasMore: false,
        }),
      }),
    );

    facade.enterBrowse();

    expect(api.getBrowsePage).toHaveBeenCalledWith({
      sessionId: 'session-1',
      pageNumber: '1',
      pageSize: 10,
    });

    expect(facade.isBrowseMode()).toBe(true);
    expect(facade.currentPageNumber()).toBe(1);
    expect(facade.pageSize()).toBe(10);
    expect(facade.browsePage()?.items.length).toBe(2);
  });

  it('should resize browse page through the backend', () => {
    startSession();
    loadInitialBrowsePage();

    api.resizeBrowsePage.mockReturnValue(
      of({
        success: true,
        statusCode: 200,
        message: '',
        data: createBrowsePageResponse({
          pageNumber: '3',
          pageSize: 5,
          totalPermutations: '120',
          browseBaseIndex: '1',
          startIndex: '11',
          endIndex: '15',
          items: [{ index: '11', values: [1, 2, 3, 4, 5] }],
          hasMore: true,
        }),
      }),
    );

    facade.changePageSize(5);

    expect(api.resizeBrowsePage).toHaveBeenCalledWith({
      sessionId: 'session-1',
      pageSize: 5,
    });

    expect(facade.currentPageNumber()).toBe(3);
    expect(facade.pageSize()).toBe(5);
    expect(facade.browsePage()?.startIndex).toBe('11');
  });

  it('should go to previous page when current page is greater than one', () => {
    startSession();
    loadInitialBrowsePage('3');

    api.getBrowsePage.mockReturnValue(
      of({
        success: true,
        statusCode: 200,
        message: '',
        data: createBrowsePageResponse({
          pageNumber: '2',
          pageSize: 10,
          totalPermutations: '120',
          browseBaseIndex: '1',
          startIndex: '11',
          endIndex: '20',
          items: [{ index: '11', values: [1, 2, 3] }],
          hasMore: true,
        }),
      }),
    );

    facade.goToPreviousPage();

    expect(api.getBrowsePage).toHaveBeenCalledWith({
      sessionId: 'session-1',
      pageNumber: '2',
      pageSize: 10,
    });
  });

  it('should not go to previous page when current page is one', () => {
    startSession();
    loadInitialBrowsePage('1');

    api.getBrowsePage.mockClear();

    facade.goToPreviousPage();

    expect(api.getBrowsePage).not.toHaveBeenCalled();
  });

  it('should exit browse and show the last displayed combination', () => {
    startSession();
    loadInitialBrowsePage();

    api.exitBrowse.mockReturnValue(
      of({
        success: true,
        statusCode: 200,
        message: '',
        data: {
          index: '10',
          values: [3, 2, 1],
          hasMore: true,
          message: '',
        },
      }),
    );

    facade.exitBrowse();

    expect(api.exitBrowse).toHaveBeenCalledWith({ sessionId: 'session-1' });
    expect(facade.isSingleMode()).toBe(true);
    expect(facade.currentCombination()?.index).toBe('10');
    expect(facade.browsePage()).toBeNull();
  });

  it('should reset local state after server reset', () => {
    startSession();

    api.reset.mockReturnValue(
      of({
        success: true,
        statusCode: 200,
        message: '',
        data: true,
      }),
    );

    facade.reset();

    expect(api.reset).toHaveBeenCalledWith({ sessionId: 'session-1' });
    expect(facade.sessionId()).toBeNull();
    expect(facade.totalPermutations()).toBeNull();
    expect(facade.currentCombination()).toBeNull();
    expect(facade.browsePage()).toBeNull();
    expect(facade.isStartMode()).toBe(true);
  });

  it('should expose API error message', () => {
    api.start.mockReturnValue(
      throwError(() => ({
        status: 400,
        message: 'Invalid input.',
      })),
    );

    facade.start(3);

    expect(facade.errorMessage()).toBe('Invalid input.');
    expect(facade.isLoading()).toBe(false);
  });

  function startSession(): void {
    api.start.mockReturnValue(
      of({
        success: true,
        statusCode: 200,
        message: '',
        data: {
          sessionId: 'session-1',
          n: 3,
          totalPermutations: '6',
        },
      }),
    );

    facade.start(3);
  }

  function loadInitialBrowsePage(pageNumber = '1'): void {
    api.getBrowsePage.mockReturnValue(
      of({
        success: true,
        statusCode: 200,
        message: '',
        data: createBrowsePageResponse({
          pageNumber,
          pageSize: 10,
          totalPermutations: '120',
          browseBaseIndex: '1',
          startIndex: '1',
          endIndex: '10',
          items: [{ index: '1', values: [1, 2, 3] }],
          hasMore: true,
        }),
      }),
    );

    facade.enterBrowse();
  }

  function createBrowsePageResponse(overrides: {
    pageNumber: string;
    pageSize: number;
    totalPermutations: string;
    browseBaseIndex: string;
    startIndex: string;
    endIndex: string;
    items: { index: string; values: number[] }[];
    hasMore: boolean;
    message?: string;
  }) {
    return {
      ...overrides,
      message: overrides.message ?? '',
    };
  }
});