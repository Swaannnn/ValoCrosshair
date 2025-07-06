import Header from '@/components/Header'
import AppRoutes from '@/routes/AppRoutes'
import './App.css'
import { lightGrey } from '@constants/colors.ts'
import { headerHeight } from '@constants/sizes.ts'

const App = () => (
    <div style={{ backgroundColor: lightGrey, minHeight: '100vh' }}>
        <Header />
        <div style={{ paddingTop: headerHeight }}>
            <AppRoutes />
        </div>
    </div>
)

export default App
