//@ts-ignore
import {API_URL} from 'astro:env/server'

export interface Review {
    id: string,
    author: string,
    text: string,
    created: string,
    title: string,
    title_en: string,
    uri: string,
    likes: number,
    dislikes: number
}

export function reviewsLoader(): any {
    const url = `${API_URL}/latest?limit=1000`;

    const reviews = fetch(url).then(res => res.json()).then(data => 
        data.filter((review : Review) => review.uri && (review.uri.startsWith('/posts')))
    );

    return {
        name: "reviews-loader",
        load: async () => {
            return {reviews}
        },
    };
}
