import type { ReactNode } from 'react'
import { mainGrey, mainWhite } from '@constants/colors.ts'
import { mediumRadius } from '@constants/sizes.ts'

type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

type CardProps = {
    children: ReactNode
    width?: CardSize
}

const cardWidthMap: Record<CardSize, string> = {
    xs: '200px',
    sm: '300px',
    md: '400px',
    lg: '600px',
    xl: '800px',
    full: '100%',
}

const Card = ({ children, width = 'full' }: CardProps) => {
    const cardWidth = cardWidthMap[width] ?? '100%'
    return (
        <div
            style={{
                backgroundColor: mainWhite,
                padding: '1rem',
                borderRadius: mediumRadius,
                boxShadow: `0 4px 10px ${mainGrey}`,
                width: cardWidth,
            }}
        >
            {children}
        </div>
    )
}

export default Card
