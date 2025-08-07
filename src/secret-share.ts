import type { BigRational } from "big-rational-ts";
import { interpolate } from "./interpolate";
import { evaluate, newPolynomialFromPairs, print } from "./lib/polynomial";
import { toRational, toSimpleString } from "./lib/rational";
import type { Point } from "./lib/point";

/**
 * Encode a secret into a polynomial.
 *
 * @param secret - The secret to encode.
 * @returns The encoded secret values.
 */
export function encode(secret: string): Point[] {
  // Beyond 6 characters, the coefficients will be too high
  // and interpolation will fail.
  if (secret.length > 6) {
    throw new Error("Secret must be at most 6 characters long");
  }

  const rationals = secret
    .split("")
    .map((char) => toRational(char.charCodeAt(0)));

  const polynomial = newPolynomialFromPairs(
    rationals.map((rational, index) => [rational, index])
  );

  const degree = rationals.length - 1;
  const secretValueCount = degree + 1;

  // Generate secretValueCount random rationals
  const randomRationals = Array.from({ length: secretValueCount }, () =>
    toRational(Math.floor(Math.random() * 100))
  );

  // Evaluate the polynomial at the random rationals
  const points = randomRationals.map((randomRational) => ({
    x: randomRational,
    y: evaluate(polynomial, randomRational),
  }));

  return points;
}

/**
 * Decode a secret from a list of secret values.
 *
 * @param secretValues - The secret values to decode.
 * @returns The decoded secret.
 */
export function decode(points: Point[]) {
  const polynomial = interpolate(points);

  const coefficients = polynomial.coefficients.map((coefficient) =>
    toSimpleString(coefficient.coefficient)
  );

  // convert coefficients back to characters
  const secret = coefficients.map((coefficient) =>
    String.fromCharCode(parseInt(coefficient))
  );

  return secret.join("");
}
