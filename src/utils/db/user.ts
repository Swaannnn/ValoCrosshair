/* eslint-disable no-console */
import { supabase } from '@/lib/supabaseClient.ts'
import type { Profile } from '@/types/types.ts'

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
        .select('user_id, nickname, avatar_url, updated_at, riot_id, banner_url, rank, platform')
        .eq('user_id', userId)
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
    user_id: string
    nickname?: string
    riot_id?: string
    avatar_url?: string
    banner_url?: string
    rank?: string
    platform?: string
}): Promise<boolean> => {
    const { error } = await supabase
        .from('profiles')
        .upsert({
            user_id: profile.user_id,
            nickname: profile.nickname ?? null,
            riot_id: profile.riot_id ?? null,
            avatar_url: profile.avatar_url ?? null,
            banner_url: profile.banner_url ?? null,
            updated_at: new Date().toISOString(),
            rank: profile.rank ?? null,
            platform: profile.platform ?? null,
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
