import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Account from '@/pages/Account'
import Login from '@/pages/auth/Login'
import { useSession } from '@hooks/auth/useSession'
import Register from '@/pages/auth/Register.tsx'
import ResetPassword from '@pages/auth/ResetPassword.tsx'
import ResetPasswordConfirm from '@pages/auth/ResetPasswordConfirm.tsx'

const AppRoutes = () => {
    const userId = useSession()

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/resetPassword' element={<ResetPassword />} />
            <Route path='/resetPasswordConfirm' element={<ResetPasswordConfirm />} />
            <Route path="/account" element={userId ? <Account /> : <Navigate to="/login" replace />} />
        </Routes>
    )
}

export default AppRoutes
