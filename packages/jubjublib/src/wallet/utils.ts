export const buffer2BigInt = (i: Buffer): bigint => {
    return leBuff2int(i);
};

export function leBuff2int(buff: Buffer) {
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

export function buffer2hex(buff:Buffer) {
    function i2hex(i:any) {
      return ('0' + i.toString(16)).slice(-2);
    }
    return Array.from(buff).map(i2hex).join('');
  }