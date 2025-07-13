import { getUserBasicInfo } from '@utils/db/user.ts'
import React, { useEffect, useState } from 'react'
import type { UserBasicInfo } from '@/types/types'
import Loader from '@components/ui/Loader.tsx'
import { useSession } from '@hooks/auth/useSession.ts'
import i18n from '@/simple-react-i18n.ts'
import Text from '@components/ui/Text.tsx'
import Link from '@components/ui/Link.tsx'
import { useLocation } from 'react-router-dom'
import { headerHeight } from '@constants/sizes.ts'
import ProfileSection from '@components/account/ProfileSection.tsx'
import { supabase } from '@/lib/supabaseClient.ts'
import Dialog from '@components/ui/Dialog.tsx'
import Card from '@components/ui/Card.tsx'
import ClipsSection from '@components/clip/ClipsSection.tsx'
import CrosshairsSection from '@components/crosshair/CrosshairsSection.tsx'
import { User, Crosshair, Film, Info, LogOut } from 'lucide-react'

const sectionIds = [
    'myProfile',
    'myCrosshairs',
    'myClips',
    'myPersonalsInformations',
]

const sectionIcons: Record<string, React.ReactNode> = {
    myProfile: <User size={20} />,
    myCrosshairs: <Crosshair size={20} />,
    myClips: <Film size={20} />,
    myPersonalsInformations: <Info size={20} />,
}

const Account = () => {
    const userId = useSession()
    const [loading, setLoading] = useState(true)
    const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo>()
    const routerLocation = useLocation()
    const [activeSection, setActiveSection] = useState<string>('')
    const [openDialogLogout, setOpenDialogLogout] = useState(false)

    useEffect(() => {
        getUserBasicInfo()
            .then((userInfo) => setUserBasicInfo(userInfo))
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
            const y =
                target.getBoundingClientRect().top +
                window.scrollY +
                headerOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
            window.history.replaceState(null, '', `#${id}`)

            setActiveSection(id)
        }
    }

    const handleAnchorClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        e.preventDefault()
        scrollToSection(id)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        location.reload()
    }

    const renderMenuLink = (id: string, icon: React.ReactNode) => {
        const isActive = activeSection === id

        return (
            <Link
                key={id}
                to={`/account/#${id}`}
                onClick={(e) => handleAnchorClick(e, id)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: 'black',
                }}
                onMouseEnter={(e) => {
                    const iconElement =
                        e.currentTarget.querySelector('.menu-icon')
                    if (iconElement)
                        iconElement.setAttribute('style', 'color: red')
                }}
                onMouseLeave={(e) => {
                    const iconElement =
                        e.currentTarget.querySelector('.menu-icon')
                    if (iconElement && !isActive)
                        iconElement.setAttribute('style', 'color: black')
                }}
            >
                <span
                    className="menu-icon"
                    style={{
                        color: isActive ? 'red' : 'black',
                        transition: 'color 0.3s',
                    }}
                >
                    {icon}
                </span>
                <Text style={{ color: 'black', textDecoration: 'none' }}>
                    {i18n[id] ?? id}
                </Text>
            </Link>
        )
    }

    if (loading) return <Loader />

    return (
        <div style={{ display: 'flex', padding: '1rem' }}>
            <div
                style={{
                    height: '50vh',
                    width: '25%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        position: 'fixed',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}
                >
                    <Text size="xl" weight="bold">
                        {i18n.myAccount}
                    </Text>

                    {sectionIds.map((id) =>
                        renderMenuLink(id, sectionIcons[id]),
                    )}

                    <Link
                        to={'/account'}
                        onClick={() => setOpenDialogLogout(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: 'black',
                        }}
                    >
                        <span
                            style={{
                                color: 'black',
                                transition: 'color 0.3s',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color = 'red')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color = 'black')
                            }
                        >
                            <LogOut size={20} />
                        </span>
                        <Text
                            style={{ color: 'black', textDecoration: 'none' }}
                        >
                            {i18n.logout}
                        </Text>
                    </Link>
                </div>
            </div>

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <div id="myProfile">
                    {userBasicInfo && (
                        <ProfileSection
                            userId={userId}
                            userInfos={userBasicInfo}
                        />
                    )}
                </div>

                <div id="myCrosshairs">
                    <Card width="full">
                        <CrosshairsSection userId={userId} />
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
                        <Text size="lg" weight="bold">
                            {i18n.myPersonalsInformations}
                        </Text>
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
