import crypto from "crypto";

export const random = () => "0x" + crypto.randomBytes(32).toString("hex");

export const SNARK_FIELD_SIZE: bigint = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

export const PRIME_ORDER_SUBGROUP_SIZE: bigint = 21888242871839275222246405745257275088548364400416034343698204186575808495617n/8n;

export const genRandomBabyJubValue = (): bigint => {
  // Prevent modulo bias
  //const lim = BigInt('0x10000000000000000000000000000000000000000000000000000000000000000')
  //const min = (lim - SNARK_FIELD_SIZE) % SNARK_FIELD_SIZE
  const min = BigInt(
    "6350874878119819312338956282401532410528162663560392320966563075034087161851"
  );

  let rand;
  while (true) {
    rand = BigInt("0x" + crypto.randomBytes(32).toString("hex"));

    if (rand >= min) {
      break;
    }
  }

  const randomBabyJubValue: bigint = rand % SNARK_FIELD_SIZE;

  return randomBabyJubValue;
};

export default random;
