import { type ChangeEvent } from 'react'

interface TextFieldProps {
    label: string
    type?: 'text' | 'password'
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    error?: string
    placeholder?: string
    required?: boolean
}

const TextField = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
}: TextFieldProps) => {
    return (
        <div>
            <label
                htmlFor={label}
                style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}
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
                    borderRadius: 4,
                    border: `1px solid ${error ? '#e63946' : '#ccc'}`,
                    backgroundColor: '#fff',
                }}
            />

            {error && (
                <p style={{ color: '#e63946', fontSize: '0.85rem', marginTop: 4 }}>
                    {error}
                </p>
            )}
        </div>
    )
}

export default TextField
