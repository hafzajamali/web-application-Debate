function Features() {
  const features = [
    {
      title: 'AI Debate Practice',
      desc: 'Debate against AI anytime.',
    },
    {
      title: 'Difficulty Levels',
      desc: 'Easy, Medium, Hard modes.',
    },
    {
      title: 'Score Tracking',
      desc: 'See your progress over time.',
    },
  ]

  return (
    <div className='feat-row'>
      {features.map((item, index) => (
        <div key={index} className='feat'>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
  )
}

export default Features