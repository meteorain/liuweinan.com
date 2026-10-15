import { SignJWT, importPKCS8 } from 'jose';
import { API_JWT_PRIVATE_KEY } from 'astro:env/server';

const JWT_ISS = 'yuhang.ch';
const JWT_AUD = 'api.yuhang.ch';
const JWT_TTL_SECONDS = 60;

function normalizePem(pem: string): string {
    return pem.replace(/\\n/g, '\n').trim();
}

export function requiredScope(method: string): 'read' | 'write' {
    const m = method.toUpperCase();
    return m === 'GET' || m === 'HEAD' || m === 'OPTIONS' ? 'read' : 'write';
}

let cachedKey: CryptoKey | null = null;

async function getPrivateKey(): Promise<CryptoKey> {
    if (cachedKey) return cachedKey;
    cachedKey = await importPKCS8(normalizePem(API_JWT_PRIVATE_KEY), 'EdDSA');
    return cachedKey;
}

export async function signApiJwt(scope: 'read' | 'write'): Promise<string> {
    const key = await getPrivateKey();
    return new SignJWT({ scope })
        .setProtectedHeader({ alg: 'EdDSA' })
        .setIssuer(JWT_ISS)
        .setAudience(JWT_AUD)
        .setIssuedAt()
        .setExpirationTime(`${JWT_TTL_SECONDS}s`)
        .sign(key);
}
