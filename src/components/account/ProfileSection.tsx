import i18n from '@/simple-react-i18n.ts'
import Card from '@components/Card.tsx'
import type { Profile } from '@/types/profile.ts'
import ProgressBar from '@components/ProgressBar.tsx'
import DefaultBanner from '@/assets/images/default_banner.png'
import { mainWhite } from '@constants/colors.ts'
import { avatarHeight, bannerHeight } from '@constants/sizes.ts'
import Text from '@components/Text.tsx'
import type { UserBasicInfo } from '@/types/user'
import { formatDateToLong } from '@utils/date.ts'
import { supabase } from '@/lib/supabaseClient.ts'
import Button from '@components/Button.tsx'

type ProfileSectionProps = {
    profile: Profile | null
    userInfos: UserBasicInfo | undefined
}

const ProfileSection = ({ profile, userInfos }: ProfileSectionProps) => {
    const handleLogout = async () => {
        await supabase.auth.signOut()
        location.reload()
    }

    return (
        <Card width="full">
            <h2>{i18n.myProfile}</h2>
            <div style={{ paddingTop: '0.5rem' }}>
                {!profile || !userInfos ? (
                    <ProgressBar title='Chargement du profil en cours...' />
                ) : (
                    <>
                        <div style={{ position: 'relative' }}>
                            <img src={DefaultBanner} height={bannerHeight} width="100%" alt="user banner" />
                            {profile.avatar_url &&
                                <img
                                    src={profile.avatar_url}
                                    height={avatarHeight} width={avatarHeight}
                                    alt="user avatar"
                                    style={{
                                        border: `solid 4px ${mainWhite}`,
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: `calc(${bannerHeight} - (${avatarHeight} / 1.5))`,
                                        left: '1rem'
                                    }}
                                />
                            }
                            <div
                                style={{
                                    padding: `1rem 0 0 calc(${avatarHeight} + 1rem)`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div style={{  }}>
                                    {profile.full_name && (
                                        <Text size="lg" weight="bold">
                                            {profile.full_name}
                                        </Text>
                                    )}
                                    {userInfos.created_at && <Text>Membre depuis : {formatDateToLong(userInfos.created_at)}</Text>}
                                </div>
                                <Button variant='secondary' onClick={handleLogout}>Se déconnecter</Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Card>
    )
}

export default ProfileSection
