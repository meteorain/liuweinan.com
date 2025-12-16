
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
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${API_SECRET}`
                }
            });
            
            const contentType = res.headers.get('content-type') || '';
            const responseText = await res.text();
            
            if (!res.ok) {
                const error: any = new Error(`HTTP ${res.status} ${res.statusText}`);
                error.status = res.status;
                error.statusText = res.statusText;
                error.url = url;
                error.responseText = responseText;
                error.headers = Object.fromEntries(res.headers.entries());
                throw error;
            }
            
            if (!contentType.includes('application/json')) {
                const error: any = new Error(`Expected JSON but got ${contentType}`);
                error.status = res.status;
                error.statusText = res.statusText;
                error.url = url;
                error.contentType = contentType;
                error.responseText = responseText;
                error.headers = Object.fromEntries(res.headers.entries());
                throw error;
            }
            
            try {
                return JSON.parse(responseText);
            } catch (e: any) {
                const error: any = new Error(`Failed to parse JSON: ${e.message}`);
                error.status = res.status;
                error.statusText = res.statusText;
                error.url = url;
                error.contentType = contentType;
                error.responseText = responseText;
                error.headers = Object.fromEntries(res.headers.entries());
                error.parseError = e.message;
                throw error;
            }
        },
    };
}

export function momentsLoader(page:number): any {
    const url = `${API_URL}/moments?page=${page}`;

    return {
        name: "moments-loader",
        load: async () => {
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${API_SECRET}`
                }
            });
            
            const contentType = res.headers.get('content-type') || '';
            const responseText = await res.text();
            
            if (!res.ok) {
                const error: any = new Error(`HTTP ${res.status} ${res.statusText}`);
                error.status = res.status;
                error.statusText = res.statusText;
                error.url = url;
                error.responseText = responseText;
                error.headers = Object.fromEntries(res.headers.entries());
                throw error;
            }
            
            if (!contentType.includes('application/json')) {
                const error: any = new Error(`Expected JSON but got ${contentType}`);
                error.status = res.status;
                error.statusText = res.statusText;
                error.url = url;
                error.contentType = contentType;
                error.responseText = responseText;
                error.headers = Object.fromEntries(res.headers.entries());
                throw error;
            }
            
            try {
                return JSON.parse(responseText);
            } catch (e: any) {
                const error: any = new Error(`Failed to parse JSON: ${e.message}`);
                error.status = res.status;
                error.statusText = res.statusText;
                error.url = url;
                error.contentType = contentType;
                error.responseText = responseText;
                error.headers = Object.fromEntries(res.headers.entries());
                error.parseError = e.message;
                throw error;
            }
        },
    };
}


