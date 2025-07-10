import { copyText } from '@/utils/textUtils.ts'
import { mainBlack } from '@/constants/colors.ts'
import Button from '@/components/Button.tsx'
import { Copy, Info } from 'lucide-react'
import { useState } from 'react'
import Toast from '@/components/Toast.tsx'
import i18n from '@/simple-react-i18n.ts'
import { template } from 'lodash'
import Card from '@components/Card.tsx'

type CrosshairProps = {
    data: {
        name: string,
        image: string,
        code: string,
        type: string
    },
}

const Crosshair = ({ data }: CrosshairProps) => {
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const onCopy = (code: string) => {
        copyText(code)
            .then(() => {
                setToastVisible(true)
                setToastMessage(template(i18n.validationCopy)({
                    name: data.name
                }))
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

                    // backgroundColor: mainWhite,
                    // padding: '1rem',
                    // borderRadius: mediumRadius,
                    // boxShadow: `0 4px 10px ${mainGrey}`,
                }}
            >
                <div
                    style={{
                        height: '160px',
                        width: '160px',
                        backgroundColor: mainBlack,
                    }}
                />
                <p>{data.name}</p>
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
            </div>
        </Card>
    )
}

export default Crosshair
