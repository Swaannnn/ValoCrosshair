import { type ChangeEvent } from 'react'

interface FileSelectorProps {
	label: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	error?: string
	fileName?: string
}

const FileSelector = ({ label, onChange, error, fileName }: FileSelectorProps) => {
    return (
        <div>
            <label
                htmlFor={label}
                style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}
            >
                {label}
            </label>

            <label
                htmlFor={`file-input-${label}`}
                style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f1f1f1',
                    border: `1px solid ${error ? '#e63946' : '#ccc'}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                }}
            >
                📁 Choisir un fichier
            </label>

            <input
                id={`file-input-${label}`}
                type="file"
                onChange={onChange}
                style={{ display: 'none' }}
            />

            {fileName && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                    Fichier sélectionné : <strong>{fileName}</strong>
                </p>
            )}

            {error && (
                <p style={{ color: '#e63946', fontSize: '0.85rem', marginTop: 4 }}>
                    {error}
                </p>
            )}
        </div>
    )
}

export default FileSelector
