import { visit } from 'unist-util-visit';

/**
 * 修复 wiki link 的 locale，确保链接使用正确的 locale
 */
export function remarkWikiLinkLocale() {
    return function (tree, file) {
        // 根据文件路径判断 locale
        // 如果文件路径包含 posts-en，则是英文；否则是中文
        const filePath = file.history && file.history[0] || '';
        const locale = filePath.includes('posts-en') ? 'en' : 'zh';
        
        visit(tree, (node) => {
            // 处理 wiki link
            if (node.type === 'wikiLink') {
                const href = node.data?.hProperties?.href;
                if (href && typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
                    // 手动添加 locale 前缀
                    // 默认 locale (zh) 不需要前缀，en 需要 /en 前缀
                    let localeUrl = href;
                    if (locale === 'en') {
                        localeUrl = '/en' + href;
                    }
                    // 更新链接 URL
                    if (node.data && node.data.hProperties) {
                        node.data.hProperties.href = localeUrl;
                    }
                }
            }
        });
    };
}

