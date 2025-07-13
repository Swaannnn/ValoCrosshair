import { type ChangeEvent, useRef } from 'react'
import type { ReactNode } from 'react'

type FileUploaderProps = {
    action: (file: File) => void
    children: ReactNode
}

const FileUploader = ({ action, children }: FileUploaderProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) action(file)
        e.target.value = ''
    }

    return (
        <div
            style={{ display: 'inline-block', cursor: 'pointer' }}
            onClick={handleClick}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleChange}
            />
            {children}
        </div>
    )
}

export default FileUploader
