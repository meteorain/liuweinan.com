import {API_URL,API_SECRET} from 'astro:env/server'

export function reviewsLoader(page:number,media_type:string): any {
    const url = `${API_URL}/reviews?page=${page}&media_type=${media_type}`;

    const reviews = fetch(url, {
        headers: {
            'Authorization': `Bearer ${API_SECRET}`
        }
    }).then(res => res.json());

    return {
        name: "reviews-loader",
        load: async () => {
            return reviews
        },
    };
}

