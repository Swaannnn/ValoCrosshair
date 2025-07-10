import { useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient.ts'
import Button from '@components/Button.tsx'
import TextField from '@components/TextField.tsx'
import Text from '@components/Text.tsx'
import { redError, lightGrey, greenValidation } from '@constants/colors.ts'
import { useNavigate } from 'react-router-dom'
import i18n from '@/simple-react-i18n.ts'
import { headerHeight } from '@constants/sizes.ts'
import Card from '@components/Card.tsx'
import Dialog from '@components/Dialog.tsx'

const ResetPasswordConfirm = () => {
    const navigate = useNavigate()

    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordConfirmError, setPasswordConfirmError] = useState('')
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const validatePassword = () => {
        let valid = true
        setPasswordError('')
        setPasswordConfirmError('')

        if (password.length < 6) {
            setPasswordError(i18n.passwordTooShort)
            valid = false
        }

        if (passwordConfirm.length < 6) {
            setPasswordConfirmError(i18n.passwordTooShort)
            valid = false
        }

        if (password !== passwordConfirm) {
            setPasswordError(i18n.passwordsDoNotMatch)
            setPasswordConfirmError(i18n.passwordsDoNotMatch)
            valid = false
        }
        return valid
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setMessage('')
        if (!validatePassword()) return

        setLoading(true)

        const { error } = await supabase.auth.updateUser({ password })

        setLoading(false)

        if (error) {
            setErrorMessage(error.message)
        } else {
            setOpenDialog(true)
            // TODO: faire une pop up avec bouton 'se connecter' qui redirige vers login
            // setTimeout(() => {
            //     navigate('/login')
            // }, 3000)
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

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <TextField
                            label={i18n.newPassword}
                            type="password"
                            placeholder={i18n.passwordPlaceholder}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError('')
                                setMessage('')
                                setErrorMessage('')
                            }}
                            error={passwordError}
                        />

                        <TextField
                            label={i18n.confirmPassword}
                            type="password"
                            placeholder={i18n.passwordPlaceholder}
                            value={passwordConfirm}
                            onChange={(e) => {
                                setPasswordConfirm(e.target.value)
                                setPasswordConfirmError('')
                                setMessage('')
                                setErrorMessage('')
                            }}
                            error={passwordConfirmError}
                        />

                        {errorMessage && <Text size="sm" color={redError}>{errorMessage}</Text>}
                        {message && <Text size="sm" color={greenValidation}>{message}</Text>}
                    </div>

                    <div style={{ paddingTop: '1.5rem' }}>
                        <Button variant="secondary" fullWidth loading={loading}>
                            {i18n.updatePassword}
                        </Button>
                    </div>
                </form>
            </Card>
            {openDialog &&
                <Dialog
                    title={i18n.passwordSuccesfullyUpdated}
                    onButtonClick={() => {
                        navigate('/login')
                        setOpenDialog(false)
                    }}
                    buttonText={i18n.login}
                >
                    {i18n.passwordSuccesfullyUpdatedcontent}
                </Dialog>
            }
        </div>
    )
}

export default ResetPasswordConfirm
