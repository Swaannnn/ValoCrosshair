import { type ReactNode, useState } from 'react'
import { mainBlack, mainGrey, mainWhite } from '@constants/colors.ts'
import { smallRadius } from '@constants/sizes.ts'

type TooltipProps = {
    children: ReactNode
    content: string
    color?: 'black' | 'white'
    position?:
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
}

const Tooltip = ({
    children,
    content,
    color = 'white',
    position = 'top',
}: TooltipProps) => {
    const [visible, setVisible] = useState(false)

    const getPositionStyle = () => {
        const base = {
            position: 'absolute' as const,
            backgroundColor: color === 'white' ? mainWhite : mainBlack,
            color: color === 'white' ? mainBlack : mainWhite,
            padding: '6px 10px',
            border: `1px solid ${color === 'white' ? mainGrey : mainBlack}`,
            borderRadius: smallRadius,
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 999,
        }

        switch (position) {
        case 'bottom':
            return {
                ...base,
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '0.5rem',
            }
        case 'bottom-left':
            return { ...base, top: '100%', right: '0', marginTop: '0.5rem' }
        case 'bottom-right':
            return { ...base, top: '100%', left: '0', marginTop: '0.5rem' }
        case 'top':
            return {
                ...base,
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '0.5rem',
            }
        case 'top-left':
            return {
                ...base,
                bottom: '100%',
                right: '0',
                marginBottom: '0.5rem',
            }
        case 'top-right':
            return {
                ...base,
                bottom: '100%',
                left: '0',
                marginBottom: '0.5rem',
            }
        case 'left':
            return {
                ...base,
                right: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                marginRight: '0.5rem',
            }
        case 'right':
            return {
                ...base,
                left: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                marginLeft: '0.5rem',
            }
        default:
            return base
        }
    }

    return (
        <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...getPositionStyle(),
                    }}
                >
                    {content.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Tooltip
