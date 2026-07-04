export function formatLargeNumber(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}