import { copyText } from '@/utils/textUtils.ts'
import Button from '@components/ui/buttons/Button.tsx'
import { Copy, Ellipsis, Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Toast from '@components/ui/Toast.tsx'
import i18n from '@/simple-react-i18n.ts'
import { template } from 'lodash'
import Card from '@components/ui/Card.tsx'
import { mainGrey, mainWhite } from '@constants/colors.ts'
import Dialog from '@components/ui/Dialog.tsx'
import Text from '@components/ui/Text.tsx'
import { deleteCrosshairWithImage } from '@utils/db/crosshairs.ts'
import IconButton from '@components/ui/buttons/IconButton.tsx'

type CrosshairItemProps = {
    id: string
    data: {
        name: string
        image: string
        code: string
        type: string
    }
    onDelete?: (id: string) => void
}

const CrosshairItem = ({ id, data, onDelete }: CrosshairItemProps) => {
    const [openMenu, setOpenMenu] = useState(false)
    const [openDialogDeleteCrosshair, setOpenDialogDeleteCrosshair] =
        useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const ellipsisRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ellipsisRef.current &&
                !ellipsisRef.current.contains(event.target as Node)
            ) {
                setOpenMenu(false)
            }
        }
        if (openMenu) document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [openMenu])

    const handleDeleteCrosshair = async () => {
        if (onDelete) {
            const { error } = await deleteCrosshairWithImage(id, data.image)
            if (error) {
                alert(error.message)
            } else {
                onDelete(id)
                setOpenDialogDeleteCrosshair(false)
            }
        }
    }

    const onCopy = (code: string) => {
        copyText(code)
            .then(() => {
                setToastVisible(true)
                setToastMessage(
                    template(i18n.validationCopy)({
                        name: data.name,
                    }),
                )
            })
            .catch((e) => {
                setToastVisible(true)
                setToastMessage(template(i18n.copyError)({ error: e }))
            })
    }

    return (
        <Card>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <div />
                    <Text weight="bold" style={{ overflow: 'hidden' }}>
                        {data.name}
                    </Text>
                    {onDelete ? (
                        <div ref={ellipsisRef} style={{ position: 'relative' }}>
                            <IconButton variant="light">
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
                                    <Button
                                        variant="textDelete"
                                        onClick={() => {
                                            setOpenDialogDeleteCrosshair(true)
                                            setOpenMenu(false)
                                        }}
                                    >
                                        {i18n.delete}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div />
                    )}
                </div>
                <div
                    style={{
                        height: '160px',
                        width: '160px',
                        backgroundImage: `url(${data.image})`,
                        backgroundSize: 'cover',
                    }}
                />
                <Button
                    onClick={() => onCopy(data.code)}
                    endIcon={<Copy size={18} />}
                >
                    {i18n.copyCode}
                </Button>
                {toastVisible && (
                    <Toast
                        message={toastMessage}
                        icon={<Info size={18} />}
                        onClose={() => setToastVisible(false)}
                    />
                )}
                {openDialogDeleteCrosshair && (
                    <Dialog
                        title={i18n.deleteCrosshair}
                        buttonText={i18n.confirm}
                        onButtonClick={handleDeleteCrosshair}
                        secondaryButtonText={i18n.cancel}
                        onSecondaryButtonClick={() =>
                            setOpenDialogDeleteCrosshair(false)
                        }
                        horizontalButtons
                    >
                        <Text>
                            {template(i18n.confirmDeleteCrossair)({
                                name: data.name,
                            })}
                        </Text>
                    </Dialog>
                )}
            </div>
        </Card>
    )
}

export default CrosshairItem
