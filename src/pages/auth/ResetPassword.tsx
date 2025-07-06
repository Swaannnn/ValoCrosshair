import { useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient.ts'
import Button from '@components/Button.tsx'
import TextField from '@components/TextField.tsx'
import Text from '@components/Text.tsx'
import { greenValidation, lightGrey } from '@constants/colors.ts'
import { validateEmail } from '@utils/email.ts'
import i18n from '@/simple-react-i18n.ts'
import { headerHeight } from '@constants/sizes.ts'
import Card from '@components/Card.tsx'

const ResetPassword = () => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setMessage('')
        setEmailError('')

        if (!email) {
            setEmailError(i18n.emailRequired)
            return
        }

        if (!validateEmail(email)) {
            setEmailError(i18n.invalidEmail)
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/resetPasswordConfirm`
        })

        setLoading(false)

        if (error) {
            setMessage(error.message)
        } else {
            setMessage(i18n.passwordResetEmailSent)
        }
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
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ textAlign: 'center', paddingBottom: '2rem' }}>{i18n.resetPassword}</h2>

                    <TextField
                        label={i18n.email}
                        placeholder={i18n.emailPlaceholder}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setEmailError('')
                            setMessage('')
                        }}
                        error={emailError}
                        required
                    />

                    {message && (
                        <div style={{ paddingTop: '0.5rem' }}>
                            <Text size="sm" color={greenValidation}>
                                {message}
                            </Text>
                        </div>
                    )}

                    <div style={{ paddingTop: '1.5rem' }}>
                        <Button variant="secondary" fullWidth loading={loading}>
                            {i18n.sendResetPassword}
                        </Button>
                    </div>

                </form>
            </Card>
        </div>
    )
}

export default ResetPassword
