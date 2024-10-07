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
        .filter((frontmatter) => {
            if (!frontmatter) return false
            if (tag) {
                return frontmatter.pubDate && !frontmatter.isDraft && frontmatter.tags && frontmatter.tags.includes(tag)
            } else if (category) {
                return frontmatter.pubDate && !frontmatter.isDraft && frontmatter.categories && frontmatter.categories.includes(category)
            }
            return !frontmatter.isDraft && frontmatter.pubDate
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