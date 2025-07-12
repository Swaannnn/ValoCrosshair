import Text from '@components/Text.tsx'
import i18n from '@/simple-react-i18n.ts'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import TextField from '@components/TextField.tsx'
import type { Crosshair } from '@/types/types.ts'
import ProgressBar from '@components/ProgressBar.tsx'
import Dialog from '@components/Dialog.tsx'
import CrosshairItem from '@components/crosshair/CrosshairItem.tsx'
import { mediumRadius } from '@constants/sizes.ts'
import { addCrosshair, getUserCrosshairs } from '@utils/db/crosshairs.ts'
import { mainBlack80, mainGrey } from '@constants/colors.ts'

type CrosshairsSectionProps = {
    userId: string | null
}

const CrosshairsSection = ({ userId }: CrosshairsSectionProps) => {
    const [crosshairs, setCrosshairs] = useState<Crosshair[]>([])
    const [loading, setLoading] = useState(false)
    const [crosshairName, setCrosshairName] = useState('')
    const [crosshairNameError, setCrosshairNameError] = useState('')
    const [crosshairImage, setCrosshairImage] = useState('')
    const [crosshairImageError, setCrosshairImageError] = useState('')
    const [crosshairCode, setCrosshairCode] = useState('')
    const [crosshairCodeError, setCrosshairCodeError] = useState('')
    const [openNewCrosshair, setOpenNewCrosshair] = useState(false)
    const [isAddCrosshairHovered, setIsAddCrosshairHovered] = useState(false)

    useEffect(() => {
        if (!userId) return
        setLoading(true)
        getUserCrosshairs(userId).then((data) => {
            if (data) setCrosshairs(data)
            setLoading(false)
        })
    }, [userId])

    const handleAddCrosshair = async () => {
        let hasError = false
        setCrosshairNameError('')
        setCrosshairImageError('')
        setCrosshairCodeError('')

        if (!crosshairName.trim()) {
            setCrosshairNameError(i18n.crosshairNameRequired)
            hasError = true
        }
        if (!crosshairImage.trim()) {
            setCrosshairImageError(i18n.crosshairImageRequired)
            hasError = true
        }
        if (!crosshairCode.trim()) {
            setCrosshairCodeError(i18n.crosshairCodeRequired)
            hasError = true
        }

        if (hasError) return

        setLoading(true)
        const { id, error } = await addCrosshair(crosshairCode.trim(), crosshairName.trim(), crosshairImage, 'user')

        if (error) {
            alert(i18n.unableAddNewCrosshair)
            setLoading(false)
            return
        }

        if (userId) {
            setCrosshairs(prev => [
                ...prev,
                {
                    name: crosshairName.trim(),
                    image_url: crosshairImage,
                    code: crosshairCode.trim(),
                    category: 'user',
                    id: id,
                    user_id: userId,
                    created_at: new Date().toISOString(),
                }
            ])
        }

        setLoading(false)
        setOpenNewCrosshair(false)
        setCrosshairName('')
        setCrosshairImage('')
        setCrosshairCode('')
    }


    const handleDeleteCrosshairFromList = (id: string) => {
        setCrosshairs((prev) => prev.filter(crosshair => crosshair.id !== id))
    }

    return (
        <div>
            <Text size="lg" weight="bold">{i18n.myCrosshairs}</Text>
            <Text color={mainBlack80}>{(i18n.myCrosshairsText)}</Text>
            <div style={{ paddingTop: '1rem' }}>
                {loading ? (
                    <ProgressBar title={i18n.loadingCrosshairs} />
                ) : (
                    <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {crosshairs.map((crosshair) => (
                                <div key={crosshair.id}>
                                    <CrosshairItem
                                        id={crosshair.id}
                                        data={{ code: crosshair.code, name: crosshair.name, image: crosshair.image_url, type: 'user' }}
                                        onDelete={handleDeleteCrosshairFromList}
                                    />
                                </div>
                            ))}
                            {crosshairs.length < 10 && (
                                <div
                                    style={{
                                        height: '258px',
                                        width: '196px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        borderRadius: mediumRadius,
                                        background: isAddCrosshairHovered ? mainGrey : 'inherit',
                                        transition: 'background-color 0.3s ease-in-out',
                                    }}
                                    onMouseEnter={() => setIsAddCrosshairHovered(true)}
                                    onMouseLeave={() => setIsAddCrosshairHovered(false)}
                                    onClick={() => setOpenNewCrosshair(true)}
                                >
                                    <CirclePlus size={64} />
                                    <Text>{i18n.addCrosshair}</Text>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            {openNewCrosshair && (
                <Dialog
                    title={i18n.addNewCrosshair}
                    buttonText={i18n.addCrosshair}
                    onButtonClick={handleAddCrosshair}
                    secondaryButtonText={i18n.cancel}
                    onSecondaryButtonClick={() => {
                        setOpenNewCrosshair(false)
                        setCrosshairName('')
                        setCrosshairNameError('')
                        setCrosshairCode('')
                        setCrosshairCodeError('')
                        setCrosshairImage('')
                        setCrosshairImageError('')
                    }}
                    horizontalButtons
                >
                    <Text>{i18n.addCrosshairInstructions}</Text>
                    <TextField
                        label={i18n.crosshairName}
                        placeholder={i18n.crosshairNamePlaceholder}
                        value={crosshairName}
                        onChange={(e) => {
                            setCrosshairName(e.target.value)
                            setCrosshairNameError('')
                        }}
                        error={crosshairNameError}
                    />
                    <TextField
                        label={i18n.crosshairCode}
                        placeholder={i18n.crosshairCodePlaceholder}
                        value={crosshairCode}
                        onChange={(e) => {
                            setCrosshairCode(e.target.value)
                            setCrosshairCodeError('')
                        }}
                        error={crosshairCodeError}
                    />
                    <TextField
                        label={i18n.crosshairImage}
                        value={crosshairImage}
                        onChange={(e) => {
                            setCrosshairImage(e.target.value)
                            setCrosshairImageError('')
                        }}
                        error={crosshairImageError}
                    />
                </Dialog>
            )}
        </div>
    )
}

export default CrosshairsSection
