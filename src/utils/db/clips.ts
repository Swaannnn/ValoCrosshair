import { supabase } from '@/lib/supabaseClient'
import type { Clip } from '@/types/types.ts'

export const addClip = async (name: string, link: string) => {
    const { data, error } = await supabase
        .from('clips')
        .insert([{ name, link }])
        .select('id')

    if (error) {
        console.error('Erreur ajout clip :', error.message)
        return { error }
    }
    return { id: data?.[0]?.id }
}

export const getUserClips = async (userId: string): Promise<Clip[] | null> => {
    const { data, error } = await supabase
        .from('clips')
        .select('id, created_at, name, link, user_id')
        .eq('user_id', userId)

    if (error) {
        console.error('Erreur fetch clips:', error.message)
        return null
    }
    return data
}

export const deleteUserClip = async (clipId: string): Promise<{ error: Error | null }> => {
    const { error } = await supabase
        .from('clips')
        .delete()
        .eq('id', clipId)

    if (error) {
        console.error('Erreur suppression clip :', error.message)
    }
    return { error }
}
