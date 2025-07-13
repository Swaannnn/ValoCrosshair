import React, { type ReactNode, type MouseEvent } from 'react'
import { Link as RouterLink } from 'react-router-dom'

type LinkProps = {
    to: string
    children: ReactNode
    animated?: boolean
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
    onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void
    onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void
    style?: React.CSSProperties
}

const Link = ({
    to,
    children,
    animated,
    onClick = () => {},
    onMouseEnter,
    onMouseLeave,
    style,
}: LinkProps) => (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <RouterLink
            to={to}
            onClick={onClick}
            className={animated ? 'animated-link' : 'no-animation'}
            style={style}
        >
            {children}
        </RouterLink>
    </div>
)

export default Link
