import i18n from '@/simple-react-i18n.ts'
import { supabase } from '@/lib/supabaseClient.ts'
import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@components/Button.tsx'
import TextField from '@components/TextField.tsx'
import { validateEmail } from '@utils/email.ts'
import Link from '@components/Link.tsx'
import Text from '@components/Text.tsx'
import { lightGrey, redError } from '@constants/colors.ts'
import { headerHeight } from '@constants/sizes.ts'
import Card from '@components/Card.tsx'
import DiscordIcon from '@/assets/images/discord.svg'
import GoogleIcon from '@/assets/images/google.svg'
import GithubIcon from '@/assets/images/github.svg'

const Login = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session) navigate('/account')
        }
        checkSession()
    })

    const handleOAuthLogin = async (provider: 'google' | 'github' | 'discord') => {
        setLoading(true)
        setErrorMessage('')
        const { error } = await supabase.auth.signInWithOAuth({ provider })
        if (error) setErrorMessage(error.message)
        setLoading(false)
    }

    const handleEmailLogin = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage('')
        setEmailError('')
        setPasswordError('')

        let hasError = false

        if (!email) {
            setEmailError(i18n.emailRequired)
            hasError = true
        } else if (!validateEmail(email)) {
            setEmailError(i18n.invalidEmail)
            hasError = true
        }

        if (!password) {
            setPasswordError(i18n.passwordRequired)
            hasError = true
        } else if (password.length < 6) {
            setPasswordError(i18n.passwordTooShort)
            hasError = true
        }

        if (hasError) {
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setErrorMessage(i18n.invalidCredentials)
        } else {
            navigate('/account')
        }

        setLoading(false)
    }

    return (
        <div
            style={{
                backgroundColor: lightGrey,
                minHeight: `calc(100vh - ${headerHeight})`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Card width='lg'>
                <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ textAlign: 'center', paddingBottom: '2rem' }}>{i18n.login}</h2>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}>
                        <TextField
                            label={i18n.email}
                            placeholder={i18n.emailPlaceholder}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError('')
                            }}
                            error={emailError}
                        />

                        <TextField
                            label={i18n.password}
                            placeholder={i18n.passwordPlaceholder}
                            value={password}
                            type="password"
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError('')
                            }}
                            error={passwordError}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <Text size="sm">
                            <Link to="/resetPassword">{i18n.forgotPassword}</Link>
                        </Text>
                    </div>

                    {errorMessage && (
                        <Text size="sm" color={redError}>
                            {errorMessage}
                        </Text>
                    )}

                    <div style={{
                        padding: '1.5rem 0'
                    }}>
                        <Button variant="secondary" fullWidth loading={loading}>
                            {i18n.login}
                        </Button>
                    </div>
                </form>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <Text>{i18n.or}</Text>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button variant="secondary" onClick={() => handleOAuthLogin('discord')}>
                            <img src={DiscordIcon} alt="Discord" width="24px" height="24px" />
                        </Button>
                        <Button variant="secondary" onClick={() => handleOAuthLogin('github')}>
                            <img src={GithubIcon} alt="Github" width="24px" height="24px" />
                        </Button>
                        <Button variant="secondary" onClick={() => handleOAuthLogin('google')}>
                            <img src={GoogleIcon} alt="Google" width="24px" height="24px" />
                        </Button>
                    </div>

                    <Text size="sm">
                        Pas de compte ? <Link to="/register">Inscrivez-vous ici</Link>
                    </Text>
                </div>
            </Card>
        </div>
    )
}

export default Login
