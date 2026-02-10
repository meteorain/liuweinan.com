import { execSync } from 'child_process'
import { relative, normalize } from 'path'
import { existsSync, statSync } from 'fs'

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

        try {
            // Normalize path to handle both absolute and relative paths
            const normalizedPath = normalize(filepath)
            const absPath = normalizedPath.startsWith('/') || /^[A-Z]:/.test(normalizedPath)
                ? normalizedPath
                : normalize(process.cwd() + '/' + normalizedPath)

            // Check if file is in submodule (src/content)
            // Handle both Windows (\) and Unix (/) path separators
            const isInSubmodule = absPath.includes('src/content') || absPath.includes('src\\content')
            let gitCommand
            let gitWorkingDir = process.cwd()

            if (isInSubmodule) {
                // For submodule files, use git -C to run command in submodule directory
                // Extract relative path from src/content/
                let submodulePath = absPath
                    // Remove everything before and including src/content/
                    .replace(/^.*src[\\/]content[\\/]/, '')
                    // Convert Windows backslashes to forward slashes for git
                    .replace(/\\/g, '/')

                // Find the project root by looking for src/content directory
                let projectRoot = process.cwd()
                const testSubmoduleDir = normalize(projectRoot + '/src/content')
                if (!existsSync(testSubmoduleDir)) {
                    // Try to find project root from file path
                    const match = absPath.match(/^(.+?)[\\/]src[\\/]content/)
                    if (match) {
                        projectRoot = match[1]
                    }
                }

                const submoduleDir = normalize(projectRoot + '/src/content')
                gitCommand = `git -C "${submoduleDir}" log -1 --pretty="format:%cI" -- "${submodulePath}"`
                gitWorkingDir = projectRoot
            } else {
                // For files in main repository
                // Convert to relative path from project root
                let relativePath = absPath

                // Find project root (where .git directory is)
                let projectRoot = process.cwd()
                if (!absPath.startsWith(projectRoot)) {
                    // Try to find project root from file path
                    const pathParts = absPath.split(/[\\/]/)
                    for (let i = pathParts.length - 1; i >= 0; i--) {
                        const testRoot = pathParts.slice(0, i).join('/')
                        if (existsSync(normalize(testRoot + '/.git'))) {
                            projectRoot = testRoot
                            break
                        }
                    }
                }

                if (absPath.startsWith(projectRoot)) {
                    relativePath = relative(projectRoot, absPath).replace(/\\/g, '/')
                } else {
                    relativePath = absPath.replace(/\\/g, '/')
                    // Remove leading slash if present
                    if (relativePath.startsWith('/')) {
                        relativePath = relativePath.substring(1)
                    }
                }

                gitCommand = `git log -1 --pretty="format:%cI" -- "${relativePath}"`
                gitWorkingDir = projectRoot
            }

            const result = execSync(gitCommand, {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe'], // Capture stderr for debugging
                timeout: 10000, // Increase timeout for build environments
                cwd: gitWorkingDir
            })

            const dateString = result ? result.toString().trim() : null

            if (dateString && dateString.length > 0 && dateString !== '') {
                file.data.astro.frontmatter.lastModified = dateString
            } else {
                // Fallback: use file modification time if git fails
                try {
                    if (existsSync(absPath)) {
                        const stats = statSync(absPath)
                        const mtime = stats.mtime
                        file.data.astro.frontmatter.lastModified = mtime.toISOString()
                    }
                } catch (fsError) {
                    // If file system access also fails, leave it empty
                }
            }
        } catch (error) {
            // Fallback: use file modification time if git command fails
            try {
                const normalizedPath = normalize(filepath)
                const absPath = normalizedPath.startsWith('/') || /^[A-Z]:/.test(normalizedPath)
                    ? normalizedPath
                    : normalize(process.cwd() + '/' + normalizedPath)

                if (existsSync(absPath)) {
                    const stats = statSync(absPath)
                    const mtime = stats.mtime
                    file.data.astro.frontmatter.lastModified = mtime.toISOString()
                }
            } catch (fsError) {
                // If file system access also fails, ignore
            }
        }

    }
}
