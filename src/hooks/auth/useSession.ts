import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient.ts'

export const useSession = () => {
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserId(data.user.id)
        })

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUserId(session?.user?.id ?? null)
            },
        )

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return userId
}
