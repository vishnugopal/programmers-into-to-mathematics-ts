import { BigRational } from "big-rational-ts";

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

export function toRational(number: number): BigRational {
  return new BigRational(BigInt(number), 1n);
}
