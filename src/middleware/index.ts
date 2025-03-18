import { defineMiddleware, sequence } from 'astro:middleware';
import { STUDIO_SECRET } from 'astro:env/server';

export const handleStudioAuth = defineMiddleware(async (context, next) => {
    try {
        if (
            new URL(context.request.url).pathname.startsWith('/studio') &&
            context.request.headers.get('authorization') !==
                `Basic ${STUDIO_SECRET}`
        ) {
            return new Response('Unauthorized', {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="YH Visible Realm"',
                },
            });
        }
        return await next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
});

export const onRequest = sequence(handleStudioAuth);
