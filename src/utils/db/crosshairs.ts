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

export const deleteUserCrosshair = async (crosshairId: string): Promise<{ error: Error | null }> => {
    const { error } = await supabase
        .from('crosshairs')
        .delete()
        .eq('id', crosshairId)

    if (error) {
        console.error('Erreur suppression crosshair :', error.message)
    }
    return { error }
}
