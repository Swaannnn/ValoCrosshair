import { type ChangeEvent } from 'react'
import { smallRadius } from '@constants/sizes.ts'
import { mainGrey, mainRed, mainWhite } from '@constants/colors.ts'

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
                <p style={{ color: mainRed, fontSize: '0.85rem', marginTop: 4 }}>
                    {error}
                </p>
            )}
        </div>
    )
}

export default TextField
