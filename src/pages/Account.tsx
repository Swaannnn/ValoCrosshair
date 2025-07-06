import { editUserProfile, getUserBasicInfo, getUserProfile } from '@/utils/user.ts'
import React, { type FormEvent, useEffect, useState } from 'react'
import type { UserBasicInfo } from '@/types/user'
import Card from '@components/Card.tsx'
import Button from '@components/Button.tsx'
import Loader from '@components/Loader.tsx'
import { useSession } from '@/features/auth/useSession.ts'
import type { Profile } from '@/types/profile'
import i18n from '@/simple-react-i18n.ts'
import Text from '@components/Text.tsx'
import Link from '@components/Link.tsx'
import { useLocation } from 'react-router-dom'
import { headerHeight } from '@constants/sizes.ts'
import ProfileSection from '@components/account/ProfileSection.tsx'

const sectionIds = ['myProfile', 'myCrosshairs', 'personalInformation']

const Account = () => {
    const userId = useSession()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [fullName, setFullName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>()
    const [editProfile, setEditProfile] = useState(false)
    const routerLocation = useLocation()
    const [activeSection, setActiveSection] = useState<string>('')

    useEffect(() => {
        getUserBasicInfo()
            .then(userInfo => setUserBasicInfo(userInfo))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!userId) return

        setLoading(true)
        getUserProfile(userId).then((data) => {
            if (data) {
                setProfile(data)
                setFullName(data.full_name ?? '')
                setAvatarUrl(data.avatar_url ?? '')
            }
            setLoading(false)
        })
    }, [userId])

    useEffect(() => {
        if (routerLocation.hash) {
            const id = routerLocation.hash.slice(1)
            scrollToSection(id)
        }
    }, [routerLocation.hash])

    useEffect(() => {
        const handleScroll = () => {
            const offset = parseInt(headerHeight) + 16
            for (const id of sectionIds) {
                const el = document.getElementById(id)
                if (el) {
                    const rect = el.getBoundingClientRect()
                    if (rect.top <= offset && rect.bottom >= offset) {
                        setActiveSection(id)
                        break
                    }
                }
            }
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id: string) => {
        const target = document.getElementById(id)
        if (target) {
            const headerOffset = -(parseInt(headerHeight) + 16)
            const y = target.getBoundingClientRect().top + window.scrollY + headerOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
            window.history.replaceState(null, '', `#${id}`)

            setActiveSection(id)
        }
    }

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault()
        scrollToSection(id)
    }

    const handleEditProfile = async (e: FormEvent) => {
        e.preventDefault()
        if (!userId) return

        setLoading(true)
        const success = await editUserProfile({ id: userId, full_name: fullName, avatar_url: avatarUrl })
        if (!success) setErrorMsg('Erreur lors de la sauvegarde du profil')
        else setErrorMsg('')
        setLoading(false)
        setEditProfile(false)
    }

    if (loading) return <Loader />

    return (
        <div style={{ display: 'flex', padding: '1rem' }}>
            <div style={{ width: '25%' }}>
                <div style={{ position: 'fixed', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Text size="lg" weight="bold">{i18n.myAccount}</Text>
                    {sectionIds.map(id => (
                        <Link
                            key={id}
                            to={`/account/#${id}`}
                            onClick={(e) => handleAnchorClick(e, id)}
                        >
                            <span
                                style={{
                                    fontWeight: activeSection === id ? 'bold' : 'normal',
                                    color: activeSection === id ? 'red' : 'inherit',
                                    transition: 'color 0.3s',
                                }}
                            >
                                {i18n[id] ?? id}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div id="myProfile">
                    <ProfileSection profile={profile} userInfos={userBasicInfo} />
                </div>

                <div id="myCrosshairs">
                    <Card width="full">
                        <Text size="lg" weight="bold">{i18n.myCrosshairs}</Text>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <p>blablabla</p>
                    </Card>
                </div>

                <div id="personalInformation">
                    <Card width="full">
                        <Text size="lg" weight="bold">Informations personnelles</Text>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        {!editProfile && (
                            <Button onClick={() => setEditProfile(true)}>
                                modifier le profil
                            </Button>
                        )}
                        {editProfile && (
                            <form onSubmit={handleEditProfile}>
                                <label>
                                    Nom complet
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        disabled={loading}
                                    />
                                </label>

                                <label>
                                    URL Avatar
                                    <input
                                        type="text"
                                        value={avatarUrl}
                                        onChange={e => setAvatarUrl(e.target.value)}
                                        disabled={loading}
                                    />
                                </label>

                                <button type="submit" disabled={loading}>
                                    Enregistrer
                                </button>

                                <button type="button" onClick={() => setEditProfile(false)}>
                                    Annuler
                                </button>

                                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Account
