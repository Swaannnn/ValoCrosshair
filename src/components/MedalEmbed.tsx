import React from 'react'

type MedalEmbedProps = {
    url: string
    width?: string
    height?: string
}

const extractMedalID = (url: string): string | null => {
    const regex = /medal\.tv\/.*\/clips\/([a-zA-Z0-9]+)/i
    const match = url.match(regex)
    return match ? match[1] : null
}

const MedalEmbed: React.FC<MedalEmbedProps> = ({ url, width = '100%', height = '100%' }) => {
    const clipId = extractMedalID(url)

    if (!clipId) {
        return <p>i18n.Vidéo Medal introuvable (refaire un composant propre)</p>
    }

    return (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
                src={`https://medal.tv/clip/${clipId}/embed`}
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

export default MedalEmbed
