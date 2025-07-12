type UserMetadata = {
	nickname?: string
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

export type Profile = {
	user_id: string
	nickname: string | null
	riot_id: string | null
	avatar_url: string | null
	banner_url: string | null
	updated_at: string | null
	rank: string | null
	platform: string | null
}

export type CrosshairCategory = 'pro' | 'fun' | 'user'

export type Crosshair = {
	id: string
	code: string
	name: string
	category: CrosshairCategory
	image_url: string
}

export type Clip = {
	id: string
	created_at: string
	name: string
	link: string
	user_id: string
}
