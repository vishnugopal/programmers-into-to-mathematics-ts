import { expect, test, describe } from "bun:test";
import {
  multiplyWithRealNumber,
  divideByRealNumber,
  print,
  multiply,
  add,
  newPolynomialFromPairs,
  evaluate,
  evaluateHorner,
} from "../../src/lib/polynomial";
import { BigRational } from "big-rational-ts";
import { toRational, toSimpleString } from "../../src/lib/rational";

describe("polynomial", () => {
  test("print: simple", () => {
    const polynomial = newPolynomialFromPairs([
      [1, 0],
      [2, 1],
      [3, 2],
    ]);
    const result = print(polynomial);
    expect(result).toEqual("3x^2 + 2x + 1");
  });

  test("print: zero coefficient", () => {
    const polynomial = newPolynomialFromPairs([
      [0, 0],
      [2, 1],
      [3, 2],
    ]);
    const result = print(polynomial);
    expect(result).toEqual("3x^2 + 2x");
  });

  test("print: zero polynomial", () => {
    const polynomial = newPolynomialFromPairs([[0, 0]]);
    const result = print(polynomial);
    expect(result).toEqual("0");
  });

  test("multiplyWithRealNumber", () => {
    const polynomial = newPolynomialFromPairs([
      [1, 0],
      [2, 1],
      [3, 2],
    ]);
    const result = multiplyWithRealNumber(polynomial, toRational(2));
    expect(print(result)).toEqual("6x^2 + 4x + 2");
  });

  test("divideByRealNumber", () => {
    const polynomial = newPolynomialFromPairs([
      [2, 0],
      [4, 1],
      [6, 2],
    ]);
    const result = divideByRealNumber(polynomial, toRational(2));
    expect(print(result)).toEqual("3x^2 + 2x + 1");
  });

  test("multiply", () => {
    const polynomial1 = newPolynomialFromPairs([
      [1, 0],
      [2, 1],
      [3, 2],
    ]);
    const polynomial2 = newPolynomialFromPairs([
      [4, 0],
      [5, 1],
      [6, 2],
    ]);
    const result = multiply(polynomial1, polynomial2);
    expect(print(result)).toEqual("18x^4 + 27x^3 + 28x^2 + 13x + 4");
  });

  test("add", () => {
    const polynomial1 = newPolynomialFromPairs([
      [1, 0],
      [2, 1],
      [3, 2],
    ]);
    const polynomial2 = newPolynomialFromPairs([
      [4, 0],
      [5, 1],
      [6, 2],
    ]);
    const result = add(polynomial1, polynomial2);
    expect(print(result)).toEqual("9x^2 + 7x + 5");
  });

  test("add: mixed degrees", () => {
    const polynomial1 = newPolynomialFromPairs([
      [1, 0],
      [2, 1],
      [3, 2],
    ]);
    const polynomial2 = newPolynomialFromPairs([
      [4, 0],
      [5, 1],
    ]);
    const result = add(polynomial1, polynomial2);
    expect(print(result)).toEqual("3x^2 + 7x + 5");
  });

  test("evaluate", () => {
    const polynomial = newPolynomialFromPairs([
      [1, 0],
      [2, 1],
      [3, 2],
    ]);
    expect(print(polynomial)).toEqual("3x^2 + 2x + 1");
    const result = evaluate(polynomial, toRational(2));
    expect(toSimpleString(result)).toEqual("17");
  });

  test("evaluateWithHorner", () => {
    const polynomial = newPolynomialFromPairs([
      [1, 0],
      [2, 1],
      [3, 2],
    ]);
    expect(print(polynomial)).toEqual("3x^2 + 2x + 1");
    const result = evaluateHorner(polynomial, toRational(2));
    expect(toSimpleString(result)).toEqual("17");
  });

  test("evaluateWithHorner: larger degree", () => {
    const polynomial = newPolynomialFromPairs([
      [1, 0],
      [2, 1],
      [3, 2],
      [4, 5],
    ]);
    expect(print(polynomial)).toEqual("4x^5 + 3x^2 + 2x + 1");
    const result = evaluateHorner(polynomial, toRational(2));
    expect(toSimpleString(result)).toEqual("145");
  });
});
