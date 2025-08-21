// Shamir Secret Sharing over a 32-bit prime field using BigInt

// Largest 32-bit prime (fits in unsigned 32 bits)
const P = 4294967291n; // 2^32 - 5

type Share = { x: bigint; y: bigint };

// ----- Mod arithmetic -----
const mod = (a: bigint, p: bigint = P) => {
  const r = a % p;
  return r >= 0n ? r : r + p;
};

const addm = (a: bigint, b: bigint, p: bigint = P) => mod(a + b, p);
const subm = (a: bigint, b: bigint, p: bigint = P) => mod(a - b, p);
const mulm = (a: bigint, b: bigint, p: bigint = P) => mod(a * b, p);

// Extended Euclid for modular inverse (works because p is prime & a≠0 mod p)
function invm(a: bigint, p: bigint = P): bigint {
  let t = 0n,
    newT = 1n;
  let r = p,
    newR = mod(a, p);
  while (newR !== 0n) {
    const q = r / newR;
    [t, newT] = [newT, t - q * newT];
    [r, newR] = [newR, r - q * newR];
  }
  if (r !== 1n) throw new Error("No inverse (a ≡ 0 mod p)");
  return t < 0n ? t + p : t;
}

// Horner evaluation: f(x) given coeffs [a0, a1, ..., a_{k}]
function evalPoly(coeffs: bigint[], x: bigint, p: bigint = P): bigint {
  let y = 0n;
  for (let i = coeffs.length - 1; i >= 0; i--) {
    y = addm(mulm(y, x, p), coeffs[i], p);
  }
  return y;
}

// ----- Random coefficients (32-bit secure randomness) -----
function random32(): bigint {
  // Works in Node (crypto.randomBytes)
  // For Deno or browser, swap to crypto.getRandomValues(Uint32Array)
  const crypto = require?.("crypto");
  if (crypto?.randomBytes) {
    const buf = crypto.randomBytes(4);
    const v = BigInt(buf.readUInt32BE(0)); // 0..2^32-1
    return v;
  }
  // Fallback (NOT cryptographically secure)
  return BigInt((Math.random() * 2 ** 32) >>> 0);
}

// Rejection sampling to reduce bias when mapping to [0, p-1]
function randModP(p: bigint = P): bigint {
  const M = 1n << 32n; // 2^32
  const lim = M - (M % p); // largest multiple of p below 2^32
  while (true) {
    const v = random32(); // 0..2^32-1
    if (v < lim) return v % p;
  }
}

// ----- API -----
// Split: make n shares with threshold t for secret s (0 <= s < p)
export function split(
  secret: bigint,
  n: number,
  t: number,
  p: bigint = P,
): Share[] {
  if (!(0n <= secret && secret < p)) throw new Error("Secret out of range");
  if (t < 2 || t > n) throw new Error("Need 2 <= t <= n");
  // Random poly: a0=secret, a1..a_{t-1} random in [0,p)
  const coeffs: bigint[] = [mod(secret, p)];
  for (let i = 1; i < t; i++) coeffs.push(randModP(p));

  // x = 1..n (distinct, non-zero)
  const shares: Share[] = [];
  for (let x = 1n; shares.length < n; x++) {
    const y = evalPoly(coeffs, x, p);
    shares.push({ x, y });
  }
  return shares;
}

// Reconstruct secret from any t shares using Lagrange at x=0
export function reconstruct(shares: Share[], p: bigint = P): bigint {
  if (shares.length === 0) throw new Error("No shares provided");
  // Ensure distinct x's
  const seen = new Set<string>();
  for (const s of shares) {
    const k = s.x.toString();
    if (seen.has(k)) throw new Error("Duplicate x in shares");
    seen.add(k);
  }

  let secret = 0n;
  for (let i = 0; i < shares.length; i++) {
    const { x: xi, y: yi } = shares[i];
    // Li(0) = Π_{j≠i} (-xj)/(xi - xj)
    let num = 1n;
    let den = 1n;
    for (let j = 0; j < shares.length; j++) {
      if (j === i) continue;
      const xj = shares[j].x;
      num = mulm(num, mod(-xj, p), p); // multiply by (-xj)
      den = mulm(den, subm(xi, xj, p), p); // multiply by (xi - xj)
    }
    const li0 = mulm(num, invm(den, p), p);
    secret = addm(secret, mulm(yi, li0, p), p);
  }
  return secret; // f(0)
}

// ----- Demo -----
if (require?.main === module) {
  const s = 123456789n; // the secret (must be < P)
  const t = 3; // threshold
  const n = 5; // number of shares

  const shares = split(s, n, t);
  console.log("Shares:");
  for (const sh of shares)
    console.log({ x: sh.x.toString(), y: sh.y.toString() });

  // Pick any t shares to reconstruct:
  const picked = [shares[0], shares[2], shares[4]];
  const rec = reconstruct(picked);
  console.log("Reconstructed secret:", rec.toString()); // 123456789
}
