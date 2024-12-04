import { defineMiddleware, sequence } from 'astro:middleware';

import { STUDIO_SECRET } from 'astro:env/server';

export const handleStudioAuth = defineMiddleware(async (context: any, next) => {
    // check basic auth for route /studio
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
});

export const onRequest = sequence(handleStudioAuth);
