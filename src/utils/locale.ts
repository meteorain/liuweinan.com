import zh from '../locales/zh.yml'
import en from '../locales/en.yml'
import get from 'lodash/get'

const getLocale = (url: URL) => ""

const useLocalePath = (lang: string) => {
    lang ??= ''
    if (lang === 'zh') {
        lang = ''
    }
    const start = lang ? '/en' : ''
    return (path: string) => {
        let url = start + path
        return url
    }
}

const useTranslation = (lang: string) => {
    if (!lang) lang = 'zh'
    return (key: string) => {
        const data = lang === 'zh' ? [zh, en] : [en, zh]
        const r = get(data[0], key)
        // 翻译缺失（如旧博客遗留的标签）直接用原值，不再打印警告
        if (!r) {
            return key.split('.').pop()
        }
        return r
    }
}

export const useLocale = (url: URL) => {
    const locale = getLocale(url)
    return {
        path: useLocalePath(locale),
        t: useTranslation(locale),
        locale
    }
}
