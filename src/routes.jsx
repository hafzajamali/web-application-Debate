import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import DebateSetup from './pages/DebateSetup'
import DebateRoom from './pages/DebateRoom'
import ResultPage from './pages/ResultPage'

function RoutesConfig() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/setup' element={<DebateSetup />} />
      <Route path='/debate' element={<DebateRoom />} />
      <Route path='/result' element={<ResultPage />} />
    </Routes>
  )
}

export default RoutesConfig