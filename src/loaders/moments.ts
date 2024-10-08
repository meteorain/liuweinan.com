
//@ts-ignore
import {API_URL,API_SECRET} from 'astro:env/server'

export interface MomentsLoaderOptions {
    /** URL of the feed */
    pageIndex: number;
    pageSize: number;
    /** Extra options passed to the fetch request */
    requestOptions?: RequestInit;
}

export interface MomentLoaderOptions {
    /** URL of the feed */
    id: string;
    /** Extra options passed to the fetch request */
    requestOptions?: RequestInit;
}

export interface Moment {
    id: string;
    body: string;
    date: string;
    location: string;
    image: string;
    tags: string[];
}

export function momentLoader(id:string): any {
    const url = `${API_URL}/moments/${id}`;
    const moment = fetch(url, {
        headers: {
            'Authorization': `Bearer ${API_SECRET}`
        }
    }).then(res => res.json());


    return {
        name: "moment-loader",
        load: async () => {
            return moment
        },
    };
}

export function momentsLoader(page:number): any {
    const url = `${API_URL}/moments?page=${page}`;

    const moments = fetch(url, {
        headers: {
            'Authorization': `Bearer ${API_SECRET}`
        }
    }).then(res => res.json());

    console.log(moments)

    return {
        name: "moments-loader",
        load: async () => {
            return moments
        },
    };
}


