import { execSync } from 'child_process'

export function remarkModifiedTime() {
    return function (tree, file) {
        // 确保 file.data.astro 和 frontmatter 对象存在
        // 注意：不要覆盖已有的 frontmatter 数据，只添加 lastModified
        if (!file.data) {
            file.data = {}
        }
        if (!file.data.astro) {
            file.data.astro = {}
        }
        // 如果 frontmatter 不存在，创建一个空对象
        // 但不要覆盖已有的 frontmatter 数据（Astro 会自动填充）
        if (!file.data.astro.frontmatter) {
            file.data.astro.frontmatter = {}
        }
        
        const filepath = file.history && file.history[0]
        if (!filepath) {
            return
        }
        
        try {
            // filepath 可能是绝对路径或相对路径，需要确保正确传递给 git
            // git log 需要相对于 git 仓库根目录的路径
            const result = execSync(`git log -1 --pretty="format:%cI" -- "${filepath}"`, {
                cwd: process.cwd(),
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'ignore'], // 忽略 stderr，避免错误输出
                timeout: 5000 // 5秒超时，避免长时间等待
            })
            
            const dateString = result ? result.toString().trim() : null
            if (dateString && dateString.length > 0) {
                const lastModified = new Date(dateString)
                // 检查日期是否有效
                if (!isNaN(lastModified.getTime())) {
                    const zodLastModified = lastModified.toISOString()
                    // 只添加 lastModified，不覆盖其他 frontmatter 数据
                    file.data.astro.frontmatter.lastModified = zodLastModified
                }
            }
        } catch (error) {
            // 如果 git 命令失败或日期无效，不设置 lastModified
            // 这样前端可以显示"暂无修改时间"
            // 静默失败，不影响内容渲染
            // 不抛出错误，确保不影响其他 remark 插件和内容渲染
        }
    }
}
