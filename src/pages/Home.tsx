import crosshairs from '@/data/crosshairs.json'
import CrosshairItem from '@components/crosshair/CrosshairItem.tsx'
import FilterButtons from '@components/ui/buttons/FilterButtons.tsx'
import { useState } from 'react'
import i18n from '@/simple-react-i18n.ts'

const Home = () => {
    const filterValues = [
        { label: i18n.all, value: 'all' },
        { label: i18n.pro, value: 'pro' },
        { label: i18n.fun, value: 'fun' },
        { label: i18n.user, value: 'user' },
    ]

    const [type, setType] = useState('all')

    return (
        <div style={{ padding: '1rem' }}>
            <FilterButtons
                values={filterValues}
                selectedValue={type}
                onChange={setType}
            />
            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingTop: '1rem',
                }}
            >
                {crosshairs
                    .filter((crosshair) => type === 'all' || crosshair.type === type)
                    .map((crosshair, index) => (
                        <div key={index}>
                            <CrosshairItem id={crosshair.id} data={crosshair}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Home
