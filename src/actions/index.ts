import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { API_URL, API_SECRET } from 'astro:env/server';

const apiUrl = API_URL;
const secret = API_SECRET;

// 统一的 headers 定义
const getHeaders = (contentType?: string) => {
    const headers: Record<string, string> = {
        'Authorization': `Bearer ${secret}`
    };
    
    if (contentType) {
        headers['Content-Type'] = contentType;
    } else {
        headers['accept'] = 'application/json';
    }
    
    return headers;
};

const getOptions = (method: string = 'GET', contentType?: string) => ({
    method,
    headers: getHeaders(contentType)
});

export const server = {
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



    createPlace: defineAction({
        input: z.object({
            name: z.string(),
            name_en: z.string(),
            type: z.string(),
            location: z.string(),
            coordinates: z.string(),
            rating: z.number(),
            visit_date: z.string(),
            description: z.string(),
            photos: z.string(),
            moments_id: z.string()
        }),
        handler: async (data) => {
            const response = await fetch(`${apiUrl}/places`, {
                ...getOptions('POST', 'application/json'),
                body: JSON.stringify(data)
            });
            return { status: response.status };
        }
    }),

    searchPOI: defineAction({
        input: z.object({
            keywords: z.string(),
            region: z.string().optional(),
            city: z.string().optional()
        }),
        handler: async ({ keywords, region, city }) => {
            const AMAP_KEY = import.meta.env.AMAP_KEY;
            const searchRegion = region || city || '天津';
            const url = `https://restapi.amap.com/v5/place/text?key=${AMAP_KEY}&keywords=${encodeURIComponent(keywords)}&region=${encodeURIComponent(searchRegion)}&show_fields=all`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === '1' && data.pois && data.pois.length > 0) {
                return data.pois.map((poi: any) => ({
                    id: poi.id,
                    name: poi.name,
                    address: poi.address,
                    location: poi.location,
                    tel: poi.tel,
                    type: poi.type,
                    business_area: poi.business_area,
                    rating: poi.rating,
                    cost: poi.cost,
                    photos: poi.photos
                }));
            }
            return [];
        }
    })
};

async function findEntityByImdbId(id: string) {
    const url = (lang: string) => `${apiUrl}/tmdb/3/find/${id}?external_source=imdb_id&language=${lang}`;
    
    const getResult = async (response: Response) => {
        const { movie_results, tv_results, tv_episode_results, tv_season_results } = await response.json();
        return movie_results[0] || tv_results[0] || tv_episode_results[0] || tv_season_results[0];
    };
    
    const zhResp = await fetch(url('zh'), getOptions());
    const enResp = await fetch(url('en'), getOptions());

    const zhResult = await getResult(zhResp);
    if (!zhResult) {
        return null;
    }
    
    let { title, name, media_type, vote_average, release_date, first_air_date } = zhResult;
    title = title || name;
    release_date = release_date || first_air_date;
    
    const enResult = await getResult(enResp);
    let { title: title_en, name: name_en } = enResult;
    title_en = title_en || name_en;
    
    title = title.replace(/'/g, "''");
    title_en = title_en.replace(/'/g, "''");

    return {
        imdb_id: id,
        title,
        title_en,
        media_type,
        imdb_rating: vote_average,
        rating: -1,
        release_date: release_date,
        rated_date: null
    };
}
