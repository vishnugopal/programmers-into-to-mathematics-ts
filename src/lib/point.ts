import type { BigRational } from "big-rational-ts";
import { toSimpleString } from "./rational";

export type Point = {
  x: BigRational;
  y: BigRational;
};

/**
 * Describe a point in a human-readable format.
 *
 * @param point - The point to describe.
 */
export function print(point: Point): string {
  return `(${toSimpleString(point.x)}, ${toSimpleString(point.y)})`;
}
