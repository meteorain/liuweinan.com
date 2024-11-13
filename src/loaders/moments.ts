
//@ts-ignore
import {API_URL} from 'astro:env/server'

export interface MomentsLoaderOptions {
    /** URL of the feed */
    pageIndex: number;
    pageSize: number;
    /** Extra options passed to the fetch request */
    requestOptions?: RequestInit;
}

export interface Moment {
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

export function momentsLoader(): any {
    const url = `${API_URL}/latest?limit=1000`;

    const moments = fetch(url).then(res => res.json()).then(data => 
        data.filter((moment: Moment) => moment.uri && (moment.uri.startsWith('/posts') || moment.uri.startsWith('/moments')))
    );

    return {
        name: "moments-loader",
        load: async () => {
            return {moments}
        },
    };
}


