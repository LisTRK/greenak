import Banner from '../Banner/Banner.jsx'
import Sale from '../Sale/Sale.jsx'
import './Hero.css'

function Hero({ onSurveyOpen }) {
  return (
    <header className="hero">
      <Banner />
      <Sale onSurveyOpen={onSurveyOpen} />
    </header>
  )
}

export default Hero