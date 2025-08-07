import { expect, test, describe } from "bun:test";
import { decode, encode } from "../src/secret-share";
import { print } from "../src/lib/polynomial";
import { print as printPoint } from "../src/lib/point";

describe("secret-share", () => {
  test("encode & decode", () => {
    const secret = "Hello!";
    const encoded = encode(secret);
    const decoded = decode(encoded);
    expect(decoded).toEqual(secret);
  });
});
