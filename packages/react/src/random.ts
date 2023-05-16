import crypto from 'crypto';

export const random = ()=>crypto.randomBytes(32).toString('hex');

export default random;