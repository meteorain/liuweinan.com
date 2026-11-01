import {
    findEntity,
    findEntityByTMDBId,
    searchMedia,
} from './media';
import {
    createMoment,
    createReview,
    getMoment,
    updateMoment,
} from './content';
import { createPlace, searchPOI } from './places';

export const server = {
<<<<<<< HEAD
    searchMedia: defineAction({
        input: z.object({
            keyword: z.string()
        }),
        handler: async ({ keyword }) => {
            const url = `${apiUrl}/tmdb/3/search/multi?query=${keyword}&language=zh`;
            const response = await fetch(url, getOptions());
            const { results } = await response.json();
            
            if (results.length === 0) {
                return [];
            }
            
            return results.map(({id, release_date, first_air_date, title, name, media_type}) => ({
                id,
                release_date,
                first_air_date,
                title,
                name,
                media_type
            }));
        }
    }),

    findEntityByTMDBId: defineAction({
        input: z.object({
            id: z.string(),
            type: z.string()
        }),
        handler: async ({ id, type }) => {
            const url = `${apiUrl}/tmdb/3/${type}/${id}/external_ids?language=zh`;
            const response = await fetch(url, getOptions());
            const { imdb_id } = await response.json();
            
            if (imdb_id) {
                return await findEntityByImdbId(imdb_id);
            }
            return null;
        }
    }),

    findEntity: defineAction({
        input: z.object({
            imdb_id: z.string()
        }),
        handler: async ({ imdb_id }) => {
            return await findEntityByImdbId(imdb_id);
        }
    }),

    createMoment: defineAction({
        input: z.object({
            tags: z.string(),
            body: z.string()
        }),
        handler: async ({ tags, body }) => {
            const response = await fetch(`${apiUrl}/moments`, {
                ...getOptions('POST', 'application/json'),
                body: JSON.stringify({ tags, body })
            });
            return await response.text();
        }
    }),

    createReview: defineAction({
        input: z.object({
            moments_id: z.string(),
            imdb_id: z.string(),
            imdb_rating: z.number().nullable(),
            rated_date: z.string(),
            release_date: z.string().nullable(),
            title: z.string(),
            title_en: z.string(),
            media_type: z.string(),
            rating: z.string(),
            content: z.string()
        }),
        handler: async (reviewData) => {
            const response = await fetch(`${apiUrl}/reviews`, {
                ...getOptions('POST', 'application/json'),
                body: JSON.stringify(reviewData)
            });
            return { status: response.status };
        }
    }),

    getMoment: defineAction({
        input: z.object({
            id: z.string()
        }),
        handler: async ({ id }) => {
            const response = await fetch(`${apiUrl}/moments/${id}`, getOptions('GET', 'application/json'));
            
            if (response.status === 200) {
                return await response.json();
            }
            return null;
        }
    }),

    updateMoment: defineAction({
        input: z.object({
            id: z.string(),
            tags: z.string(),
            body: z.string()
        }),
        handler: async ({ id, tags, body }) => {
            const response = await fetch(`${apiUrl}/moments/${id}`, {
                ...getOptions('POST', 'application/json'),
                body: JSON.stringify({ tags, body })
            });
            return { status: response.status, text: await response.text() };
        }
    }),
=======
    searchMedia,
    findEntityByTMDBId,
    findEntity,
    createMoment,
    createReview,
    getMoment,
    updateMoment,
    createPlace,
    searchPOI,
>>>>>>> upstream/main
};
