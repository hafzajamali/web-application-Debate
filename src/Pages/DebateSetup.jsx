import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function DebateSetup() {
  const navigate = useNavigate()

  const [customTopic, setCustomTopic] = useState('')

  const startDebate = () => {
    if (!customTopic.trim()) return

    navigate('/debate', {
      state: {
        topic: customTopic,
      },
    })
  }

  return (
    <div className='cfg-screen'>
      <h1 className='cfg-heading'>Choose Your Debate Topic</h1>

      <div className='custom-box'>
        <label>Enter Your Debate Topic</label>

        <div className='custom-row'>
          <input
            type='text'
            placeholder='Example: Is AI replacing jobs?'
            className='custom-inp'
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
          />

          <button className='custom-go' onClick={startDebate}>
            Start
          </button>
        </div>
      </div>
    </div>
  )
}

export default DebateSetup