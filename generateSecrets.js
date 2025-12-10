import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS = crypto.randomBytes(64).toString('hex')
const REFRESH = crypto.randomBytes(64).toString('hex')
console.log('ACCESS_TOKEN_SECRET=' + ACCESS);
console.log('REFRESH_SECRET=' + REFRESH);
