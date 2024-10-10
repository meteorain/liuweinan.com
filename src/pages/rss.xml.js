import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import MarkdownIt from 'markdown-it'
export const prerender = true;

const parser = new MarkdownIt()

export async function GET({ params }) {
    const blog = await getCollection('posts',(i)=>i.data.title && !i.data.isDraft && i.data.pubDate)
    const posts = blog
        .sort((a, b) => (a.data.pubDate < b.data.pubDate ? 1 : -1))
        .map((post) => {
            const content = post.description || post.body
            const html = parser.render(content)
            return {
                ...post.data,
                link: `/posts/${post.slug}/`,
                pubDate: post.data.pubDate,

                content: html
            }
        })
    return new Response(
        (
            await rss({
                title: '陈昱行博客',
                description: '在没人看到的地方写写画画',
                site: 'https://yuhang.ch',
                items: posts,
            })
        ).body,
        {
            headers: {
                'content-type': 'application/xml'
            }
        }
    )
}