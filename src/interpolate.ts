import {
  add,
  multiply,
  multiplyWithRealNumber,
  type Polynomial,
} from "./lib/polynomial";
import type { Point } from "./lib/point";
import { BigRational } from "big-rational-ts";

/**
 * Interpolate a polynomial that passes through the given points.
 *
 * @param points The points to interpolate.
 * @returns The polynomial that passes through the given points.
 */
export function interpolate(points: Point[]): Polynomial {
  const n = points.length;

  const adders: Polynomial[] = [];
  for (let i = 0; i < n; i++) {
    const yi = points[i].y;

    const multipliers: Polynomial[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        continue;
      }

      const xi = points[i].x;
      const xj = points[j].x;
      const denominator = new BigRational(1n, 1n).div(xi.subtract(xj));

      multipliers.push({
        coefficients: [
          new BigRational(-1n, 1n).mul(xj).mul(denominator),
          denominator,
        ],
      });
    }

    const polynomial = multipliers.reduce((acc, multiplier) => {
      return multiply(acc, multiplier);
    });

    const yiPolynomial = multiplyWithRealNumber(polynomial, yi);
    adders.push(yiPolynomial);
  }

  return adders.reduce((acc, adder) => {
    return add(acc, adder);
  });
}
