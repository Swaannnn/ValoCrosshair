import { type CSSProperties, type ReactNode, useState } from 'react'
import { darkRed1, lightRed, mainBlack, mainGrey, mainRed, mainWhite } from '@/constants/colors.ts'
import { mediumRadius } from '@/constants/sizes.ts'

type Variant = 'primary' | 'secondary' | 'outlined'

type ButtonProps = {
	variant?: Variant
	children: ReactNode,
	onClick?: () => void,
	endIcon?: ReactNode,
}

const getButtonStyle = (
    variant: Variant,
    isHovered: boolean,
    isActive: boolean
): CSSProperties => {
    switch (variant) {
    case 'primary':
        return {
            backgroundColor: isActive ? darkRed1 : isHovered ? lightRed : mainRed,
            color: mainWhite,
            border: `1px solid ${isActive ? darkRed1 : mainRed}`
        }
    case 'secondary':
        return {
            backgroundColor: isHovered ? mainGrey : '#eaeaea',
            color: mainBlack,
            border: `1px solid ${isHovered ? mainGrey : '#eaeaea'}`
        }
    case 'outlined':
        return {
            backgroundColor: isActive ? darkRed1 : isHovered ? lightRed : 'transparent',
            color: isHovered ? mainWhite : mainRed,
            border: `1px solid ${isActive ? darkRed1 : mainRed}`
        }
    default:
        return {}
    }
}

const Button = ({ variant = 'primary', children, onClick, endIcon }: ButtonProps) => {
    const [isHovered, setHovered] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const variantStyle = getButtonStyle(variant, isHovered, isActive)

    return (
        <button
            onClick={onClick}
            style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: mediumRadius,
                padding: '0.3rem 1rem',
                transition: 'all 150ms ease-in-out',
                fontWeight: 600,
                fontFamily: '"Open Sans", sans-serif',
                ...variantStyle
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseDown={() => setIsActive(true)}
            onMouseLeave={() => {
                setHovered(false)
                setIsActive(false)
            }}
            onMouseUp={() => setIsActive(false)}
        >
            {children} {endIcon}
        </button>
    )
}

export default Button
