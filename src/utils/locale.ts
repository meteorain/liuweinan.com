import zh from '../locales/zh.yml'
import en from '../locales/en.yml'
import { getLocale, getLocaleUrl } from 'astro-i18n-aut'

const getNested = (obj: any, path: string) =>
    path.split('.').reduce((acc: any, key: string) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)

const useLocalePath = (lang: string) => {
    return (path: string) => {
        // 确保路径以 / 开头
        if (!path.startsWith('/')) {
            path = '/' + path
        }
        // 使用 astro-i18n-aut 的 getLocaleUrl 来生成正确路径
        return getLocaleUrl(path, lang)
    }
}

const useTranslation = (lang: string) => {
    // 如果没有语言或语言是默认语言 zh，使用中文翻译
    if (!lang || lang === 'zh') {
        return (key: string) => {
            const r = getNested(zh, key)
            if (!r) {
                console.warn(`Translation for "${key}" not found in zh.yml`)
                // 如果中文没有，尝试英文
                const enR = getNested(en, key)
                if (enR) return enR
                return key.split('.').pop()
            }
            return r
        }
    }
    // 否则使用英文翻译
    return (key: string) => {
        const r = getNested(en, key)
        if (!r) {
            console.warn(`Translation for "${key}" not found in en.yml`)
            // 如果英文没有，尝试中文
            const zhR = getNested(zh, key)
            if (zhR) return zhR
            return key.split('.').pop()
        }
        return r
    }
}

export const useLocale = (url: URL) => {
    const locale = getLocale(url) || 'zh'
    return {
        path: useLocalePath(locale),
        t: useTranslation(locale),
        locale
    }
}
