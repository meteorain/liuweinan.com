import {getCollection} from "astro:content";
import {DateTime} from "luxon";

function groupBy<T, K extends string | number | symbol>(
    items: T[],
    keyFn: (item: T) => K | undefined
): Record<K, T[]> {
    return items.reduce((acc, item) => {
        const key = keyFn(item)
        if (key === undefined || key === null) return acc
        const k = key as K
        if (!acc[k]) acc[k] = []
        acc[k].push(item)
        return acc
    }, {} as Record<K, T[]>)
}

/**
 * Get the collection name based on locale
 */
export const getPostsCollectionName = (locale: string): 'posts' | 'posts-en' => {
    return locale === 'en' ? 'posts-en' : 'posts';
};

export const getAllPosts = async (locale: string, tag: string, category: string) => {
    const collectionName = getPostsCollectionName(locale);
    const allPosts = await getCollection(collectionName)
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
    const result = Object.keys(postsByYear)
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