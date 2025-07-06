import i18n from '@/simple-react-i18n.ts'

export const formatDateToLong = (dateString: string): string => {
    const date = new Date(dateString)

    return date.toLocaleDateString(i18n.countryCode, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}
