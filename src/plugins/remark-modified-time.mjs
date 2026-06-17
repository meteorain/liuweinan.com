// “最后编辑”时间取自文章 frontmatter 的真实修订时间 modDatetime，
// 而不是 git 提交时间或文件 mtime —— 内容是从 WordPress 备份重导出的，
// git/文件时间只反映“导入/部署”那一刻（总是今天），没有意义。
// 没有 modDatetime 的文章不设 lastModified，页面则不显示“最后编辑于”。
export function remarkModifiedTime() {
    return function (tree, file) {
        if (!file.data) file.data = {}
        if (!file.data.astro) file.data.astro = {}
        if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {}
        const frontmatter = file.data.astro.frontmatter
        if (frontmatter.modDatetime) {
            frontmatter.lastModified = new Date(frontmatter.modDatetime).toISOString()
        }
    }
}
