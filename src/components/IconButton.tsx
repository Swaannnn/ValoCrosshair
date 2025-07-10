import { useState, type ReactNode } from 'react'
import { roundedRadius } from '@constants/sizes.ts'
import { mainGrey, mainWhite } from '@constants/colors.ts'

type IconButtonProps = {
	size?: string,
	children?: ReactNode,
	onClick?: () => void,
}

const IconButton = ({ children, size, onClick }: IconButtonProps) => {
    const [isHovered, setIsHovered] = useState(false)

    let backgroundColor = mainWhite
    if (isHovered) backgroundColor = mainGrey

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
                border: `1px solid ${mainGrey}`,
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
