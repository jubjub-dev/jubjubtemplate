import crypto from "crypto";

export const random = () => "0x" + crypto.randomBytes(32).toString("hex");

export const SNARK_FIELD_SIZE: bigint =
  21888242871839275222246405745257275088548364400416034343698204186575808495617n;

export const PRIME_ORDER_SUBGROUP_SIZE: bigint =
  2736030358979909402780800718157159386076813972158567259200215660948447373041n;

export const genRandomBabyJubValue = (): bigint => {
  // Determine the byte size of the order
  const byteSize = (PRIME_ORDER_SUBGROUP_SIZE.toString(16).length + 1) >>> 1;

  let num: bigint;
  do {
    // Generate random bytes and convert them to a BigInt
    const buf = crypto.randomBytes(byteSize);
    num = BigInt("0x" + buf.toString("hex"));
    console.log("loop", ("macisk." + num.toString(16)).length);
    // Continue generating random numbers until we get one less than the order
  } while (num >= PRIME_ORDER_SUBGROUP_SIZE);
  console.log("last", ("macisk." + num.toString(16)).length);
  return num;
};

export const generate_random_number = () => {
  return genRandomBabyJubValue();
};
export default random;
