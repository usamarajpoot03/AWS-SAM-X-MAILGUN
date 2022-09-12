import { Signature } from './types';
import * as crypto from 'crypto';

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || '';

export const verifySignature = (signature: Signature): boolean => {
    const value = signature.timestamp + signature.token;
    const hash = crypto.createHmac('sha256', MAILGUN_API_KEY).update(value).digest('hex');
    if (hash !== signature.signature) {
        return false;
    }
    return true;
};
