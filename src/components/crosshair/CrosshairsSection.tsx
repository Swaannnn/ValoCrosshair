import { useEffect, useState } from 'react'
import { CirclePlus } from 'lucide-react'
import i18n from '@/simple-react-i18n.ts'
import type { Crosshair } from '@/types/types.ts'
import Text from '@components/ui/Text.tsx'
import TextField from '@components/ui/inputs/TextField.tsx'
import ProgressBar from '@components/ui/ProgressBar.tsx'
import Dialog from '@components/ui/Dialog.tsx'
import CrosshairItem from '@components/crosshair/CrosshairItem.tsx'
import FileUploader from '@components/ui/inputs/FileUploader.tsx'
import Button from '@components/ui/buttons/Button.tsx'
import { mediumRadius } from '@constants/sizes.ts'
import { mainBlack80, mainGrey, mainRed } from '@constants/colors.ts'
import DefaultCrosshair from '@/assets/images/default_crosshair.png'
import { addCrosshair, getUserCrosshairs } from '@utils/db/crosshairs.ts'
import { uploadCrosshair } from '@utils/db/uploadToSupabase.ts'

type CrosshairsSectionProps = {
    userId: string | null
}

const CrosshairsSection = ({ userId }: CrosshairsSectionProps) => {
    const [crosshairs, setCrosshairs] = useState<Crosshair[]>([])
    const [loading, setLoading] = useState(false)

    const [crosshairName, setCrosshairName] = useState('')
    const [crosshairCode, setCrosshairCode] = useState('')
    const [crosshairImage, setCrosshairImage] = useState('')
    const [previewCrosshairUrl, setPreviewCrosshairUrl] = useState('')
    const [newCrosshairFile, setNewCrosshairFile] = useState<File | null>(null)

    const [crosshairNameError, setCrosshairNameError] = useState('')
    const [crosshairCodeError, setCrosshairCodeError] = useState('')
    const [crosshairImageError, setCrosshairImageError] = useState('')

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

    const resetStates = () => {
        setCrosshairName('')
        setCrosshairCode('')
        setCrosshairImage('')
        setPreviewCrosshairUrl('')
        setNewCrosshairFile(null)

        setCrosshairNameError('')
        setCrosshairCodeError('')
        setCrosshairImageError('')

        setOpenNewCrosshair(false)
        setLoading(false)
    }

    const validateForm = () => {
        let valid = true

        if (!crosshairName.trim()) {
            setCrosshairNameError(i18n.crosshairNameRequired)
            valid = false
        }

        if (!newCrosshairFile) {
            setCrosshairImageError(i18n.crosshairImageRequired)
            valid = false
        }

        if (!crosshairCode.trim()) {
            setCrosshairCodeError(i18n.crosshairCodeRequired)
            valid = false
        }

        return valid
    }

    const handleAddCrosshair = async () => {
        if (!userId || !validateForm()) return

        setLoading(true)

        let finalImageUrl = crosshairImage

        if (newCrosshairFile) {
            const previewUrl = URL.createObjectURL(newCrosshairFile)
            setCrosshairImage(previewUrl)

            const uploadedUrl = await uploadCrosshair(newCrosshairFile, userId)
            if (!uploadedUrl) {
                alert(i18n.unableAddNewCrosshair)
                setLoading(false)
                return
            }

            finalImageUrl = uploadedUrl
            setCrosshairImage(uploadedUrl)
        }

        const { id, error } = await addCrosshair(
            crosshairCode.trim(),
            crosshairName.trim(),
            finalImageUrl,
            'user',
        )

        if (error || !id) {
            alert(i18n.unableAddNewCrosshair)
            setLoading(false)
            return
        }

        setCrosshairs((prev) => [
            ...prev,
            {
                id,
                user_id: userId,
                name: crosshairName.trim(),
                image_url: finalImageUrl,
                code: crosshairCode.trim(),
                category: 'user',
                created_at: new Date().toISOString(),
            },
        ])

        resetStates()
    }

    const handleAddCrosshairImage = (file: File) => {
        setNewCrosshairFile(file)
        setPreviewCrosshairUrl(URL.createObjectURL(file))
        setCrosshairImageError('')
    }

    const handleDeleteCrosshairFromList = (id: string) => {
        setCrosshairs((prev) => prev.filter((crosshair) => crosshair.id !== id))
    }

    return (
        <div>
            <Text size="lg" weight="bold">
                {i18n.myCrosshairs}
            </Text>
            <Text color={mainBlack80}>{i18n.myCrosshairsText}</Text>

            <div style={{ paddingTop: '1rem' }}>
                {loading ? (
                    <ProgressBar title={i18n.loadingCrosshairs} />
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                        }}
                    >
                        {crosshairs.map((crosshair) => (
                            <div>
                                <CrosshairItem
                                    key={crosshair.id}
                                    id={crosshair.id}
                                    data={{
                                        code: crosshair.code,
                                        name: crosshair.name,
                                        image: crosshair.image_url,
                                        type: 'user',
                                    }}
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
                                    background: isAddCrosshairHovered
                                        ? mainGrey
                                        : 'inherit',
                                    transition:
                                        'background-color 0.3s ease-in-out',
                                }}
                                onMouseEnter={() =>
                                    setIsAddCrosshairHovered(true)
                                }
                                onMouseLeave={() =>
                                    setIsAddCrosshairHovered(false)
                                }
                                onClick={() => setOpenNewCrosshair(true)}
                            >
                                <CirclePlus size={64} />
                                <Text>{i18n.addCrosshair}</Text>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {openNewCrosshair && (
                <Dialog
                    title={i18n.addNewCrosshair}
                    buttonText={i18n.addCrosshair}
                    onButtonClick={handleAddCrosshair}
                    secondaryButtonText={i18n.cancel}
                    onSecondaryButtonClick={resetStates}
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

                    <div style={{ width: '100%' }}>
                        <Text weight="bold">{i18n.crosshairImage}</Text>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <img
                                src={previewCrosshairUrl || DefaultCrosshair}
                                alt="crosshair preview"
                                style={{
                                    border: `1px solid ${!crosshairImageError ? mainGrey : mainRed}`,
                                }}
                                width={128}
                                height={128}
                            />
                            <Text color={mainRed} size="sm">
                                {crosshairImageError}
                            </Text>

                            <FileUploader action={handleAddCrosshairImage}>
                                <Button variant="secondary">
                                    {i18n.importImage}
                                </Button>
                            </FileUploader>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    )
}

export default CrosshairsSection
