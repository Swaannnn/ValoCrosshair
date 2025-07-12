import i18n from '@/simple-react-i18n.ts'
import Card from '@components/Card.tsx'
import type { Profile } from '@/types/types'
import ProgressBar from '@components/ProgressBar.tsx'
import DefaultBanner from '@/assets/images/default_banner.png'
import { mainWhite, redError } from '@constants/colors.ts'
import { avatarSize, bannerHeight } from '@constants/sizes.ts'
import Text from '@components/Text.tsx'
import type { UserBasicInfo } from '@/types/types'
import { formatDateToLong } from '@utils/date.ts'
import Button from '@components/Button.tsx'
import { type FormEvent, useEffect, useState } from 'react'
import TextField from '@components/TextField.tsx'
import { editUserProfile, getUserProfile } from '@utils/user.ts'
import { compact } from 'lodash'
import Selector from '@components/Selector.tsx'
import IconButton from '@components/IconButton.tsx'
import { Pencil } from 'lucide-react'
import { uploadToSupabase } from '@utils/uploadToSupabase.ts'
import Tooltip from '@components/Tooltip.tsx'

type ProfileSectionProps = {
    userId: string | null
    userInfos: UserBasicInfo
}

const ProfileSection = ({ userId, userInfos }: ProfileSectionProps) => {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [editProfile, setEditProfile] = useState(false)
    const [nickname, setNickname] = useState('')
    const [nicknameError, setNicknameError] = useState('')
    const [riotId, setRiotId] = useState('')
    const [riotIdError, setRiotIdError] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    // const [avatarUrlError, setAvatarUrlError] = useState('')
    const [bannerUrl, setBannerUrl] = useState('')
    // const [bannerUrlError, setBannerUrlError] = useState('')
    const [newBannerFile, setNewBannerFile] = useState<File | null>(null)
    const [previewBannerUrl, setPreviewBannerUrl] = useState<string | null>(null)
    const [rank, setRank] = useState('')
    const [platform, setPlatform] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null)
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null)


    const ranks = [
        { id: 'unranked', label: i18n.unranked },
        { id: 'iron1', label: i18n.iron1 }, { id: 'iron2', label: i18n.iron2 }, { id: 'iron3', label: i18n.iron3 },
        { id: 'bronze1', label: i18n.bronze1 }, { id: 'bronze2', label: i18n.bronze2 }, { id: 'bronze3', label: i18n.bronze3 },
        { id: 'silver1', label: i18n.silver1 }, { id: 'silver2', label: i18n.silver2 }, { id: 'silver3', label: i18n.silver3 },
        { id: 'gold1', label: i18n.gold1 }, { id: 'gold2', label: i18n.gold2 }, { id: 'gold3', label: i18n.gold3 },
        { id: 'platinum1', label: i18n.platinum1 }, { id: 'platinum2', label: i18n.platinum2 }, { id: 'platinum2', label: i18n.platinum3 },
        { id: 'diamond1', label: i18n.diamond1 }, { id: 'diamond2', label: i18n.diamond2 }, { id: 'diamond3', label: i18n.diamond3 },
        { id: 'ascendant1', label: i18n.ascendant1 }, { id: 'ascendant2', label: i18n.ascendant2 }, { id: 'ascendant3', label: i18n.ascendant3 },
        { id: 'immortal1', label: i18n.immortal1 }, { id: 'immortal2', label: i18n.immortal2 }, { id: 'immortal3', label: i18n.immortal3 },
        { id: 'radiant', label: i18n.radiant }
    ]

    const platforms = [
        { id: 'pc', label: i18n.pc },
        { id: 'console', label: i18n.console },
    ]

    useEffect(() => {
        if (!userId) return
        setLoading(true)
        getUserProfile(userId).then((data) => {
            if (data) setProfile(data)
            setLoading(false)
        })
    }, [userId])

    useEffect(() => {
        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url)
        if (profile?.banner_url) setBannerUrl(profile.banner_url)
        if (profile?.nickname) setNickname(profile.nickname)
        if (profile?.riot_id) setRiotId(profile.riot_id)
        if (profile?.rank) setRank(profile.rank)
        if (profile?.platform) setPlatform(profile.platform)
    }, [profile])

    // const handleUpdateAvatar = async (file: File) => {
    //     if (userId) {
    //         const avatar = await uploadToSupabase(file, userId, 'avatar')
    //         if (avatar) setAvatarUrl(avatar)
    //     }
    // }

    const handleEditProfile = async (e: FormEvent) => {
        e.preventDefault()
        if (!profile || !userId) return

        setLoading(true)

        let finalAvatarUrl = avatarUrl
        if (newAvatarFile) {
            const uploaded = await uploadToSupabase(newAvatarFile, userId, 'avatar')
            if (uploaded) {
                finalAvatarUrl = uploaded
                setAvatarUrl(uploaded)
            }
        }

        let finalBannerUrl = bannerUrl
        if (newBannerFile) {
            const uploaded = await uploadToSupabase(newBannerFile, userId, 'banner')
            if (uploaded) {
                finalBannerUrl = uploaded
                setBannerUrl(uploaded)
            }
        }

        const success = await editUserProfile({
            user_id: profile.user_id,
            nickname: nickname,
            riot_id: riotId,
            avatar_url: avatarUrl,
            banner_url: bannerUrl,
            rank,
            platform
        })

        if (!success) {
            setErrorMessage('Erreur lors de la sauvegarde du profil')
            setLoading(false)
            return
        }

        setProfile(prev => prev ? {
            ...prev,
            nickname,
            riot_id: riotId,
            avatar_url: finalAvatarUrl,
            banner_url: finalBannerUrl,
            rank,
            platform
        } : null)

        setNewAvatarFile(null)
        setPreviewAvatarUrl(null)
        setNewBannerFile(null)
        setPreviewBannerUrl(null)
        setErrorMessage('')
        setEditProfile(false)
        setLoading(false)
    }

    return (
        <Card width="full">
            <h2>{i18n.myProfile}</h2>
            <div style={{ paddingTop: '0.5rem' }}>
                {(loading || !profile || !userId) ? (
                    <ProgressBar title='Chargement du profil en cours...' />
                ) : (
                    <>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '100%', height: bannerHeight, overflow: 'hidden' }}>
                                <img
                                    src={previewBannerUrl || bannerUrl || DefaultBanner}
                                    alt="user banner"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            {editProfile &&
                                <div style={{ position: 'absolute', bottom: 'calc(58px + 0.5rem)', right: '0.5rem', zIndex: 100 }}>
                                    <label style={{ display: 'inline-block', cursor: 'pointer' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    setNewBannerFile(file)
                                                    setPreviewBannerUrl(URL.createObjectURL(file))
                                                }
                                            }}
                                        />
                                        <Tooltip position='bottom-left' content={i18n.addBannerToolip}>
                                            <IconButton size="40px">
                                                <Pencil />
                                            </IconButton>
                                        </Tooltip>
                                    </label>
                                </div>
                            }
                            <div
                                style={{
                                    position: 'absolute',
                                    top: `calc(${bannerHeight} - (${avatarSize} / 1.35))`,
                                    left: '1rem',
                                    width: avatarSize,
                                    height: avatarSize,
                                    borderRadius: '50%',
                                    border: `4px solid ${mainWhite}`,
                                    // overflow: 'hidden',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <img
                                    src={previewAvatarUrl || avatarUrl || ''} // mettre avatar par défaut
                                    alt="user avatar"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                    }}
                                />
                                {editProfile && (
                                    <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 100 }}>
                                        <label style={{ display: 'inline-block', cursor: 'pointer' }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        setNewAvatarFile(file)
                                                        setPreviewAvatarUrl(URL.createObjectURL(file))
                                                    }
                                                }}
                                            />
                                            <Tooltip position='bottom' content={i18n.addAvatarToolip}>
                                                <IconButton size="40px">
                                                    <Pencil />
                                                </IconButton>
                                            </Tooltip>
                                        </label>
                                    </div>
                                )}

                            </div>
                            <div
                                style={{
                                    padding: `1rem 0 0 calc(${avatarSize} + 1rem)`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {profile.rank &&
                                        <img src={`/images/ranks/${profile.rank}.png`} style={{ height: '40px', width: '40px' }} alt='user rank'/>
                                    }
                                    <div>
                                        {profile.nickname && (
                                            <Text size="lg" weight="bold">
                                                {compact([profile.nickname, profile.riot_id]).join(' - ')}
                                            </Text>
                                        )}
                                        {userInfos.created_at && <Text>Membre depuis : {formatDateToLong(userInfos.created_at)}</Text>}
                                    </div>
                                </div>
                                {!editProfile && <Button variant='secondary' onClick={() => setEditProfile(true)}>{i18n.editProfile}</Button>}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {editProfile && (
                <div style={{ paddingTop: '2rem' }}>
                    <form onSubmit={handleEditProfile} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}>
                            <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <TextField
                                        label={i18n.nickname}
                                        placeholder={i18n.nicknamePlaceholder}
                                        value={nickname}
                                        onChange={(e) => {
                                            setNickname(e.target.value)
                                            setNicknameError('')
                                        }}
                                        error={nicknameError}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <TextField
                                        label={i18n.riotId}
                                        placeholder={i18n.riotIdPlaceholder}
                                        value={riotId}
                                        onChange={(e) => {
                                            setRiotId(e.target.value)
                                            setRiotIdError('')
                                        }}
                                        error={riotIdError}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <Selector
                                        label={i18n.rank}
                                        options={ranks}
                                        value={rank}
                                        onChange={setRank}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Selector
                                        label={i18n.platform}
                                        options={platforms}
                                        value={platform}
                                        onChange={setPlatform}
                                    />
                                </div>
                            </div>
                        </div>

                        {errorMessage && (
                            <Text size="sm" color={redError}>
                                {errorMessage}
                            </Text>
                        )}

                        <div style={{ padding: '1.5rem 0', display: 'flex', gap: '1rem' }}>
                            <Button fullWidth loading={loading}>{i18n.save}</Button>
                            <Button variant='secondary' onClick={() => setEditProfile(false)} fullWidth>{i18n.cancel}</Button>
                        </div>
                    </form>
                </div>
            )}
        </Card>
    )
}

export default ProfileSection
