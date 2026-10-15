import { SignJWT, importPKCS8 } from 'jose';
import { API_JWT_PRIVATE_KEY, API_SECRET } from 'astro:env/server';

const JWT_ISS = 'yuhang.ch';
const JWT_AUD = 'api.yuhang.ch';
const JWT_TTL_SECONDS = 60;

/** Normalize PEM from env: quoted, real newlines, or `\n` / `\\n` escapes. */
export function normalizePem(pem: string): string {
    let s = pem.trim();
    if (
        (s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))
    ) {
        s = s.slice(1, -1);
    }
    // Collapse escape sequences until we have real PEM newlines.
    for (let i = 0; i < 3 && s.includes('\\n'); i++) {
        s = s.replace(/\\n/g, '\n');
    }
    return s.replace(/\r\n/g, '\n').trim();
}

export function requiredScope(method: string): 'read' | 'write' {
    const m = method.toUpperCase();
    return m === 'GET' || m === 'HEAD' || m === 'OPTIONS' ? 'read' : 'write';
}

let cachedKey: CryptoKey | null = null;
let cachedKeySource: string | null = null;

async function getPrivateKey(pem: string): Promise<CryptoKey> {
    if (cachedKey && cachedKeySource === pem) return cachedKey;
    cachedKey = await importPKCS8(normalizePem(pem), 'EdDSA');
    cachedKeySource = pem;
    return cachedKey;
}

export async function signApiJwt(scope: 'read' | 'write'): Promise<string> {
    if (!API_JWT_PRIVATE_KEY) {
        throw new Error('API_JWT_PRIVATE_KEY is not set');
    }
    const key = await getPrivateKey(API_JWT_PRIVATE_KEY);
    return new SignJWT({ scope })
        .setProtectedHeader({ alg: 'EdDSA' })
        .setIssuer(JWT_ISS)
        .setAudience(JWT_AUD)
        .setIssuedAt()
        .setExpirationTime(`${JWT_TTL_SECONDS}s`)
        .sign(key);
}

/** Prefer short-lived JWT; fall back to legacy static Bearer during cutover. */
export async function getApiAuthorizationHeader(method: string): Promise<string> {
    try {
        if (API_JWT_PRIVATE_KEY) {
            const jwt = await signApiJwt(requiredScope(method));
            return `Bearer ${jwt}`;
        }
    } catch (error) {
        console.error(
            'API JWT sign failed; falling back to API_SECRET if available',
            error instanceof Error ? error.message : error,
        );
    }

    if (API_SECRET) {
        return `Bearer ${API_SECRET}`;
    }

    throw new Error('No API auth configured (need API_JWT_PRIVATE_KEY or API_SECRET)');
}
