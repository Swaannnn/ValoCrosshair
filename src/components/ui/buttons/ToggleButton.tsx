import { type CSSProperties, type ReactNode, useState } from 'react'
import { darkRed1, lightRed, mainRed, mainWhite } from '@constants/colors.ts'
import { mediumRadius } from '@constants/sizes.ts'

type ToggleButtonProps = {
	selected: boolean
	children: ReactNode
	onClick?: () => void
	endIcon?: ReactNode
}

const getButtonStyle = (
    selected: boolean,
    isHovered: boolean,
    isActive: boolean
): CSSProperties => {
    if (selected) {
        return {
            backgroundColor: isActive ? darkRed1 : isHovered ? lightRed : mainRed,
            color: mainWhite,
	        border: `1px solid ${isActive ? darkRed1 : mainRed}`
        }
    } else {
        return {
            backgroundColor: isActive ? darkRed1 : isHovered ? lightRed : 'transparent',
            color: isHovered ? mainWhite : mainRed,
            border: `1px solid ${isActive ? darkRed1 : mainRed}`
        }
    }
}

const ToggleButton = ({ selected, children, onClick, endIcon }: ToggleButtonProps) => {
    const [isHovered, setHovered] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const buttonStyle = getButtonStyle(selected, isHovered, isActive)

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
                ...buttonStyle
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

export default ToggleButton
