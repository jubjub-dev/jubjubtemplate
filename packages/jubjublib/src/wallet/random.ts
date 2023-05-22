import crypto from "crypto";
import { Buffer } from "buffer";
import { BabyJub, Eddsa, buildBabyjub, buildEddsa } from "circomlibjs";

export function leBuff2int(buff: Uint8Array) {
  let res = BigInt(0);
  let i = 0;
  const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
  while (i < buff.length) {
    if (i + 4 <= buff.length) {
      res += BigInt(buffV.getUint32(i, true)) << BigInt(i * 8);
      i += 4;
    } else if (i + 2 <= buff.length) {
      res += BigInt(buffV.getUint16(i, true)) << BigInt(i * 8);
      i += 2;
    } else {
      res += BigInt(buffV.getUint8(i)) << BigInt(i * 8);
      i += 1;
    }
  }
  return res;
}

export const bigInt2Buffer = (i: bigint): Buffer => {
  return Buffer.from(i.toString(16), "hex");
};
export function buffer2array(buff: Uint8Array, sG: number) {
  const n = buff.byteLength / sG;
  const arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = buff.slice(i * sG, i * sG + sG);
  }
  return arr;
}

export const buffer2BigInt = (i: Uint8Array): bigint => {
  return leBuff2int(i);
};
const SERIALIZED_PUB_KEY_PREFIX = "macipk.";
type RawPrivKey = bigint;
export type RawPubKey = bigint[];
export type SerializedPubKey = string;

export type TPubKeyBase = {
  rawPubKey: RawPubKey;
};

interface TPubKey extends TPubKeyBase {
  serialize(): string;
  unserialize(s: SerializedPubKey): Promise<this>;
  packPubKey(): Uint8Array;
  unpackPubKey(packed: Uint8Array): RawPubKey;
  // copy(): TPubKey;
  // asContractParam(): {
  //   x: string;
  //   y: string;
  // };
  // asCircuitInputs(): [string, string];
  // asArray(): RawPubKey;
  // isValidSerializedPubKey(s: SerializedPubKey): boolean;
}
export type IPubKey = Prettify<TPubKey>;

/*
 * @param privKey A private key generated using genPrivKey()
 * @return A public key associated with the private key
 */
type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type TGeneratePublicKey = (privKey: RawPrivKey) => Promise<IPubKey>;
export const generatePublicKey: TGeneratePublicKey = async (
  privKey: RawPrivKey
): Promise<IPubKey> => {
  // Check whether privKey is a field element
  const eddsa: Eddsa = await buildEddsa();
  const pk: RawPubKey = eddsa
    .prv2pub(bigInt2Buffer(privKey))
    .map((sk) => buffer2BigInt(sk));
  return await PubKeyFactory({ rawPubKey: pk });
};

type TUnserializeProps = {
  babyjub: BabyJub;
  s: SerializedPubKey;
};
type TUnserialize = (props: TUnserializeProps) => RawPubKey;

export const unserialize: TUnserialize = ({
  babyjub,
  s,
}: TUnserializeProps) => {
  // Blank leaves have pubkey [0, 0], which packPubKey does not support
  if (s === SERIALIZED_PUB_KEY_PREFIX + "z") {
    return [BigInt(0), BigInt(0)];
  }

  const len = SERIALIZED_PUB_KEY_PREFIX.length;
  const packed = Buffer.from(s.slice(len), "hex");
  const pk = babyjub.unpackPoint(packed);
  return pk;
  //     ^?
};

type TSerializeProps = {
  babyjub: BabyJub;
  rawPubKey: RawPubKey;
};
type TSerialize = (props: TSerializeProps) => string;

function buff2hex(buff: Uint8Array) {
  function i2hex(i: any) {
    return ("0" + i.toString(16)).slice(-2);
  }
  return Array.from(buff).map(i2hex).join("");
}

const serialize: TSerialize = ({ babyjub, rawPubKey }: TSerializeProps) => {
  // Blank leaves have pubkey [0, 0], which packPubKey does not support
  if (
    BigInt(`${rawPubKey[0]}`) === BigInt(0) &&
    BigInt(`${rawPubKey[1]}`) === BigInt(0)
  ) {
    return SERIALIZED_PUB_KEY_PREFIX + "z";
  }
  const packed: Uint8Array = babyjub.packPoint(
    rawPubKey.map((i) => bigInt2Buffer(i))
  );
  return SERIALIZED_PUB_KEY_PREFIX + buff2hex(packed);
};

interface TPubKey extends TPubKeyBase {
  serialize(): string;
  unserialize(s: SerializedPubKey): Promise<this>;
  packPubKey(): Uint8Array;
  unpackPubKey(packed: Uint8Array): RawPubKey;
  // copy(): TPubKey;
  // asContractParam(): {
  //   x: string;
  //   y: string;
  // };
  // asCircuitInputs(): [string, string];
  // asArray(): RawPubKey;
  // isValidSerializedPubKey(s: SerializedPubKey): boolean;
}
export type TPubKeyProps = { rawPubKey: RawPubKey } | { rawPubKey: string };

type TPubKeyFactory = (props: TPubKeyProps) => Promise<IPubKey>;

const PubKeyFactory: TPubKeyFactory = async ({ rawPubKey }: TPubKeyProps) => {
  const babyjub: BabyJub = await buildBabyjub();
  const eddsa: Eddsa = await buildEddsa();
  const rpk =
    typeof rawPubKey == "string"
      ? unserialize({ s: rawPubKey, babyjub })
      : rawPubKey;
  //    ^?
  return {
    rawPubKey: rpk,
    async unserialize(s: string) {
      return await PubKeyFactory({ rawPubKey: unserialize({ s, babyjub }) });
    },
    serialize() {
      return serialize({ rawPubKey: this.rawPubKey, babyjub });
    },
    packPubKey() {
      return babyjub.packPoint(
        this.rawPubKey.map((point) => bigInt2Buffer(point))
      );
    },
    unpackPubKey(packed: Buffer) {
      return babyjub.unpackPoint(packed);
    },
  } as TPubKey;
};

export const random = () => "0x" + crypto.randomBytes(32).toString("hex");

export const SNARK_FIELD_SIZE: bigint = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);

export const PRIME_ORDER_SUBGROUP_SIZE: bigint = BigInt(
  "2736030358979909402780800718157159386076813972158567259200215660948447373041"
);

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

  const randomBabyJubValue: bigint = rand % PRIME_ORDER_SUBGROUP_SIZE;

  return randomBabyJubValue;
};

export default random;
