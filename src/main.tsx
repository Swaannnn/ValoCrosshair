import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import i18n from './simple-react-i18n.ts'
import fr from '@/assets/i18n/properties_fr.json'
import en from '@/assets/i18n/properties_en.json'

type I18nJson = Record<string, any>

type LanguageProperty = {
    code: string
    value: I18nJson
}

i18n.addLang(fr, ['fr', 'FR'])
i18n.addLang(en, ['en', 'EN'])
i18n.addLang(fr, 'default')
i18n.init()

const properties: LanguageProperty[] = [
    {
        code: 'fr',
        value: fr,
    },
    {
        code: 'en',
        value: en,
    },
]

export const handleUpdateLanguage = (code: string) => {
    const propertie = properties.find(p => p.code === code)
    i18n.clear()
    i18n.addLang(propertie?.value || fr, 'default')
    i18n.init()
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)
