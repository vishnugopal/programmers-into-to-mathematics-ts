import { BigRational } from "big-rational-ts";

/**
 * Convert a BigRational to a simple string.
 *
 * @param rational - The BigRational to convert.
 * @returns The simple string representation of the BigRational.
 */
export function toSimpleString(rational: BigRational): string {
  const numerator = rational.getNumerator();
  const denominator = rational.getDenominator();

  if (denominator === 1n) {
    return numerator.toString();
  }

  if (denominator === -1n) {
    return `${-numerator.toString()}`;
  }

  if (numerator < 0n && denominator < 0n) {
    return `${-numerator.toString()}/${-denominator.toString()}`;
  }

  return `${numerator.toString()}/${denominator.toString()}`;
}

/**
 * Convert a number to a BigRational.
 *
 * @param number - The number to convert.
 * @returns The BigRational representation of the number.
 */
export function toRational(number: number | bigint | BigRational): BigRational {
  if (number instanceof BigRational) {
    return number;
  }

  return new BigRational(BigInt(number), 1n);
}
