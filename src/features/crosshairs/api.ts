import { supabase } from '@/lib/supabaseClient'
import type { Crosshair } from '@/types/crosshair'

export const getAllCrosshairs = async (): Promise<Crosshair[]> => {
    const { data, error } = await supabase.from('crosshairs').select('*')
    if (error) throw error
    return data as Crosshair[]
}

export const addCrosshairToUser = async (userId: string, crosshairCode: string): Promise<void> => {
    const { error } = await supabase.from('user_crosshairs').insert([
        { user_id: userId, crosshair_code: crosshairCode }
    ])
    if (error) throw error
}
