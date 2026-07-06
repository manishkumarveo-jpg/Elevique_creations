const EXCLUDE_LOGOS = [2, 14, 15, 16, 18, 24, 29, 31, 38, 42, 47, 56, 58, 60];

export const ELVIQUE_LOGOS = Array.from(
  { length: 61 },
  (_, i) => i + 1
)
  .filter((num) => !EXCLUDE_LOGOS.includes(num))
  .map((num) => `/Elevique_logos/${num}.png`);

