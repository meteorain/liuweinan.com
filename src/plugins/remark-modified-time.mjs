import { execSync } from 'child_process'

export function remarkModifiedTime() {
    return function (tree, file) {
        const filepath = file.history[0]
        const result = execSync(`cd src/content && git log -1 --pretty="format:%cI" ${filepath}`)
        const lastModified = result ? new Date(result.toString()) : new Date()
        const zodLastModified = lastModified.toISOString()
        file.data.astro.frontmatter.lastModified = zodLastModified
    }
}
