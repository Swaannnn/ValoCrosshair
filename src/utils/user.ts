import { supabase } from '@/lib/supabaseClient'
import type { Profile } from '@/types/profile'


/**
 * Récupère les informations de base de l'utilisateur connecté
 */
const getUserBasicInfo = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
}

/**
 * Récupère le profil utilisateur lié à userId
 */
const getUserProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, updated_at')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Erreur fetchProfile:', error.message)
        return null
    }

    return data
}

/**
 * Crée ou met à jour le profil utilisateur
 */
const editUserProfile = async (profile: {
    id: string
    full_name?: string
    avatar_url?: string
}): Promise<boolean> => {
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: profile.id,
            full_name: profile.full_name ?? null,
            avatar_url: profile.avatar_url ?? null,
            updated_at: new Date().toISOString(),
        })

    if (error) {
        console.error('Erreur upsertProfile:', error.message)
        return false
    }

    return true
}

export {
    getUserProfile, getUserBasicInfo, editUserProfile
}
