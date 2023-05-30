/**
 * This function accepts a buffer object and converts it to a bigint.
 *
 * @function buffer2BigInt
 * @param {Buffer} i - The buffer object to be converted.
 * @returns {bigint} - The resulting bigint.
 */
export const buffer2BigInt = (i: Buffer): bigint => {
    // Use the leBuff2int helper function to convert buffer to bigint
    return leBuff2int(i);
};

/**
 * This function accepts a buffer and converts it to a bigint by
 * interpreting the buffer as little-endian.
 *
 * @function leBuff2int
 * @param {Buffer} buff - The buffer object to be converted.
 * @returns {bigint} - The resulting bigint.
 */
export function leBuff2int(buff: Buffer) {
    // Initialize a bigint as 0 to store the result
    let res = BigInt(0);

    // Initialize a counter variable to traverse the buffer
    let i = 0;

    // Create a DataView object from the buffer for easier data manipulation
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);

    // Iterate over the buffer
    while (i < buff.length) {
        if (i + 4 <= buff.length) { 
            // If there are at least 4 bytes left, interpret them as a Uint32
            res += BigInt(buffV.getUint32(i, true)) << BigInt(i * 8);
            // Move to the next 4-byte block
            i += 4;
        } else if (i + 2 <= buff.length) {
            // If there are at least 2 bytes left, interpret them as a Uint16
            res += BigInt(buffV.getUint16(i, true)) << BigInt(i * 8);
            // Move to the next 2-byte block
            i += 2;
        } else {
            // If there is only 1 byte left, interpret it as a Uint8
            res += BigInt(buffV.getUint8(i)) << BigInt(i * 8);
            // Move to the next byte
            i += 1;
        }
    }
    // Return the resulting bigint
    return res;
}

/**
 * This function accepts a bigint and converts it to a buffer.
 *
 * @function bigInt2Buffer
 * @param {bigint} i - The bigint to be converted.
 * @returns {Buffer} - The resulting buffer.
 */
export const bigInt2Buffer = (i: bigint): Buffer => {
    // Use the Buffer.from method to create a buffer from the bigint's hexadecimal string representation
    return Buffer.from(i.toString(16), "hex");
};

/**
 * @typedef {Object} Uint8Array - An array-like object that holds 8-bit unsigned integers.
 */

/**
 * This function accepts a Uint8Array and converts it to a hexadecimal string.
 *
 * @function buffer2hex
 * @param {Uint8Array} buff - The Uint8Array to be converted.
 * @returns {string} - The resulting hexadecimal string.
 */
export function buffer2hex(buff:Uint8Array) {
    /**
     * This helper function accepts an integer and converts it to a hexadecimal string,
     * ensuring that it has at least two characters by prefixing a '0' if necessary.
     *
     * @function i2hex
     * @param {number} i - The integer to be converted.
     * @returns {string} - The resulting hexadecimal string.
     */
    function i2hex(i:any) {
      return ('0' + i.toString(16)).slice(-2);
    }
    // Use the Array.from method to convert the Uint8Array to an array, then map each element to its hexadecimal string representation
    return Array.from(buff).map(i2hex).join('');
}
