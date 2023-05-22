import { BabyJub, Eddsa, buildBabyjub, buildEddsa } from "circomlibjs";
import { TPubKey, createPublicKey, rawPrivKeyToRawPubKey } from "./pubkey";
import { RawPrivKey, TPrivKey, createPrivateKey } from "./privkey";

type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type TKeypairBase = {
  rawPrivateKey: RawPrivKey;
};
export interface TKeypair extends TKeypairBase {
  publicKey: Prettify<TPubKey>;
  privateKey: Prettify<TPrivKey>;
  babyjub: Prettify<BabyJub>;
  eddsa: Prettify<Eddsa>;
}

export type TCreateKeypair = (props: TKeypairBase) => Promise<TKeypair>;

export const createKeyPair: TCreateKeypair = async ({
  rawPrivateKey,
}: TKeypairBase) => {
  const sk = await createPrivateKey({ rawPrivKey: rawPrivateKey });
  const pk = await createPublicKey({
    rawPubKey: await rawPrivKeyToRawPubKey(rawPrivateKey),
  });

  const [BabyJub, Eddsa] = await Promise.all([buildBabyjub(), buildEddsa()]);
  const providers = { BabyJub, Eddsa };
  return {
    rawPrivateKey,
    publicKey: pk,
    privateKey: sk,
    babyjub: providers.BabyJub,
    eddsa: providers.Eddsa,
    //               ^?
  } satisfies TKeypair;
};
