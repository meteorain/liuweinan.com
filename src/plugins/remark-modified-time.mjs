import { execSync } from 'child_process'
import { relative, normalize } from 'path'

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

        // Debug: log to see if plugin is called


        if (!filepath) {
            return
        }

        try {
            // Normalize path to handle both absolute and relative paths
            const normalizedPath = normalize(filepath)

            // Check if file is in submodule (src/content)
            // Handle both Windows (\) and Unix (/) path separators
            // Use a simple string check that works for both separators
            const isInSubmodule = normalizedPath.includes('src/content') || normalizedPath.includes('src\\content')
            let gitCommand

            if (isInSubmodule) {
                // For submodule files, use git -C to run command in submodule directory
                // Extract relative path from src/content/
                // Handle both absolute and relative paths, and both path separators
                let submodulePath = normalizedPath
                    // Remove everything before and including src/content/
                    .replace(/^.*src[\\/]content[\\/]/, '')
                    // Convert Windows backslashes to forward slashes for git
                    .replace(/\\/g, '/')

                gitCommand = `git -C src/content log -1 --pretty="format:%cI" -- "${submodulePath}"`
            } else {
                // For files in main repository
                // Convert to relative path if absolute
                const relativePath = normalizedPath.startsWith(process.cwd())
                    ? relative(process.cwd(), normalizedPath).replace(/\\/g, '/')
                    : normalizedPath.replace(/\\/g, '/')
                gitCommand = `git log -1 --pretty="format:%cI" "${relativePath}"`
            }

            const result = execSync(gitCommand, {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe'], // Capture stderr for debugging
                timeout: 5000
            })

            const dateString = result ? result.toString().trim() : null

            if (dateString && dateString.length > 0) {
                file.data.astro.frontmatter.lastModified = dateString
            } else {
                // Fallback to test value

            }
        } catch (error) {
            // Set fallback value
        }

    }
}
