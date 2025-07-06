type Lang = [string, string?]

type LangEntry = {
    lang: Lang | 'default'
    json: Record<string, string | number | boolean | Record<string, unknown>>
}

let jsonObj: Record<string, string> = {}
let jsonArr: LangEntry[] = []

const foundLang = (arr: LangEntry[], lang: Lang): LangEntry | undefined => {
    const exact = arr.find(
        el => Array.isArray(el.lang) && el.lang[0] === lang[0] && el.lang[1] === lang[1]
    )
    if (exact) return exact
    return arr.find(
        el => Array.isArray(el.lang) && el.lang[0] === lang[0]
    )
}

const register = (
    json: Record<string, string | number | boolean | Record<string, unknown>>,
    lang: Lang | 'default'
): void => {
    const existing = jsonArr.find(j =>
        Array.isArray(j.lang) && Array.isArray(lang) && j.lang.toString() === lang.toString()
    )
    if (existing) {
        jsonArr.splice(jsonArr.indexOf(existing), 1)
        existing.json = { ...existing.json, ...json }
        jsonArr.push(existing)
    } else {
        jsonArr.push({ lang, json })
    }
}

const init = (): void => {
    const navLang = navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage || 'en'
    const userLgMatch = navLang.match(/([a-z]{2})/gi)
    const userLg: Lang = [userLgMatch?.[0] ?? 'en', userLgMatch?.[1]]
    const jsonlg = foundLang(jsonArr, userLg)
    const defaut = jsonArr.find(el => el.lang === 'default')
    if (jsonlg) {
        jsonObj = Object.fromEntries(
            Object.entries(jsonlg.json) as [string, string][]
        )
    } else if (defaut) {
        jsonObj = Object.fromEntries(
            Object.entries(defaut.json) as [string, string][]
        )
    } else throw new Error('Cannot find matching language')
}

const clear = (): void => {
    jsonArr = []
    jsonObj = {}
}

type I18nType = {
    import: (json: Record<string, unknown>, lang: Lang | 'default') => void
    addLang: (json: Record<string, unknown>, lang: Lang | 'default') => void
    init: () => void
    clear: () => void
} & Record<string, string>

const i18n = new Proxy({} as I18nType, {
    get(_, prop: string) {
        if (prop === 'import' || prop === 'addLang') return register
        if (prop === 'init') return init
        if (prop === 'clear') return clear
        if (prop === '__esModule') return false
        if (typeof jsonObj[prop] === 'string') return jsonObj[prop]
        throw new Error(`[i18n] Cannot find "${prop}" property`)
    },
})

export default i18n
