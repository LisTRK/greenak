import SurveyModal from '@/features/survey/components/SurveyModal.jsx'
import { useSurveyModal } from '@/features/survey/hooks/useSurveyModal.js'
import Footer from '@/layout/Footer/Footer.jsx'
import PageBackground from '@/layout/PageBackground/PageBackground.jsx'
import Hero from '@/sections/Hero/Hero.jsx'
import Projects from '@/sections/Projects/Projects.jsx'
import './App.css'

function App() {
  const { openSurvey, modalProps } = useSurveyModal()

  return (
    <div className="page">
      <PageBackground />

      <main className="main" aria-label="Головний вміст">
        <Hero onSurveyOpen={openSurvey} />
        <Projects />
      </main>

      
      <SurveyModal {...modalProps} />

      <Footer />
    </div>
  )
}

export default App
