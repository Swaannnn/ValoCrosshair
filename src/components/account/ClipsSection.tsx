import Text from '@components/Text.tsx'
import i18n from '@/simple-react-i18n.ts'
import { mainGrey, mainWhite } from '@constants/colors.ts'
import { CirclePlus, Ellipsis, Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import TextField from '@components/TextField.tsx'
import { addClip, deleteUserClip, getUserClips } from '@utils/db/clips.ts'
import type { Clip } from '@/types/types.ts'
import ClipEmbed from '@components/account/ClipEmbed.tsx'
import ProgressBar from '@components/ProgressBar.tsx'
import Card from '@components/Card.tsx'
import Dialog from '@components/Dialog.tsx'
import Button from '@components/Button.tsx'
import { template } from 'lodash'
import { copyText } from '@utils/textUtils.ts'
import Toast from '@components/Toast.tsx'
import { mediumRadius } from '@constants/sizes.ts'

type ClipItemProps = {
    name: string
    link: string
    id: string
    onDeleted: (id: string) => void
}

const ClipItem = ({ name, link, id, onDeleted }: ClipItemProps) => {
    const [openMenu, setOpenMenu] = useState(false)
    const [openDialogDeleteClip, setOpenDialogDeleteClip] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const ellipsisRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ellipsisRef.current && !ellipsisRef.current.contains(event.target as Node)) {
                setOpenMenu(false)
            }
        }
        if (openMenu) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [openMenu])

    const handleDeleteClip = async () => {
        const { error } = await deleteUserClip(id)
        if (error) {
            alert(error.message)
        } else {
            onDeleted(id)
            setOpenDialogDeleteClip(false)
        }
    }

    const onCopy = (link: string) => {
        setOpenMenu(false)
        copyText(link)
            .then(() => {
                setToastVisible(true)
                setToastMessage(template(i18n.copyClipLinkSuccess)({ name: name }))
            })
            .catch((e) => {
                setToastVisible(true)
                setToastMessage(template(i18n.copyError)({ error: e }))
            })
    }

    return (
        <>
            <div style={{ height: '310px', width: 480, position: 'relative' }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                        <Text size="md" weight='bold' style={{ marginBottom: '0.5rem' }}>{name}</Text>
                        <div ref={ellipsisRef} style={{ position: 'relative' }}>
                            <Ellipsis size="1rem" onClick={() => setOpenMenu(!openMenu)} style={{ cursor: 'pointer' }} />
                            {openMenu && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '1.6rem',
                                        right: '0.2rem',
                                        backgroundColor: mainWhite,
                                        border: `1px solid ${mainGrey}`,
                                        borderRadius: '0.5rem',
                                        padding: '0.5rem',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                        zIndex: 100,
                                    }}
                                >
                                    <Button variant="text" onClick={() => onCopy(link)}>{i18n.copyLink}</Button>
                                    <Button variant="textDelete" onClick={() => {
                                        setOpenDialogDeleteClip(true)
                                        setOpenMenu(false)
                                    }}>{i18n.delete}</Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <ClipEmbed link={link} />
                </Card>
            </div>
            {toastVisible && (
                <Toast
                    message={toastMessage}
                    icon={<Info size={18} />}
                    onClose={() => setToastVisible(false)}
                />
            )}
            {openDialogDeleteClip && (
                <Dialog
                    title={i18n.deleteClip}
                    buttonText={i18n.confirm}
                    onButtonClick={handleDeleteClip}
                    secondaryButtonText={i18n.cancel}
                    onSecondaryButtonClick={() => setOpenDialogDeleteClip(false)}
                    horizontalButtons
                >
                    <Text>
                        {template(i18n.confirmDeleteClip)({
                            name: name
                        })}
                    </Text>
                </Dialog>
            )}
        </>
    )
}

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
            <Text>{i18n.myClipsText}</Text>
            <div style={{ paddingTop: '1rem' }}>
                {loading ? (
                    <ProgressBar title={i18n.loadingProfile} />
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
                                        width: 480,
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
                                    <p>{i18n.addClip}</p>
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
