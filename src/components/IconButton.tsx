import { useState, type ReactNode } from 'react'
import { roundedRadius } from '@constants/sizes.ts'
import { lightGrey, mainGrey, mainWhite } from '@constants/colors.ts'

type IconButtonProps = {
	size?: string,
    variant?: 'primary' | 'light',
	children?: ReactNode,
	onClick?: () => void,
}

const IconButton = ({ children, variant = 'primary', size, onClick }: IconButtonProps) => {
    const [isHovered, setIsHovered] = useState(false)

    const primary = variant === 'primary'
    let backgroundColor = mainWhite
    if (isHovered) backgroundColor = primary ? mainGrey : lightGrey

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

                backgroundColor,
                border: primary ? `1px solid ${mainGrey}` : undefined,
                borderRadius: roundedRadius,
                cursor: 'pointer',

                height: size,
                width: size,

                transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
        >
            {children}
        </div>
    )
}

export default IconButton
