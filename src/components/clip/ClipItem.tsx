import { useEffect, useRef, useState } from 'react'
import { deleteUserClip } from '@utils/db/clips.ts'
import { copyText } from '@utils/textUtils.ts'
import { template } from 'lodash'
import i18n from '@/simple-react-i18n.ts'
import Card from '@components/Card.tsx'
import Text from '@components/Text.tsx'
import { Ellipsis, Info } from 'lucide-react'
import { mainGrey, mainWhite } from '@constants/colors.ts'
import Button from '@components/Button.tsx'
import ClipEmbed from '@components/clip/ClipEmbed.tsx'
import Toast from '@components/Toast.tsx'
import Dialog from '@components/Dialog.tsx'
import IconButton from '@components/IconButton.tsx'

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
                            <IconButton variant='light'>
                                <Ellipsis
                                    size="1rem"
                                    onClick={() => setOpenMenu(!openMenu)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </IconButton>
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
                                    }}>
                                        {i18n.delete}
                                    </Button>
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

export default ClipItem
