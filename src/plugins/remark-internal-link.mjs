import { visit } from 'unist-util-visit';

// This plugin adds class 'internal' to all internal links
export function InternalLinkPlugin() {
    return (tree) => {
        visit(tree, (node) => {
            if (node.type === 'link') {
                if (
                    node.attributes &&
                    node.attributes.class.includes('internal')
                )
                    return;

                if (node.url.startsWith('/')) {
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
