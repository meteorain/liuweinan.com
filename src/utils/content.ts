import {getCollection} from "astro:content";
import groupBy from "lodash/groupBy";
import keys from "lodash/keys";
import {DateTime} from "luxon";

export const getAllPosts = async (locale: string, tag: string, category: string) => {
    const allPosts = await getCollection('posts')
    const filteredPosts = allPosts
        .map( i=>({
            ...i.data,
            url : `/posts/${i.slug}/`
        }))
        .filter((d) => {
            if (!d) return false
            if (tag) {
                return d.pubDate && !d.isDraft && d.tags && d.tags.includes(tag)
            } else if (category) {
                return d.pubDate && !d.isDraft && d.categories && d.categories.includes(category)
            }
            return !d.isDraft && d.pubDate
        })
        .sort((a, b) =>{
            return DateTime.fromJSDate(b.pubDate).toMillis() - DateTime.fromJSDate(a.pubDate).toMillis()
        })


    const postsByYear = groupBy(filteredPosts, (frontmatter) => frontmatter.pubDate?.getFullYear())
    const result = keys(postsByYear)
        .map((key) => ({
            year: key,
            list: postsByYear[key].sort((a: any, b: any) =>b.pubDate - a.pubDate)
        }))
        .filter((i: any) => !isNaN(i.year))
        .reverse();

    return {
        posts: result,
        tags: new Set(
            filteredPosts
                .filter((i) => i.tags)
                .map((i) => i.tags)
                .flat()
        )
    }
}