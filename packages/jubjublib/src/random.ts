import crypto from 'crypto';

export const random = ()=>"0x"+crypto.randomBytes(32).toString('hex');

export default random;