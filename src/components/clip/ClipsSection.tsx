import Text from '@components/ui/Text.tsx'
import i18n from '@/simple-react-i18n.ts'
import { mainBlack80, mainGrey } from '@constants/colors.ts'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import TextField from '@components/ui/inputs/TextField.tsx'
import { addClip, getUserClips } from '@utils/db/clips.ts'
import type { Clip } from '@/types/types.ts'
import ProgressBar from '@components/ui/ProgressBar.tsx'
import Dialog from '@components/ui/Dialog.tsx'
import { mediumRadius } from '@constants/sizes.ts'
import ClipItem from '@components/clip/ClipItem.tsx'

type ClipSectionProps = {
    userId: string | null
}

const ClipsSection = ({ userId }: ClipSectionProps) => {
    const [clips, setClips] = useState<Clip[]>([])
    const [loading, setLoading] = useState(false)
    const [openNewClip, setOpenNewClip] = useState(false)
    const [clipName, setClipName] = useState('')
    const [clipNameError, setClipNameError] = useState('')
    const [clipLink, setClipLink] = useState('')
    const [clipLinkError, setClipLinkError] = useState('')
    const [isAddClipHovered, setIsAddClipHovered] = useState(false)

    useEffect(() => {
        if (!userId) return
        setLoading(true)
        getUserClips(userId).then((data) => {
            if (data) setClips(data)
            setLoading(false)
        })
    }, [userId])

    const handleAddClip = async () => {
        let hasError = false
        setClipNameError('')
        setClipLinkError('')

        if (!clipName.trim()) {
            setClipNameError(i18n.clipNameRequired)
            hasError = true
        }
        if (!clipLink.trim()) {
            setClipLinkError(i18n.clipLinkRequired)
            hasError = true
        } else if (!clipLink.includes('youtube') && !clipLink.includes('medal')) {
            setClipLinkError(i18n.clipLinkInvalid)
            hasError = true
        }

        if (hasError) return

        setLoading(true)
        const { id, error } = await addClip(clipName.trim(), clipLink.trim())

        if (error) {
            alert(i18n.unableAddNewClip)
            setLoading(false)
            return
        }

        if (userId) {
            setClips(prev => [
                ...prev,
                {
                    name: clipName.trim(),
                    link: clipLink.trim(),
                    id: id,
                    user_id: userId,
                    created_at: new Date().toISOString(),
                }
            ])
        }

        setLoading(false)
        setOpenNewClip(false)
        setClipName('')
        setClipLink('')
    }


    const handleDeleteClipFromList = (id: string) => {
        setClips((prev) => prev.filter(clip => clip.id !== id))
    }

    return (
        <div>
            <Text size="lg" weight="bold">{i18n.myClips}</Text>
            <Text color={mainBlack80}>{i18n.myClipsText}</Text>
            <div style={{ paddingTop: '1rem' }}>
                {loading ? (
                    <ProgressBar title={i18n.loadingClips} />
                ) : (
                    <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {clips.map((clip) => (
                                <ClipItem
                                    key={clip.id}
                                    name={clip.name}
                                    link={clip.link}
                                    id={clip.id}
                                    onDeleted={handleDeleteClipFromList}
                                />
                            ))}
                            {clips.length < 4 && (
                                <div
                                    style={{
                                        height: '311px',
                                        width: '480px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        borderRadius: mediumRadius,
                                        background: isAddClipHovered ? mainGrey : 'inherit',
                                        transition: 'background-color 0.3s ease-in-out',
                                    }}
                                    onMouseEnter={() => setIsAddClipHovered(true)}
                                    onMouseLeave={() => setIsAddClipHovered(false)}
                                    onClick={() => setOpenNewClip(true)}
                                >
                                    <CirclePlus size={64} />
                                    <Text>{i18n.addClip}</Text>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            {openNewClip && (
                <Dialog
                    title={i18n.addNewClip}
                    buttonText={i18n.addClip}
                    onButtonClick={handleAddClip}
                    secondaryButtonText={i18n.cancel}
                    onSecondaryButtonClick={() => {
                        setOpenNewClip(false)
                        setClipName('')
                        setClipNameError('')
                        setClipLink('')
                        setClipLinkError('')
                    }}
                    horizontalButtons
                >
                    <Text>{i18n.addClipInstructions}</Text>
                    <TextField
                        label={i18n.clipName}
                        placeholder={i18n.clipNamePlaceholder}
                        value={clipName}
                        onChange={(e) => {
                            setClipName(e.target.value)
                            setClipNameError('')
                        }}
                        error={clipNameError}
                    />
                    <TextField
                        label={i18n.clipLink}
                        placeholder={i18n.clipLinkPlaceholder}
                        value={clipLink}
                        onChange={(e) => {
                            setClipLink(e.target.value)
                            setClipLinkError('')
                        }}
                        error={clipLinkError}
                    />
                </Dialog>
            )}
        </div>
    )
}

export default ClipsSection
