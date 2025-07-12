import ToggleButton from '@components/ui/buttons/ToggleButton.tsx'

type ValuesProps = {
    label: string,
    value: string,
}

type FilterButtonProps = {
    values: ValuesProps[]
    selectedValue: string
    onChange: (newValue: string) => void
}

const FilterButtons = ({ values, selectedValue, onChange }: FilterButtonProps) => (
    <div style={{ display: 'flex', gap: '1rem' }}>
        {values.map(value => (
            <label key={value.value} style={{ display: 'block' }}>
                <ToggleButton
                    selected={selectedValue === value.value}
                    onClick={() => onChange(value.value)}
                >
                    {value.label}
                </ToggleButton>
            </label>
        ))}
    </div>
)

export default FilterButtons
