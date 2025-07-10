import Text from '@components/Text.tsx'
import Button from '@components/Button.tsx'
import { mainWhite } from '@constants/colors.ts'
import { mediumRadius } from '@constants/sizes.ts'
import React, { useEffect, useRef } from 'react'

type DialogProps = {
    title: string,
    children: React.ReactNode,
    buttonText: string,
    onButtonClick: () => void,
    secondaryButtonText?: string,
    onSecondaryButtonClick?: () => void,
    horizontalButtons?: boolean,
}

const Dialog = ({
    title,
    children,
    buttonText,
    onButtonClick,
    secondaryButtonText,
    onSecondaryButtonClick,
    horizontalButtons = false,
}: DialogProps) => {
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dialogRef.current &&
                !dialogRef.current.contains(event.target as Node)
            ) {
                onSecondaryButtonClick?.()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onSecondaryButtonClick])

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
            }}
        >
            <div
                ref={dialogRef}
                style={{
                    backgroundColor: mainWhite,
                    padding: '1rem',
                    borderRadius: mediumRadius,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    zIndex: 10000,
                }}
            >
                <Text size='lg' weight='bold'>{title}</Text>
                {children}
                <div style={{
                    display: 'flex',
                    flexDirection: horizontalButtons ? 'row' : 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Button onClick={onButtonClick}>
                        {buttonText}
                    </Button>
                    {secondaryButtonText &&
                        <Button variant='outlined' onClick={onSecondaryButtonClick}>
                            {secondaryButtonText}
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Dialog
