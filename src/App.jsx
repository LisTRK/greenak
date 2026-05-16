import Footer from './components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import Projects from './components/Projects/Projects.jsx'
import Sale from './components/Sale/Sale.jsx'
import './App.css'

function App() {
  return (
    <div className="page">
      <Hero />

      <main className="main" aria-label="Головний вміст">
        <Sale />
        <Projects />
      </main>

      <Footer />
    </div>
  )
}

export default App
