import { BabyJub, Eddsa, buildBabyjub, buildEddsa } from "circomlibjs";
import { bigInt2Buffer, buffer2BigInt, buffer2hex } from "./utils";

type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type RawPrivKey = bigint;
export type RawPubKey = bigint[];
export type SerializedPubKey = string;

// Private key to Raw Public key
export const rawPrivKeyToRawPubKey = async (rawPrivKey: RawPrivKey) => {
  const eddsa: Eddsa = await buildEddsa();
  const pk: RawPubKey = eddsa
    .prv2pub(bigInt2Buffer(rawPrivKey))
    .map((sk) => buffer2BigInt(sk));
  return pk
};

// Buffer to Raw Public Key
export const packedPointToRawPubKey = async (packedPoint: Buffer) => {
  const babyjub: BabyJub = await buildBabyjub();
  return babyjub.unpackPoint(packedPoint);
};
export const rawPubKeyToPackedPoint = async (rawPubKey: RawPubKey) => {
  const babyjub: BabyJub = await buildBabyjub();
  return babyjub.packPoint(rawPubKey.map((i) => bigInt2Buffer(i)));
};

// MACIPK to Raw Public Key
export const serializedPubKeyToRawPubKey = async (
  serializedPubKey: SerializedPubKey
) => {
  if (serializedPubKey === "macipk." + "z") {
    return [BigInt(0), BigInt(0)];
  }

  const len = "macipk.".length;
  const packed = Buffer.from(serializedPubKey.slice(len), "hex");
  const pk = await packedPointToRawPubKey(packed);
  return pk;
};
export const rawPubKeyToSerializedPubKey = async (rawPubKey: RawPubKey) => {
  if (
    BigInt(`${rawPubKey[0]}`) === BigInt(0) &&
    BigInt(`${rawPubKey[1]}`) === BigInt(0)
  ) {
    return "macipk." + "z";
  }
  const packed = await rawPubKeyToPackedPoint(rawPubKey);
  return "macipk." + buffer2hex(packed);
};

// Composable PubKey Object Factory
export type TPubKeyBase = { rawPubKey: RawPubKey };
export interface TPubKey extends TPubKeyBase {
  serialized: string;
  packedPoint: Buffer;
  contractParam?: {
    x: string;
    y: string;
  };
  circuitInputs?: [string, string];
}
export type TCreatePublicKey = (props: TPubKeyBase) => Promise<TPubKey>;
export const createPublicKey: TCreatePublicKey = async ({ rawPubKey }) => {
  const serialized = await rawPubKeyToSerializedPubKey(rawPubKey);
  const packedPoint = await rawPubKeyToPackedPoint(rawPubKey);
  return {
    rawPubKey,
    serialized,
    packedPoint,
  } as Prettify<TPubKey>;
};

