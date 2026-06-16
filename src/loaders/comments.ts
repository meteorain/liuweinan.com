import { API_URL } from 'astro:env/server'

export interface Comment {
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

// 从 Isso 拉取最新评论流，并按 uri 前缀过滤。
// moments 收 /posts + /moments，reviews 只收 /posts —— 传入对应的过滤函数即可。
export async function loadComments(uriFilter: (uri: string) => boolean): Promise<Comment[]> {
    const res = await fetch(`${API_URL}/latest?limit=1000`)
    const data: Comment[] = await res.json()
    return data.filter((c) => c.uri && uriFilter(c.uri))
}
