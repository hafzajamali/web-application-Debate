import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <div className='land-nav'>
      <div className='brand'>Debate<span>AI</span></div>

      <button className='nav-cta' onClick={() => navigate('/login')}>
        Get Started
      </button>
    </div>
  )
}

export default Navbar