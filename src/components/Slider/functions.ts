export const getPercentage = (current: number, max: number): number =>
  (100 * current) / max;

export const getValue = (percentage: number, max: number): number =>
  (max / 100) * percentage;

export const getLeft = (percentage: number): string =>
  `calc(${percentage}% - 5px)`;
