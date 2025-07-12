import type { ReactNode, MouseEvent } from 'react'
import { Link as RouterLink } from 'react-router-dom'

type LinkProps = {
    to: string,
    children: ReactNode,
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

const Link = ({ to, children, onClick = () => {} }: LinkProps) => (
    <div>
        <RouterLink
            to={to}
            onClick={onClick}
            className="animated-link"
        >
            {children}
        </RouterLink>
    </div>
)

export default Link
