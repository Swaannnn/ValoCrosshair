import { type ChangeEvent } from 'react'
import { smallRadius } from '@constants/sizes.ts'
import { mainGrey, mainRed, mainWhite } from '@constants/colors.ts'
import Text from '@components/ui/Text.tsx'

interface TextFieldProps {
    label: string
    type?: 'text' | 'password'
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    error?: string
    placeholder?: string
}

const TextField = ({ label, type = 'text', value, onChange, error, placeholder }: TextFieldProps) => {
    return (
        <div style={{ width: '100%' }}>
            <label
                htmlFor={label}
                style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', cursor: 'text' }}
            >
                {label}
            </label>

            <input
                name={label}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: smallRadius,
                    border: `1px solid ${error ? mainRed : mainGrey}`,
                    backgroundColor: mainWhite,
                }}
            />

            {error && (
                <Text color={mainRed} size='sm' style={{ marginTop: '0.5rem' }}>
                    {error}
                </Text>
            )}
        </div>
    )
}

export default TextField
