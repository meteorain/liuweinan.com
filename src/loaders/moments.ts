
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

    return {
        name: "moment-loader",
        load: async () => {
            try {
                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${API_SECRET}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status} ${res.statusText}`);
                }

                return await res.json();
            } catch (error) {
                throw new Error(`Failed to load moment: ${error instanceof Error ? error.message : String(error)}`);
            }
        },
    };
}

export function momentsLoader(page:number): any {
    const url = `${API_URL}/moments?page=${page}`;

    return {
        name: "moments-loader",
        load: async () => {
            try {
                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${API_SECRET}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status} ${res.statusText}`);
                }

                return await res.json();
            } catch (error) {
                throw new Error(`Failed to load moments: ${error instanceof Error ? error.message : String(error)}`);
            }
        },
    };
}


