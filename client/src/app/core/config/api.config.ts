export const API_BASE_URL = 'https://localhost:7055/api';

export const API_ENDPOINTS = {
  combinations: {
    start: '/combinations/start',
    next: '/combinations/next',
    browsePage: '/combinations/browse/page',
    resizeBrowse: '/combinations/browse/resize',
    browseExit: '/combinations/browse/exit',
    reset: '/combinations/reset',
  },
} as const;