// /* eslint-disable no-console */
import { supabase } from '@/lib/supabaseClient'

export async function uploadToSupabase(
    file: File,
    userId: string,
    type: 'avatar' | 'banner',
): Promise<string | null> {
    try {
        if (!file.type.startsWith('image/')) {
            console.error('Le fichier doit être une image.')
            return null
        }

        const ext = file.name.split('.').pop()
        const fileName = `${type}.${ext}`
        const filePath = `user-${userId}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('user-media')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
            })

        if (uploadError) {
            console.error('Erreur upload Supabase:', uploadError)
            return null
        }

        const { data } = supabase.storage
            .from('user-media')
            .getPublicUrl(filePath)

        return data.publicUrl
    } catch (err) {
        console.error('Erreur inattendue upload:', err)
        return null
    }
}
