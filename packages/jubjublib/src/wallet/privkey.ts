import { buffer2BigInt } from "./utils";

type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type RawPrivKey = bigint;
// Private key to Raw Priv key
export type SerializedPrivKey = string;


// MACIPK to Raw Priv Key
export const serializedPrivKeyToRawPrivKey = async (
  serializedPrivKey: SerializedPrivKey
) => {
  if (serializedPrivKey === "macisk." + "z") {
    return BigInt(0);
  }

  const len = "macisk.".length;
  const sk = Buffer.from(serializedPrivKey.slice(len), "hex");
  return buffer2BigInt(sk);
};
export const rawPrivKeyToSerializedPrivKey = async (rawPrivKey: RawPrivKey) => {
  if (
    BigInt(`${rawPrivKey}`) === BigInt(0)  ) {
    return "macisk." + "z";
  }
  return "macisk." + rawPrivKey.toString(16);
};

// Composable PrivKey Object Factory
export type TPrivKeyBase = { rawPrivKey: RawPrivKey };
export interface TPrivKey extends TPrivKeyBase {
  serialized: string;
  circuitInput?: string;
}
export type TCreatePrivKey = (props: TPrivKeyBase) => Promise<TPrivKey>;
export const createPrivateKey: TCreatePrivKey = async ({ rawPrivKey }) => {
  const serialized = await rawPrivKeyToSerializedPrivKey(rawPrivKey);
  return {
    rawPrivKey,
    serialized,
  } as Prettify<TPrivKey>;
};

