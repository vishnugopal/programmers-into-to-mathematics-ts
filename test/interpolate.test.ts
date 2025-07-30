import { expect, test, describe } from "bun:test";
import { interpolate } from "../src/interpolate";
import { toRational } from "../src/lib/rational";

import { print } from "../src/lib/polynomial";

describe("interpolate", () => {
  test("simple", () => {
    const points = [
      { x: toRational(1), y: toRational(3) },
      { x: toRational(4), y: toRational(9) },
    ];
    const result = interpolate(points);
    expect(print(result)).toEqual("2x + 1");
  });

  test("fractions", () => {
    const points = [
      { x: toRational(2), y: toRational(3) },
      { x: toRational(7), y: toRational(4) },
    ];
    const result = interpolate(points);
    expect(print(result)).toEqual("1/5x + 13/5");
  });
});
