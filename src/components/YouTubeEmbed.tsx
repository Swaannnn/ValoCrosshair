import React from 'react'
import Text from '@components/Text.tsx'

type YouTubeEmbedProps = {
	url: string
	width?: string
	height?: string
}

const extractYouTubeID = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, width = '100%', height = '100%' }) => {
    const videoId = extractYouTubeID(url)

    if (!videoId) {
        return <Text>i18n.Vidéo Youtube introuvable (refaire un composant propre)</Text>
    }

    return (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                allowFullScreen
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width,
                    height,
	                border: 0
                }}
            />
        </div>
    )
}

export default YouTubeEmbed
