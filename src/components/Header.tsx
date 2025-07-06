import { Link } from 'react-router-dom'
import { lightRed, mainWhite } from '@/constants/colors.ts'
import i18n from '@/simple-react-i18n.ts'
import { useSession } from '@/features/auth/useSession.ts'
import { headerHeight } from '@constants/sizes.ts'

const buttonHeaderStyle = {
    textDecoration: 'none',
    color: mainWhite,
    fontSize: '1.5rem',
    fontWeight: 'bold',
}

const Header = () => {
    const userId = useSession()

    return (
        <header
            style={{
                height: headerHeight,
                padding: '0 1rem',
                backgroundColor: lightRed,

                width: '100%',
                position: 'fixed',
                zIndex: 1000,
            }}
        >
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to='/' style={buttonHeaderStyle}>{i18n.home}</Link>
                    <Link to='/about' style={buttonHeaderStyle}>{i18n.about}</Link>
                </div>
                {userId ? (
                    <Link to='/account' style={buttonHeaderStyle}>{i18n.account}</Link>
                ) : (
                    <Link to='/login' style={buttonHeaderStyle}>{i18n.login}</Link>
                )}

            </nav>
        </header>
    )
}

export default Header
