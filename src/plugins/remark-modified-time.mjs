import { execSync } from 'child_process'
import { relative, normalize } from 'path'
import { existsSync, statSync } from 'fs'

function setLastModifiedFromFile(absPath, frontmatter) {
    try {
        if (existsSync(absPath)) {
            const stats = statSync(absPath)
            frontmatter.lastModified = stats.mtime.toISOString()
            return frontmatter.lastModified
        }
    } catch {
        // ignore
    }
    return null
}

export function remarkModifiedTime() {
    return function (tree, file) {
        // Ensure file.data.astro and frontmatter objects exist
        if (!file.data) {
            file.data = {}
        }
        if (!file.data.astro) {
            file.data.astro = {}
        }
        if (!file.data.astro.frontmatter) {
            file.data.astro.frontmatter = {}
        }

        const filepath = file.history && file.history[0]

        if (!filepath) {
            return
        }

        const normalizedPath = normalize(filepath)
        const absPath = normalizedPath.startsWith('/') || /^[A-Z]:/.test(normalizedPath)
            ? normalizedPath
            : normalize(process.cwd() + '/' + normalizedPath)

        const frontmatter = file.data.astro.frontmatter

        try {
            const isInSubmodule = absPath.includes('src/content') || absPath.includes('src\\content')
            let gitCommand
            let gitWorkingDir = process.cwd()

            if (isInSubmodule) {
                let projectRoot = process.cwd()
                const testSubmoduleDir = normalize(projectRoot + '/src/content')
                if (!existsSync(testSubmoduleDir)) {
                    const match = absPath.match(/^(.+?)[\\/]src[\\/]content/)
                    if (match) projectRoot = match[1]
                }

                const submoduleDir = normalize(projectRoot + '/src/content')
                const submoduleExists = existsSync(submoduleDir)
                const submoduleHasGit = existsSync(normalize(submoduleDir + '/.git'))

                if (!submoduleExists || !submoduleHasGit) {
                    setLastModifiedFromFile(absPath, frontmatter)
                    return
                }

                let submodulePath = absPath
                    .replace(/^.*src[\\/]content[\\/]/, '')
                    .replace(/\\/g, '/')
                gitCommand = `git -C "${submoduleDir}" log -1 --pretty="format:%cI" -- "${submodulePath}"`
                gitWorkingDir = projectRoot
            } else {
                let projectRoot = process.cwd()
                if (!absPath.startsWith(projectRoot)) {
                    const pathParts = absPath.split(/[\\/]/)
                    for (let i = pathParts.length - 1; i >= 0; i--) {
                        const testRoot = pathParts.slice(0, i).join('/')
                        if (existsSync(normalize(testRoot + '/.git'))) {
                            projectRoot = testRoot
                            break
                        }
                    }
                }

                const rootHasGit = existsSync(normalize(projectRoot + '/.git'))

                if (!rootHasGit) {
                    setLastModifiedFromFile(absPath, frontmatter)
                    return
                }

                let relativePath = absPath.startsWith(projectRoot)
                    ? relative(projectRoot, absPath).replace(/\\/g, '/')
                    : absPath.replace(/\\/g, '/').replace(/^\//, '')
                gitCommand = `git log -1 --pretty="format:%cI" -- "${relativePath}"`
                gitWorkingDir = projectRoot
            }

            const result = execSync(gitCommand, {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe'],
                timeout: 10000,
                cwd: gitWorkingDir
            })

            const dateString = result ? result.toString().trim() : null
            if (dateString && dateString.length > 0) {
                frontmatter.lastModified = dateString
            } else {
                setLastModifiedFromFile(absPath, frontmatter)
            }
        } catch {
            setLastModifiedFromFile(absPath, frontmatter)
        }
    }
}
