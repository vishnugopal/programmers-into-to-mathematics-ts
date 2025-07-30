import { expect, test, describe } from "bun:test";
import {
  multiplyWithRealNumber,
  divideByRealNumber,
  print,
  multiply,
  add,
} from "../../src/lib/polynomial";
import { BigRational } from "big-rational-ts";
import { toRational } from "../../src/lib/rational";

describe("polynomial", () => {
  test("print: simple", () => {
    const polynomial = {
      coefficients: [toRational(1), toRational(2), toRational(3)],
    };
    const result = print(polynomial);
    expect(result).toEqual("3x^2 + 2x + 1");
  });

  test("print: zero coefficient", () => {
    const polynomial = {
      coefficients: [toRational(0), toRational(2), toRational(3)],
    };
    const result = print(polynomial);
    expect(result).toEqual("3x^2 + 2x");
  });

  test("print: zero polynomial", () => {
    const polynomial = { coefficients: [toRational(0)] };
    const result = print(polynomial);
    expect(result).toEqual("0");
  });

  test("multiplyWithRealNumber", () => {
    const polynomial = {
      coefficients: [toRational(1), toRational(2), toRational(3)],
    };
    const result = multiplyWithRealNumber(polynomial, new BigRational(2n, 1n));
    expect(result).toEqual({
      coefficients: [toRational(2), toRational(4), toRational(6)],
    });
  });

  test("divideByRealNumber", () => {
    const polynomial = {
      coefficients: [toRational(2), toRational(4), toRational(6)],
    };
    const result = divideByRealNumber(polynomial, new BigRational(2n, 1n));
    expect(print(result)).toEqual("3x^2 + 2x + 1");
  });

  test("multiply", () => {
    const polynomial1 = {
      coefficients: [toRational(1), toRational(2), toRational(3)],
    };
    const polynomial2 = {
      coefficients: [toRational(4), toRational(5), toRational(6)],
    };
    const result = multiply(polynomial1, polynomial2);
    expect(print(result)).toEqual("18x^4 + 27x^3 + 28x^2 + 13x + 4");
  });

  test("add", () => {
    const polynomial1 = {
      coefficients: [toRational(1), toRational(2), toRational(3)],
    };
    const polynomial2 = {
      coefficients: [toRational(4), toRational(5), toRational(6)],
    };
    const result = add(polynomial1, polynomial2);
    expect(print(result)).toEqual("9x^2 + 7x + 5");
  });

  test("add: mixed degrees", () => {
    const polynomial1 = {
      coefficients: [toRational(1), toRational(2), toRational(3)],
    };
    const polynomial2 = {
      coefficients: [toRational(4), toRational(5)],
    };
    const result = add(polynomial1, polynomial2);
    expect(print(result)).toEqual("3x^2 + 7x + 5");
  });
});
