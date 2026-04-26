function DebateHeader({ topic }) {
  return (
    <div className='deb-hdr'>
      <div className='deb-topic'>
        Current Topic: {topic}
      </div>
    </div>
  )
}

export default DebateHeader