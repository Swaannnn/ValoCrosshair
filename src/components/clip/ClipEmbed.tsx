import { useMemo } from 'react'
import { mainBlack80, mainWhite } from '@constants/colors.ts'
import Text from '@components/ui/Text.tsx'
import { OctagonX } from 'lucide-react'
import i18n from '@/simple-react-i18n.ts'

const extractYouTubeID = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
}

const extractMedalID = (url: string): string | null => {
    const regex = /medal\.tv\/.*\/clips\/([a-zA-Z0-9_]+)/i
    const match = url.match(regex)
    return match ? match[1] : null
}

type ClipEmbedProps = {
	link: string
	width?: string
	height?: string
}

const ClipEmbed = ({ link, width = '100%', height = '100%' }: ClipEmbedProps) => {
    const embedUrl = useMemo(() => {
        if (link.includes('youtube')) {
            const id = extractYouTubeID(link)
            return id ? `https://www.youtube.com/embed/${id}` : null
        }

        if (link.includes('medal')) {
            const id = extractMedalID(link)
            return id ? `https://medal.tv/clip/${id}/embed` : null
        }

        return null
    }, [link])

    return (embedUrl) ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
            <iframe
                src={embedUrl}
                allowFullScreen
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width, height,
                    border: 0
                }}
            />
        </div>
    ) : (
        <div
            style={{
                height: '252px', width,
                backgroundColor: mainBlack80,

                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <OctagonX color={mainWhite} size={64} />
            <Text color={mainWhite}>{i18n.videoNotFound}</Text>
        </div>
    )
}

export default ClipEmbed
