import { useLocation } from 'react-router-dom'
import DebateHeader from '../components/DebateHeader'
import DebateChat from '../components/DebateChat'

function DebateRoom() {
  const location = useLocation()

  const topic = location.state?.topic || 'General Debate'

  return (
    <div className='debate'>
      <DebateHeader topic={topic} />
      <DebateChat topic={topic} />
    </div>
  )
}

export default DebateRoom