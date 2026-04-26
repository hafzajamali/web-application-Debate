import { useNavigate } from 'react-router-dom'

function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className='hero'>
      <div className='hero-pill'>AI Debate Training Platform</div>

      <h1 className='hero-h'>
        Improve Your <em>Debating Skills</em>
      </h1>

      <p className='hero-p'>
        Practice debate arguments with AI and improve your communication.
      </p>

      <div className='hero-btns'>
        <button className='btn-main' onClick={() => navigate('/login')}>
          Start Now
        </button>

        <button className='btn-ghost'>Explore</button>
      </div>
    </section>
  )
}

export default HeroSection