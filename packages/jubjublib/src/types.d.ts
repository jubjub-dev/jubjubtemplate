type Prettify<T> = { [K in keyof T]: T[K] } & {};

declare module 'circomlibjs' {
  type poseidonOpt = {};
  export interface BabyJub {
    addPoint: (a: [bigint, bigint], b: [bigint, bigint]) => [bigint, bigint];
    mulPointEscalar: (base: [bigint, bigint], e: bigint) => [bigint, bigint];
    inSubgroup: (P: [bigint, bigint]) => boolean;
    inCurve: (P: [bigint, bigint]) => boolean;
    packPoint: (P: Buffer[]) => Buffer;
    unpackPoint: (buff: Buffer) => [bigint, bigint];
  }
  export interface Eddsa {
    pruneBuffer: (buff: Buffer) => Buffer;
    prv2pub: (prv: Buffer) => [Buffer, Buffer];
    signPedersen: (prv: any, msg: any) => {
        R8: any;
        S: any;
    };
    signMiMC: (prv: any, msg: any) => {
        R8: any;
        S: any;
    };
    signMiMCSponge(prv: any, msg: any): {
        R8: any;
        S: any;
    };
    signPoseidon(prv: any, msg: any): {
        R8: any;
        S: any;
    };
    verifyPedersen(msg: any, sig: any, A: any): boolean;
    verifyMiMC(msg: any, sig: any, A: any): boolean;
    verifyPoseidon(msg: any, sig: any, A: any): boolean;
    verifyMiMCSponge(msg: any, sig: any, A: any): boolean;
    packSignature(sig: any): Buffer;
    unpackSignature(sigBuff: any): {
        R8: any;
        S: any;
    }
}
  export function buildBabyjub(): Promise<Prettify<BabyJub>>;
  export function buildEddsa(): Promise<Prettify<Eddsa>>;
  export function buildPoseidonOpt(): Promise<poseidonOpt>;
}

type buildBabyJub = () => Promise<BabyJub>;

