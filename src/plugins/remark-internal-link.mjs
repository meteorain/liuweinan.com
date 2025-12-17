import { visit } from 'unist-util-visit';

// This plugin adds class 'internal' to all internal links and preserves locale
export function InternalLinkPlugin() {
    return (tree, file) => {
        // 根据文件路径判断 locale
        // 如果文件路径包含 posts-en，则是英文；否则是中文
        const filePath = file.history && file.history[0] || '';
        const locale = filePath.includes('posts-en') ? 'en' : 'zh';
        
        visit(tree, (node) => {
            if (node.type === 'link') {
                if (
                    node.attributes &&
                    node.attributes.class &&
                    node.attributes.class.includes('internal')
                )
                    return;

                if (node.url.startsWith('/') && !node.url.startsWith('//')) {
                    // 手动添加 locale 前缀
                    // 默认 locale (zh) 不需要前缀，en 需要 /en 前缀
                    let localeUrl = node.url;
                    if (locale === 'en') {
                        localeUrl = '/en' + node.url;
                    }
                    
                    // 更新链接 URL
                    node.url = localeUrl;
                    
                    // add class
                    const data = node.data || (node.data = {});
                    data.hProperties = {
                        class: 'internal',
                    };
                }
            }
        });
    };
}
