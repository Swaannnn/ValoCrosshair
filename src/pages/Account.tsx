import { getUserBasicInfo } from '@/utils/user.ts'
import React, { useEffect, useState } from 'react'
import type { UserBasicInfo } from '@/types/types'
import Loader from '@components/Loader.tsx'
import { useSession } from '@/features/auth/useSession.ts'
import i18n from '@/simple-react-i18n.ts'
import Text from '@components/Text.tsx'
import Link from '@components/Link.tsx'
import { useLocation } from 'react-router-dom'
import { headerHeight } from '@constants/sizes.ts'
import ProfileSection from '@components/account/ProfileSection.tsx'
import { supabase } from '@/lib/supabaseClient.ts'
import Dialog from '@components/Dialog.tsx'
import Card from '@components/Card.tsx'
import ClipsSection from '@components/account/ClipsSection.tsx'

const sectionIds = ['myProfile', 'myCrosshairs', 'myClips', 'myPersonalsInformations']

const Account = () => {
    const userId = useSession()
    const [loading, setLoading] = useState(true)
    const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>()
    const routerLocation = useLocation()
    const [activeSection, setActiveSection] = useState<string>('')
    const [openDialogLogout, setOpenDialogLogout] = useState(false)

    useEffect(() => {
        getUserBasicInfo()
            .then(userInfo => setUserBasicInfo(userInfo))
            .finally(() => setLoading(false))
    }, [])

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

    const handleLogout = async () => {
        await supabase.auth.signOut()
        location.reload()
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
                    <Link
                        to={'/account'}
                        onClick={() => setOpenDialogLogout(true)}
                    >
                        <span style={{ transition: 'color 0.3s' }}>
                            {i18n.logout}
                        </span>
                    </Link>
                </div>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div id="myProfile">
                    {userBasicInfo && (
                        <ProfileSection userId={userId} userInfos={userBasicInfo}/>
                    )}
                </div>

                <div id="myCrosshairs">
                    <Card width="full">
                        {/* <CrosshairsSection /> */}
                        <Text size="lg" weight="bold">{i18n.myCrosshairs}</Text>
                    </Card>
                </div>

                <div id="myClips">
                    <Card width="full">
                        <ClipsSection userId={userId} />
                    </Card>
                </div>

                <div id="myPersonalsInformations">
                    <Card width="full">
                        {/* <PersonalsInformationsSection /> */}
                        <Text size="lg" weight="bold">{i18n.myPersonalsInformations}</Text>
                    </Card>
                </div>
            </div>
            {openDialogLogout && (
                <Dialog
                    title={i18n.logout}
                    buttonText={i18n.logout}
                    onButtonClick={handleLogout}
                    secondaryButtonText={i18n.cancel}
                    onSecondaryButtonClick={() => setOpenDialogLogout(false)}
                >
                    {i18n.confirmLogout}
                </Dialog>
            )}
        </div>
    )
}

export default Account
