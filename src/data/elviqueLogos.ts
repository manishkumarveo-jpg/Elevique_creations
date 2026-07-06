const EXCLUDE_LOGOS = [15, 24, 31, 47, 56];

export const ELVIQUE_LOGOS = Array.from(
  { length: 61 },
  (_, i) => i + 1
)
  .filter((num) => !EXCLUDE_LOGOS.includes(num))
  .map((num) => `/Elevique_logos/${num}.png`);

