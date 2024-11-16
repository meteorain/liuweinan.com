//@ts-ignore
import {API_URL,API_SECRET} from 'astro:env/server'
export function reviewsLoader(page: number, media_type: string): any {
    const url = `${API_URL}/latest?limit=10`;

    return {
        name: "reviews-loader",
        load: async () => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                
                // 如果服务器返回的没有 next 和 prev，直接返回一个默认值
                const reviews = data;  // 直接把数据返回给 reviews

                // 假设没有分页，默认的上一页和下一页为 null
                const next = null;
                const prev = null;

                return { reviews, next, prev };
            } catch (error) {
                console.error('Error loading reviews:', error);
                return { reviews: [], next: null, prev: null }; // 错误时返回空数组和 null
            }
        },
    };
}
