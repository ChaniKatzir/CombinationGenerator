export interface Combination {
  index: string;
  values: number[];
}

export interface CurrentCombination extends Combination {
  hasMore: boolean;
}

export type ViewMode = 'start' | 'single' | 'browse';

export const MIN_N = 1;
export const MAX_N = 20;
export const DEFAULT_PAGE_SIZE = 5;
export const FIRST_PAGE = 1;