import { type CSSProperties, type ReactNode, useState } from 'react'
import { darkRed1, lightRed, mainBlack, mainGrey, mainRed, mainWhite } from '@constants/colors.ts'
import { mediumRadius } from '@constants/sizes.ts'
import Text from '@components/ui/Text.tsx'

type Variant = 'primary' | 'secondary' | 'outlined' | 'text' | 'textDelete'

type ButtonProps = {
	variant?: Variant,
	children: ReactNode,
	onClick?: () => void,
	startIcon?: ReactNode,
	endIcon?: ReactNode,
    fullWidth?: boolean,
    loading?: boolean,
}

const getButtonStyle = (
    variant: Variant,
    isHovered: boolean,
    isActive: boolean,
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
    case 'text':
        return {
            backgroundColor: isHovered ? mainGrey : mainWhite,
            border: 'none'
        }
    case 'textDelete':
        return {
            backgroundColor: isHovered ? lightRed : mainWhite,
            color: isHovered ? mainWhite : mainBlack,
            border: 'none'
        }
    default:
        return {}
    }
}

const spinnerStyle = {
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #333',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    animation: 'spin 0.8s linear infinite',
}

const Button = ({
    variant = 'primary',
    children,
    onClick,
    startIcon,
    endIcon,
    fullWidth = false,
    loading = false
}: ButtonProps) => {
    const [isHovered, setHovered] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const variantStyle = getButtonStyle(variant, isHovered, isActive)

    const fullWidthStyle: CSSProperties = {
        width: fullWidth ? '100%' : 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return (
        <button
            onClick={onClick}
            style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                borderRadius: mediumRadius,
                padding: '0.3rem 1rem',
                transition: 'all 150ms ease-in-out',
                ...(fullWidth ? fullWidthStyle : {}),
                ...variantStyle
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseDown={() => setIsActive(true)}
            onMouseLeave={() => {
                setHovered(false)
                setIsActive(false)
            }}
            onMouseUp={() => setIsActive(false)}
            disabled={loading}
        >
            {loading ? (
                <div style={spinnerStyle} />
            ) : (
                <Text color='inherit'>
                    {startIcon} {children} {endIcon}
                </Text>
            )}
        </button>
    )
}

export default Button
