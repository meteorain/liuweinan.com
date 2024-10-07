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
        if (!url.endsWith('/')) url += '/'
        return url
    }
}

const useTranslation = (lang: string) => {
    if (!lang) lang = 'zh'
    return (key: string) => {
        const data = lang === 'zh' ? [zh, en] : [en, zh]
        const r = get(data[0], key)
        if (!r) {
            console.warn(`Translation for "${key}" not found`)
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
