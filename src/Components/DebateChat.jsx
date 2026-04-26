import { useState } from 'react'

function DebateChat() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])

  const sendMessage = () => {
    if (!message.trim()) return

    setChat([...chat, message])
    setMessage('')
  }
  return (
    <div className='chat-box'>
      <div className='messages'>
        {chat.map((msg, idx) => (
          <div key={idx} className='message'>
            {msg}
          </div>
        ))}
      </div>
      <div className='input-box'>
        <input
          type='text'
          placeholder='Type your message...'
          className='chat-inp'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className='chat-btn' onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}

export default DebateChat