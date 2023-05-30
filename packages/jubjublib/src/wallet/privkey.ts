import { buffer2BigInt } from "./utils";

// Type Aliases
type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * @typedef {bigint} RawPrivKey - A raw private key represented as a BigInt.
 */
export type RawPrivKey = bigint;

/**
 * @typedef {string} SerializedPrivKey - A serialized private key represented as a string.
 */
export type SerializedPrivKey = string;

// Type Aliases and Interfaces for Private Key
/**
 * @typedef {Object} TPrivKeyBase
 * @property {RawPrivKey} rawPrivKey - The raw private key.
 */
export type TPrivKeyBase = { rawPrivKey: RawPrivKey };

/**
 * @typedef {Object} TPrivKey
 * @property {RawPrivKey} rawPrivKey - The raw private key.
 * @property {string} serialized - The serialized private key.
 * @property {string} [circuitInput] - Optional input for a circuit.
 */
export interface TPrivKey extends TPrivKeyBase {
  serialized: string;
  circuitInput?: string;
}

/**
 * @typedef {function} TCreatePrivKey
 * @param {TPrivKeyBase} props - The properties for creating the private key object.
 * @returns {Promise<TPrivKey>} - The private key object.
 */
export type TCreatePrivKey = (props: TPrivKeyBase) => Promise<TPrivKey>;

// Functions for Conversion between Raw and Serialized Private Key
/**
 * @async
 * @function
 * @param {SerializedPrivKey} serializedPrivKey - The serialized private key.
 * @returns {Promise<RawPrivKey>} - The raw private key.
 */
export const serializedPrivKeyToRawPrivKey = async (serializedPrivKey: SerializedPrivKey) => {
  if (serializedPrivKey === "macisk." + "z") {
    return BigInt(0);
  }

  const len = "macisk.".length;
  const sk = Buffer.from(serializedPrivKey.slice(len), "hex");
  return buffer2BigInt(sk);
};

/**
 * @async
 * @function
 * @param {RawPrivKey} rawPrivKey - The raw private key.
 * @returns {Promise<SerializedPrivKey>} - The serialized private key.
 */
export const rawPrivKeyToSerializedPrivKey = async (rawPrivKey: RawPrivKey) => {
  if (BigInt(`${rawPrivKey}`) === BigInt(0)) {
    return "macisk." + "z";
  }
  return "macisk." + rawPrivKey.toString(16);
};

// Function for Private Key Object Creation
/**
 * @async
 * @function
 * @param {TPrivKeyBase} props - An object with the base properties for creating the private key.
 * @returns {Promise<TPrivKey>} - The private key object.
 */
export const createPrivateKey: TCreatePrivKey = async ({ rawPrivKey }) => {
  const serialized = await rawPrivKeyToSerializedPrivKey(rawPrivKey);
  return {
    rawPrivKey,
    serialized
  } as Prettify<TPrivKey>;
};
