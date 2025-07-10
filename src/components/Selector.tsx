import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { smallRadius } from '@constants/sizes.ts'
import { lightGrey, mainGrey, mainRed, mainWhite } from '@constants/colors.ts'

type Options = {
    id: string
    label: string
}

type SelectorProps = {
    label: string,
    options: Options[],
    value: string,
    onChange: (value: string) => void,
    error?: string,
    placeholder?: string,
}

const Selector = ({ label, options, value, onChange, error, placeholder }: SelectorProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [hoveredOption, setHoveredOption] = useState<string | null>(null)

    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <label
                htmlFor={label}
                style={{
                    display: 'block',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    cursor: 'pointer'
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {label}
            </label>

            <div
                style={{
                    width: '100%',
                    padding: '0.5rem 1rem 0.5rem 0.5rem',
                    borderRadius: smallRadius,
                    border: `1px solid ${error ? mainRed : mainGrey}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'background-color 0.2s ease'
                }}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span>{options.find(option => option.id === value)?.label || placeholder}</span>

                <ChevronDown
                    width="16"
                    height="16"
                    style={{
                        transition: 'transform 0.3s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                />
            </div>

            {isOpen && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: mainWhite,
                        border: `1px solid ${mainGrey}`,
                        borderRadius: 4,
                        marginTop: 4,
                        maxHeight: 200,
                        overflowY: 'auto',
                        zIndex: 10,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        padding: 0,
                        listStyle: 'none',
                    }}
                >
                    {options.map(option => {
                        const isSelected = option.id === value
                        const isHovered = hoveredOption === option.id

                        return (
                            <li
                                key={option.id}
                                style={{
                                    padding: '0.5rem',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? mainGrey : isHovered ? lightGrey : mainWhite,
                                    transition: 'background-color 0.2s ease'
                                }}
                                onClick={() => {
                                    onChange(option.id)
                                    setIsOpen(false)
                                }}
                                onMouseEnter={() => setHoveredOption(option.id)}
                                onMouseLeave={() => setHoveredOption(null)}
                            >
                                {option.label}
                            </li>
                        )
                    })}
                </ul>
            )}

            {error && (
                <p style={{ color: '#e63946', fontSize: '0.85rem', marginTop: 4 }}>
                    {error}
                </p>
            )}
        </div>
    )
}

export default Selector
