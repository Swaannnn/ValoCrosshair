import Text from '@components/ui/Text.tsx'
import { darkGrey, mainGrey } from '@constants/colors.ts'

type ProgressBarProps = {
    title?: string
}

const ProgressBar = ({ title }: ProgressBarProps) => {
    return (
        <div style={{ width: '100%' }}>
            {title && (
                <div style={{ marginBottom: '0.5rem' }}>
                    <Text weight="bold">{title}</Text>
                </div>
            )}
            <div
                style={{
                    position: 'relative',
                    height: '6px',
                    backgroundColor: mainGrey,
                    borderRadius: '999px',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '30%',
                        backgroundColor: darkGrey,
                        borderRadius: '999px',
                        animation: 'smoothProgress 2s ease-in-out infinite',
                    }}
                />
            </div>
        </div>
    )
}

export default ProgressBar
