import { type FormEvent, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { greenValidation, lightGrey, redError } from '@constants/colors.ts'
import { headerHeight } from '@constants/sizes.ts'
import Card from '@components/ui/Card.tsx'
import i18n from '@/simple-react-i18n.ts'
import TextField from '@components/ui/inputs/TextField.tsx'
import Text from '@components/ui/Text.tsx'
import Link from '@components/ui/Link.tsx'
import Button from '@components/ui/buttons/Button.tsx'
import { validateEmail } from '@utils/email.ts'

const Register = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session) navigate('/account')
        }
        checkSession()
    })

    const handleEmailRegister = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage('')
        setSuccessMessage('')

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

        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setErrorMessage(error.message)
            setLoading(false)
            return
        }

        setSuccessMessage('Inscription réussie ! Vérifiez votre boîte mail pour confirmer votre compte.')
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
                <form onSubmit={handleEmailRegister} style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ textAlign: 'center', paddingBottom: '2rem' }}>{i18n.register}</h2>

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

                    {errorMessage && (
                        <div style={{ paddingTop: '0.5rem' }}>
                            <Text size="sm" color={redError}>
                                {errorMessage}
                            </Text>
                        </div>
                    )}

                    {successMessage && (
                        <div style={{ paddingTop: '0.5rem' }}>
                            <Text size="sm" color={greenValidation}>
                                {successMessage}
                            </Text>
                        </div>
                    )}

                    <div style={{
                        padding: '1.5rem 0'
                    }}>
                        <Button variant="secondary" fullWidth loading={loading}>
                            {i18n.register}
                        </Button>
                    </div>
                </form>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Text size="sm">
                        Déjà un compte ? <Link to="/login">Connectez-vous ici</Link>
                    </Text>
                </div>
            </Card>
        </div>
    )
}

export default Register
