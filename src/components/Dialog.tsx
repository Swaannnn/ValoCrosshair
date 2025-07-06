import Text from '@components/Text.tsx'
import Button from '@components/Button.tsx'
import i18n from '@/simple-react-i18n.ts'
import { mainWhite } from '@constants/colors.ts'
import { mediumRadius } from '@constants/sizes.ts'

type DialogProps = {
    title: string,
    content: string,
    onButtonClick: () => void,
    buttonText: string,
    onClose?: () => void,
}

const Dialog = ({ title, content, onButtonClick, buttonText, onClose }: DialogProps) => {
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
            }}
        >
            <div
                style={{
                    backgroundColor: mainWhite,
                    padding: '1rem',
                    borderRadius: mediumRadius,

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <Text size='lg' weight='bold'>{title}</Text>
                <Text>{content}</Text>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Button onClick={onButtonClick}>
                        {buttonText}
                    </Button>
                    {onClose &&
                        <Button variant='outlined' onClick={onClose}>
                            {i18n.close}
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Dialog
