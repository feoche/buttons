/** Deterministic color vars for buttons, seeded by title. */

function seededRandom(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647), (s - 1) / 2147483646);
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function hsl(h: number, s: number, l: number) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function getButtonColorVars(title: string): React.CSSProperties {
  const rand = seededRandom(hashString(title));
  const h = Math.floor(rand() * 360);
  const s = 40 + Math.floor(rand() * 45);
  const l = 45 + Math.floor(rand() * 25);

  return {
    "--btn-color":   hsl(h, s, l),
    "--btn-lighter": hsl(h, s, Math.min(100, l + 45)),
    "--btn-light":   hsl(h, s, Math.min(100, l + 35)),
    "--btn-dark":    hsl(h, s, Math.max(0,   l - 18)),
    "--btn-darker":  hsl(h, s, Math.max(0,   l - 10)),
  } as React.CSSProperties;
}
