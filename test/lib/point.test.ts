import { expect, test, describe } from "bun:test";
import { print } from "../../src/lib/point";
import { toRational } from "../../src/lib/rational";

describe("point", () => {
  test("print: simple", () => {
    const point = { x: toRational(1), y: toRational(2) };
    const result = print(point);
    expect(result).toEqual("(1, 2)");
  });
});
