/* eslint-disable no-console */
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
        const timestamp = Date.now()
        const fileName = `${type}-${timestamp}.${ext}`
        const filePath = `user-${userId}/${fileName}`
        const folderPrefix = `user-${userId}/`

        const { data: list, error: listError } = await supabase.storage
            .from('user-media')
            .list(folderPrefix, { limit: 100 })

        if (listError) {
            console.error('Erreur lors de la lecture du dossier Supabase:', listError)
        } else {
            const filesToDelete = list
                .filter((file) => file.name.startsWith(type))
                .map((file) => `${folderPrefix}${file.name}`)

            if (filesToDelete.length > 0) {
                const { error: deleteError } = await supabase.storage
                    .from('user-media')
                    .remove(filesToDelete)

                if (deleteError) {
                    console.error('Erreur suppression ancienne(s) image(s):', deleteError)
                }
            }
        }

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
