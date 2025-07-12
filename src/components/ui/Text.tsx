import type { CSSProperties, ReactNode } from 'react'
import { mainBlack } from '@constants/colors.ts'

type TextProps = {
    children: ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    weight?: 'normal' | 'medium' | 'bold';
    color?: string;
    style?: CSSProperties;
}

const Text = ({ children, size = 'md', weight = 'normal', color = mainBlack, style }: TextProps) => {
    const fontSize = {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
    }[size]

    return (
        <span
            style={{
                fontSize,
                fontWeight: weight,
                color,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                ...style,
            }}
        >
            {children}
        </span>
    )
}

export default Text
