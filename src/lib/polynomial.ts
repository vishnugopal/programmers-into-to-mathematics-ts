import { BigRational } from "big-rational-ts";
import { toRational, toSimpleString } from "./rational";

type Coefficient = BigRational;

export type Polynomial = {
  coefficients: Coefficient[];
};

/**
 * Describe a polynomial in a human-readable format.
 *
 * @param polynomial - The polynomial to describe.
 *
 * @example
 * print({ coefficients: [1, 2, 3] }) // "3x^2 + 2x + 1"
 * print({ coefficients: [0, 2, 3] }) // "3x^2 + 2x"
 * print({ coefficients: [0] }) // "0"
 */
export function print(polynomial: Polynomial): string {
  const degree = polynomial.coefficients.length - 1;

  if (degree === 0) {
    return toSimpleString(polynomial.coefficients[0]);
  }

  return (
    polynomial.coefficients
      .reverse()
      .map((coefficient, index) => {
        return coefficient.eq(toRational(0))
          ? ""
          : `${toSimpleString(coefficient)}x^${degree - index}`;
      })
      .join(" + ")
      // formatting tweaks
      .replace("+ -", "- ")
      .replace("x^0", "")
      .replace("x^1", "x")
      .replace(/ \+\s?$/, "")
      .replace(/\+\s*?\+/, "+")
      .replace(/ \/\s*?1x/g, "x")
      .replace(/\/ 1\s*?/, "")
      .trim()
  );
}

/**
 * Multiply a polynomial by a real number.
 *
 * @param polynomial - The polynomial to multiply.
 * @param number - The real number to multiply by.
 */
export function multiplyWithRealNumber(
  polynomial: Polynomial,
  number: BigRational
): Polynomial {
  return {
    coefficients: polynomial.coefficients.map((coefficient) =>
      coefficient.mul(number).reduce()
    ),
  };
}

/**
 * Divide a polynomial by a real number.
 *
 * @param polynomial - The polynomial to divide.
 * @param number - The real number to divide by.
 */
export function divideByRealNumber(
  polynomial: Polynomial,
  number: BigRational
): Polynomial {
  return {
    coefficients: polynomial.coefficients.map((coefficient) =>
      coefficient.div(number).reduce()
    ),
  };
}

/**
 * Multiply two polynomials.
 *
 * @param polynomial1 - The first polynomial to multiply.
 * @param polynomial2 - The second polynomial to multiply.
 */
export function multiply(
  polynomial1: Polynomial,
  polynomial2: Polynomial
): Polynomial {
  const degree1 = polynomial1.coefficients.length - 1;
  const degree2 = polynomial2.coefficients.length - 1;
  const degree = degree1 + degree2;

  const coefficients = new Array(degree + 1).fill(toRational(0));

  for (let i = 0; i <= degree1; i++) {
    for (let j = 0; j <= degree2; j++) {
      coefficients[i + j] = coefficients[i + j]
        .add(polynomial1.coefficients[i].mul(polynomial2.coefficients[j]))
        .reduce();
    }
  }

  return { coefficients };
}

/**
 * Add two polynomials.
 *
 * @param polynomial1 - The first polynomial to add.
 * @param polynomial2 - The second polynomial to add.
 */
export function add(
  polynomial1: Polynomial,
  polynomial2: Polynomial
): Polynomial {
  const degree1 = polynomial1.coefficients.length - 1;
  const degree2 = polynomial2.coefficients.length - 1;
  const degree = Math.max(degree1, degree2);

  const coefficients = new Array(degree + 1).fill(toRational(0));

  for (let i = 0; i <= degree; i++) {
    coefficients[i] = (polynomial1.coefficients[i] ?? toRational(0))
      .add(polynomial2.coefficients[i] ?? toRational(0))
      .reduce();
  }

  return { coefficients };
}
