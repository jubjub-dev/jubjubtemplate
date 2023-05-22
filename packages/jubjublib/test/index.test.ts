import { describe, expect, it } from "vitest";
import {
  random,
  genRandomBabyJubValue,
  PRIME_ORDER_SUBGROUP_SIZE,
} from "../src";
import {
  serializedPubKeyToRawPubKey,
  rawPrivKeyToRawPubKey,
} from "../src/wallet/pubkey";

describe("Node crypto shim", () => {
  it("should return a random value", () => {
    const key = random();
    console.log(key, "randopm");
    expect(typeof key).toBe("string");
  });
  it("should return a random jubjub value", async () => {
    const bbjj = genRandomBabyJubValue();
    console.log(("macisk." + bbjj.toString(16)).length);
    expect(typeof bbjj).toBe("bigint");
    let test = 0n;
    while (test < 0n) {
      const bbjj = genRandomBabyJubValue();
      console.log(("macisk." + bbjj.toString(16)).length);
      test = bbjj - PRIME_ORDER_SUBGROUP_SIZE;
      console.log("SUBGROUP SMALLER", test);
    }

    const sk = await serializedPubKeyToRawPubKey("macipk.z");
    const pk = await rawPrivKeyToRawPubKey(bbjj);
    console.log("nicer", pk);
  });
});
