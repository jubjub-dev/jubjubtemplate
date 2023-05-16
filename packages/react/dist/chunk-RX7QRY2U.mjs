// src/random.ts
import crypto from "crypto";
var random = () => crypto.randomBytes(32).toString("hex");
var random_default = random;

export {
  random,
  random_default
};
