import React, { useState } from 'react'
import { uploadToSupabase, deleteFromSupabase } from '@/utils/uploadToSupabase'

interface FileUploaderProps {
    userId: string
    type: 'avatar' | 'banner'
    initialUrl?: string
    onUpload: (url: string | null) => void
}

const FileUploader = ({ userId, type, initialUrl, onUpload }: FileUploaderProps) => {
    const [uploading, setUploading] = useState(false)
    const [currentUrl, setCurrentUrl] = useState(initialUrl || '')

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)

        // Passe le compteur pour renommer
        const url = await uploadToSupabase(file, userId, type)
        setUploading(false)

        if (url) {
            setCurrentUrl(url)
            onUpload(url)
        } else {
            alert('Erreur lors de l’upload')
        }
    }

    const handleDelete = async () => {
        const confirmed = confirm('Supprimer cette image ?')
        if (!confirmed) return

        setUploading(true)
        const success = await deleteFromSupabase(userId, type)
        setUploading(false)

        if (success) {
            setCurrentUrl('')
            onUpload(null)
        } else {
            alert('Erreur lors de la suppression')
        }
    }

    return (
        <div>
            <label>
                Upload {type} :
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
            </label>
            {currentUrl && (
                <div>
                    <img
                        src={currentUrl}
                        alt={`${type}`}
                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <button onClick={handleDelete} disabled={uploading}>
                        Supprimer
                    </button>
                </div>
            )}
        </div>
    )
}

export default FileUploader
