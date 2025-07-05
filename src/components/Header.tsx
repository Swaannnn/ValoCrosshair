import { Link } from 'react-router-dom'
import { lightRed, mainBlack, mainGrey } from '@/constants/colors.ts'
import i18n from '@/simple-react-i18n.ts'

const buttonHeaderStyle = {
    textDecoration: 'none',
    color: mainBlack,
    fontSize: '1.5rem',
    fontWeight: 'bold',
}

const Header = () => {
    return (
        <header
            style={{
                height: '64px',
                padding: '0 1rem',
                backgroundColor: lightRed,
                boxShadow: `0 4px 10px ${mainGrey}`,
            }}
        >
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to='/' style={buttonHeaderStyle}>{i18n.home}</Link>
                    <Link to='/about' style={buttonHeaderStyle}>{i18n.about}</Link>
                </div>
                <Link to='/account' style={buttonHeaderStyle}>{i18n.account}</Link>
            </nav>
        </header>
    )
}

export default Header
