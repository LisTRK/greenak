import { useState } from 'react'
import Footer from './components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import PageBackground from './components/PageBackground/PageBackground.jsx'
import Projects from './components/Projects/Projects.jsx'
import SurveyModal from './components/Survey/SurveyModal.jsx'
import './App.css'

function App() {
  const [surveyOpen, setSurveyOpen] = useState(false)

  return (
    <div className="page">
      <PageBackground />
      <Hero onSurveyOpen={() => setSurveyOpen(true)} />
      <SurveyModal open={surveyOpen} onClose={() => setSurveyOpen(false)} />

      <main className="main" aria-label="Головний вміст">
        <Projects />
      </main>

      <Footer />
    </div>
  )
}

export default App
