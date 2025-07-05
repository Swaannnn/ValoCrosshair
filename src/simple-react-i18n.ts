type Lang = [string, string?]

type LangEntry = {
    lang: Lang | 'default'
    json: Record<string, any>
}

let jsonObj: Record<string, any> = {}
let jsonArr: LangEntry[] = []

const foundLang = (arr: LangEntry[], lang: Lang): LangEntry | undefined => {
    const exact = arr.find(el => Array.isArray(el.lang) && el.lang[0] === lang[0] && el.lang[1] === lang[1])
    if (exact) return exact
    return arr.find(el => Array.isArray(el.lang) && el.lang[0] === lang[0])
}

const register = (json: Record<string, any>, lang: Lang | 'default'): void => {
    const existing = jsonArr.find(j =>
        Array.isArray(j.lang) && Array.isArray(lang) && j.lang.toString() === lang.toString()
    )
    if (existing) {
        jsonArr.splice(jsonArr.indexOf(existing), 1)
        existing.json = Object.assign({}, existing.json, json)
        jsonArr.push(existing)
    } else {
        jsonArr.push({ lang, json })
    }
}

const init = (): void => {
    const userLgMatch = (navigator.language || (navigator as any).userLanguage).match(/([A-z]){2}/g)
    const userLg: Lang = [userLgMatch?.[0] || 'en', userLgMatch?.[1]]
    const jsonlg = foundLang(jsonArr, userLg)
    const defaut = jsonArr.find(el => el.lang === 'default')
    if (jsonlg) jsonObj = jsonlg.json
    else if (defaut) jsonObj = defaut.json
    else throw new Error('Cannot find matching language')
}

const clear = (): void => {
    jsonArr = []
    jsonObj = {}
}

const i18n = new Proxy({}, {
    get(_, prop: string) {
        if (prop === 'import' || prop === 'addLang') return register
        if (prop === 'init') return init
        if (prop === 'clear') return clear
        if (prop === '__esModule') return false
        if (prop in jsonObj) return jsonObj[prop]
        throw new Error(`[i18n] Cannot find ${prop} property`)
    },
}) as {
    import: typeof register
    addLang: typeof register
    init: typeof init
    clear: typeof clear
    [key: string]: any
}

export default i18n
