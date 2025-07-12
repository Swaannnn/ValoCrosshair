import { supabase } from '@/lib/supabaseClient'
import type { Crosshair } from '@/types/types.ts'

export const addCrosshair = async (code: string, name: string, imageUrl: string, category: string) => {
    const { data, error } = await supabase
        .from('crosshairs')
        .insert([{ code, name, image_url: imageUrl, category }])
        .select('id')

    if (error) {
        console.error('Erreur ajout crosshair :', error.message)
        return { error }
    }
    return { id: data?.[0]?.id }
}

export const getUserCrosshairs = async (userId: string): Promise<Crosshair[] | null> => {
    const { data, error } = await supabase
        .from('crosshairs')
        .select('id, created_at, code, name, image_url, category, user_id')
        .eq('user_id', userId)

    if (error) {
        console.error('Erreur fetch crosshairs:', error.message)
        return null
    }
    return data
}

export const getUserCrosshairCount = async (userId: string): Promise<number | null> => {
    const { count, error } = await supabase
        .from('crosshairs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    if (error) {
        console.error('Erreur comptage crosshairs :', error.message)
        return null
    }
    return count ?? 0
}



export const deleteCrosshairWithImage = async (crosshairId: string, imageUrl: string): Promise<{ error: Error | null }> => {
    try {
        const { error: dbError } = await supabase
            .from('crosshairs')
            .delete()
            .eq('id', crosshairId)

        if (dbError) {
            console.error('Erreur suppression crosshair dans DB:', dbError)
            return { error: dbError }
        }

        const parts = imageUrl.split('/user-media/')
        const path = parts[1]

        if (!path) {
            console.warn('Chemin d’image introuvable dans l’URL:', imageUrl)
            return { error: null }
        }

        const { error: storageError } = await supabase.storage
            .from('user-media')
            .remove([path])

        if (storageError) {
            console.error('Erreur suppression image dans Supabase Storage:', storageError)
        }

        return { error: null }
    } catch (err) {
        console.error('Erreur inattendue lors de la suppression du crosshair:', err)
        return { error: err as Error }
    }
}
