import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { join, dirname, relative, basename } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load environment variables from .env file
config({ path: join(rootDir, '.env') });

const postsDir = join(rootDir, 'src/content/posts');
const postsEnDir = join(rootDir, 'src/content/posts-en');

// Load environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

if (!OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY is not set in .env file');
    process.exit(1);
}

interface FrontMatter {
    [key: string]: any;
}

async function translateText(text: string): Promise<string> {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional translator. Translate the following Chinese text to English. Preserve all markdown formatting, code blocks, links, and special characters. Do not translate code, URLs, or technical terms that are commonly used in English.',
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
            temperature: 0.3,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

function formatFrontMatter(fm: FrontMatter): string {
    const lines: string[] = [];
    
    for (const [key, value] of Object.entries(fm)) {
        if (value === undefined || value === null) continue;
        
        if (Array.isArray(value)) {
            if (value.length === 0) {
                lines.push(`${key}: []`);
            } else {
                // Format arrays with proper indentation
                lines.push(`${key}:`);
                value.forEach((item) => {
                    if (typeof item === 'string') {
                        lines.push(`  - ${item}`);
                    } else {
                        lines.push(`  - ${JSON.stringify(item)}`);
                    }
                });
            }
        } else if (value instanceof Date) {
            lines.push(`${key}: ${value.toISOString()}`);
        } else if (typeof value === 'string') {
            // Check if it's a date string (ISO format)
            if ((key === 'pubDate' || key === 'lastModified') && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
                lines.push(`${key}: ${value}`);
            } else if (value.includes(':') || value.includes('\n') || value.includes("'") || value.includes('"')) {
                lines.push(`${key}: ${JSON.stringify(value)}`);
            } else {
                lines.push(`${key}: ${value}`);
            }
        } else if (typeof value === 'boolean') {
            lines.push(`${key}: ${value}`);
        } else if (typeof value === 'number') {
            lines.push(`${key}: ${value}`);
        } else {
            lines.push(`${key}: ${JSON.stringify(value)}`);
        }
    }
    
    return lines.join('\n');
}

async function getAllMarkdownFiles(dir: string, baseDir: string = dir): Promise<string[]> {
    const files: string[] = [];
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
            // Skip the 'en' directory
            if (entry.name !== 'en') {
                const subFiles = await getAllMarkdownFiles(fullPath, baseDir);
                files.push(...subFiles);
            }
        } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
            // Skip files that are already English versions
            if (!entry.name.endsWith('.en.md') && !entry.name.endsWith('.en.mdx')) {
                files.push(fullPath);
            }
        }
    }
    
    return files;
}

async function translatePost(filePath: string): Promise<void> {
    try {
        const content = await readFile(filePath, 'utf-8');
        const { data: frontmatter, content: body } = matter(content);
        
        // Check if English version already exists
        const relativePath = relative(postsDir, filePath);
        const relativeDir = dirname(relativePath);
        const fileName = basename(filePath);
        const outputDir = join(postsEnDir, relativeDir);
        const outputPath = join(outputDir, fileName);
        
        try {
            const existingContent = await readFile(outputPath, 'utf-8');
            console.log(`Skipping ${filePath} - English version already exists`);
            return;
        } catch {
            // File doesn't exist, proceed with translation
        }
        
        console.log(`Translating: ${filePath}`);
        
        // Translate title - use title-en if exists, otherwise translate title
        let translatedTitle: string;
        if (frontmatter['title-en'] && frontmatter['title-en'].trim()) {
            translatedTitle = frontmatter['title-en'];
            console.log(`  Using existing title-en: ${translatedTitle}`);
        } else if (frontmatter.title) {
            translatedTitle = await translateText(frontmatter.title);
            console.log(`  Title: ${frontmatter.title} -> ${translatedTitle}`);
        } else {
            translatedTitle = '';
        }
        
        // Translate body
        const translatedBody = await translateText(body);
        
        // Create new frontmatter for English version
        // Keep all original fields except replace title with translated title
        // Remove title-en as this is the English version
        const newFrontmatter: FrontMatter = { ...frontmatter };
        newFrontmatter.title = translatedTitle;
        delete newFrontmatter['title-en'];
        
        // Ensure output directory exists
        await mkdir(outputDir, { recursive: true });
        
        // Write translated file
        const formattedFrontMatter = formatFrontMatter(newFrontmatter);
        const outputContent = `---\n${formattedFrontMatter}\n---\n\n${translatedBody}`;
        
        await writeFile(outputPath, outputContent, 'utf-8');
        console.log(`  Saved to: ${outputPath}`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        console.error(`Error translating ${filePath}:`, error);
        throw error;
    }
}

async function main() {
    console.log('Starting translation process...');
    console.log(`Posts directory: ${postsDir}`);
    console.log(`Output directory: ${postsEnDir}`);
    console.log(`Using model: ${OPENAI_MODEL}`);
    console.log('');
    
    // Ensure output directory exists
    await mkdir(postsEnDir, { recursive: true });
    
    // Get all markdown files
    const files = await getAllMarkdownFiles(postsDir);
    console.log(`Found ${files.length} files to translate\n`);
    
    // Translate each file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`[${i + 1}/${files.length}]`);
        await translatePost(file);
        console.log('');
    }
    
    console.log('Translation completed!');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});

