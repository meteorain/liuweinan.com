import {DateTime} from 'luxon'

export function relativeTo(dateStr: string, locale = 'zh') {
    locale ??= 'zh'
    return DateTime.fromISO(dateStr).toRelative({
        base: DateTime.now(),
        locale: locale
    })
}

export function formatDateMD(dateStr: string | Date | undefined, locale: string = 'zh') {
    const date = dateStr instanceof String ? DateTime.fromISO(dateStr as string) : DateTime.fromJSDate(dateStr as Date)
    if (locale === 'en') {
        return date.setLocale(locale).toFormat('dd, MMM')
    }
    return date.toFormat('MM-dd')
}

export function formatDateYMD(dateStr: string | Date | undefined, locale: string = 'zh') {
    console.log(dateStr)
    const date = dateStr instanceof String ? DateTime.fromISO(dateStr as string) : DateTime.fromJSDate(dateStr as Date)
    if (locale === 'en') {
        return date.setLocale(locale).toFormat('dd, MMM, yyyy')
    }
    return date.toFormat('yyyy-MM-dd')
}

export function slugifySpace(old: string) {
    return old.replace(/\s/g, '-')
}
