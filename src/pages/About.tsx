import i18n from '@/simple-react-i18n.ts'
import Text from '@components/ui/Text.tsx'

const About = () => {
    return (
        <div style={{ padding: '1rem' }}>
            <Text>{i18n.about}</Text>
        </div>
    )
}

export default About
