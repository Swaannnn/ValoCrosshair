import { type ReactNode, useEffect, useState } from 'react'
import { mainWhite, mainBlack, mainGrey } from '@/constants/colors'
import { mediumRadius } from '@/constants/sizes.ts'

type ToastProps = {
	children: ReactNode
	onClose: () => void
	duration?: number
}

const Toast = ({ children, onClose, duration = 3000 }: ToastProps) => {
    const [disappearing, setDisappearing] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setDisappearing(true), duration)
        const cleanup = setTimeout(onClose, duration + 300)
        return () => {
            clearTimeout(timer)
            clearTimeout(cleanup)
        }
    }, [onClose, duration])

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: mainWhite,
                color: mainBlack,
                padding: '1rem 1.5rem',
                borderRadius: mediumRadius,
                boxShadow: `0 6px 12px ${mainGrey}`,
                transition: 'opacity 300ms ease, transform 300ms ease',
                opacity: disappearing ? 0 : 1,
                transform: disappearing ? 'translateY(30px)' : 'translateY(0)',
            }}
        >
            {children}
        </div>
    )
}

export default Toast
