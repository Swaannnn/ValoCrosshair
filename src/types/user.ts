type UserMetadata = {
    full_name?: string
    avatar_url?: string
}


export type UserBasicInfo = {
    id: string
    email?: string | undefined
    phone?: string | null
    confirmed_at?: string | null
    last_sign_in_at?: string | null
    created_at?: string | null
    user_metadata?: UserMetadata
}
