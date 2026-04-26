import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthForm() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (email && password) {
      navigate('/dashboard')
    }
  }

  return (
    <div className='auth-box'>
      <h2 className='auth-h'>Login</h2>

      <div className='field'>
        <label>Email</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='field'>
        <label>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className='submit-btn' onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}

export default AuthForm