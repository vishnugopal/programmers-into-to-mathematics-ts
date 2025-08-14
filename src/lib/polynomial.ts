import { BigRational } from "big-rational-ts";
import { pow, toRational, toSimpleString } from "./rational";

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
  pairs: [number | bigint | BigRational, number][],
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
 * Find a degree for the polynomial.
 *
 * @param polynomial - The polynomial to find the degree of.
 */
export function findDegree(polynomial: Polynomial): number {
  return Math.max(
    ...polynomial.coefficients.map((coefficient) => coefficient.position),
  );
}

/**
 * Find the coefficient at nth position for a polynomial
 */
export function findCoefficient(
  polynomial: Polynomial,
  position: number,
): Coefficient {
  return (
    polynomial.coefficients.find(
      (coefficient) => coefficient.position === position,
    )?.coefficient || toRational(0)
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
  number: BigRational,
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
  number: BigRational,
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
  polynomial2: Polynomial,
): Polynomial {
  const degree1 = findDegree(polynomial1);
  const degree2 = findDegree(polynomial2);
  const degree = degree1 + degree2;

  const coefficientsArray: BigRational[] = new Array(degree + 1).fill(
    toRational(0),
  );
  for (let i = 0; i <= degree; i++) {
    for (let j = 0; j <= degree; j++) {
      coefficientsArray[i + j] = (
        coefficientsArray[i + j] ?? toRational(0)
      ).add(
        (polynomial1.coefficients[i]?.coefficient ?? toRational(0)).mul(
          polynomial2.coefficients[j]?.coefficient ?? toRational(0),
        ),
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
  polynomial2: Polynomial,
): Polynomial {
  const degree1 = findDegree(polynomial1);
  const degree2 = findDegree(polynomial2);
  const degree = Math.max(degree1, degree2);

  const coefficientsArray: BigRational[] = new Array(degree + 1).fill(
    toRational(0),
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

/**
 * Evaluate a polynomial at a given x.
 *
 * @param polynomial - The polynomial to evaluate.
 * @param x - The x value to evaluate the polynomial at.
 */
export function evaluate(polynomial: Polynomial, x: BigRational): BigRational {
  return polynomial.coefficients.reduce((acc, { coefficient, position }) => {
    return acc.add(coefficient.mul(pow(x, BigInt(position))));
  }, toRational(0));
}

/**
 * Evaluate a polynomial at a given x using Euler's method.
 *
 * i.e. 4x^3 + 3x^2 + 2x + 1 = x ( x ( 4x+ 3) + 2x ) + 1
 *
 * @param polynomial - The polynomial to evaluate.
 * @param x - The x value to evaluate the polynomial at.
 * @returns The result of the polynomial evaluation.
 */
export function evaluateHorner(
  polynomial: Polynomial,
  x: BigRational,
): BigRational {
  const degree = findDegree(polynomial);

  const reverseCoefficients = Array(degree + 1)
    .fill(toRational(0))
    .map((_, i) => {
      return findCoefficient(polynomial, i);
    })
    .reverse();

  const result = reverseCoefficients
    // don't consider the first and the last coefficients (those have special treatment)
    .slice(1, -1)
    .reduce(
      (acc, coefficient) => {
        // add the coefficient to the accumulator and then multiply by x always
        return acc.add(coefficient).mul(x).reduce();
      },
      // the first coefficient is always multiplied by x
      reverseCoefficients[0].mul(x),
    )
    // now add the last coefficient without a multiplication
    .add(reverseCoefficients[degree]);

  return result;
}
