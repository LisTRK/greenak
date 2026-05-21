import Footer from './components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import PageBackground from './components/PageBackground/PageBackground.jsx'
import Projects from './components/Projects/Projects.jsx'
import './App.css'

function App() {
  return (
    <div className="page">
      <PageBackground />
      <Hero />

      <main className="main" aria-label="Головний вміст">
        <Projects />
      </main>

      <Footer />
    </div>
  )
}

export default App
