import { describe, expect, it } from "vitest";
import { random } from ".";

describe("Node crypto shim", () => {
  it("should return a random value", () => {
    const key = random();
    console.log(key)
    expect(typeof key).toBe("string");
  });
});
