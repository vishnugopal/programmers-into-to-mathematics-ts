import { BigRational } from "big-rational-ts";
import { toRational, toSimpleString } from "./rational";

type Coefficient = BigRational;
type Position = number;

type CoefficientPositionPair = {
  coefficient: Coefficient;
  position: Position;
};

export type Polynomial = {
  coefficients: CoefficientPositionPair[];
};

/**
 * Create a polynomial from a list of pairs of coefficients and positions.
 *
 * @param pairs - The pairs of coefficients and positions.
 * @returns The polynomial.
 */
export function newPolynomialFromPairs(
  pairs: [number | bigint | BigRational, number][]
): Polynomial {
  return {
    coefficients: pairs.map(([coefficient, position]) => ({
      coefficient: toRational(coefficient),
      position,
    })),
  };
}

/**
 * Describe a polynomial in a human-readable format.
 *
 * @param polynomial - The polynomial to describe.
 *
 * @example
 * print({ coefficients: [[1, 0], [2, 1], [3, 2]] }) // "3x^2 + 2x + 1"
 * print({ coefficients: [[0, 0], [2, 1], [3, 2]] }) // "3x^2 + 2x"
 * print({ coefficients: [[0, 0]] }) // "0"
 */
export function print(polynomial: Polynomial): string {
  return (
    polynomial.coefficients
      .sort((a, b) => b.position - a.position)
      .map(({ coefficient, position }) => {
        return `${toSimpleString(coefficient)}x^${position}`;
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
      .replace(/\+ 0$/, "")
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
    coefficients: polynomial.coefficients.map(({ coefficient, position }) => ({
      coefficient: coefficient.mul(number).reduce(),
      position,
    })),
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
    coefficients: polynomial.coefficients.map(({ coefficient, position }) => ({
      coefficient: coefficient.div(number).reduce(),
      position,
    })),
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

  const coefficientsArray: BigRational[] = new Array(degree + 1).fill(
    toRational(0)
  );
  for (let i = 0; i <= degree; i++) {
    for (let j = 0; j <= degree; j++) {
      coefficientsArray[i + j] = (
        coefficientsArray[i + j] ?? toRational(0)
      ).add(
        (polynomial1.coefficients[i]?.coefficient ?? toRational(0)).mul(
          polynomial2.coefficients[j]?.coefficient ?? toRational(0)
        )
      );
    }
  }

  return {
    coefficients: coefficientsArray
      .filter((coefficient) => !coefficient.eq(toRational(0)))
      .map((coefficient, position) => ({
        coefficient,
        position,
      })),
  };
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

  const coefficientsArray: BigRational[] = new Array(degree + 1).fill(
    toRational(0)
  );

  for (let i = 0; i <= degree; i++) {
    coefficientsArray[i] = (
      polynomial1.coefficients[i]?.coefficient ?? toRational(0)
    )
      .add(polynomial2.coefficients[i]?.coefficient ?? toRational(0))
      .reduce();
  }

  return {
    coefficients: coefficientsArray
      .filter((coefficient) => !coefficient.eq(toRational(0)))
      .map((coefficient, position) => ({
        coefficient,
        position,
      })),
  };
}
