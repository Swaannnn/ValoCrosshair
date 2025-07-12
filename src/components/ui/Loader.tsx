import { headerHeight } from '@constants/sizes.ts'

const spinnerStyle = {
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #333',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    animation: 'spin 1s linear infinite',
}

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `calc(100vh - ${headerHeight})`,
}

const Loader = () => {
    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
        </div>
    )
}

export default Loader
