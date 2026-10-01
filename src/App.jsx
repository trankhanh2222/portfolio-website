import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Work from './components/Work.jsx'
import Skills from './components/Skills.jsx'
import Journal from './components/Journal.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Work />
        <Skills />
        <Journal />
        <Contact />
      </main>
      <Footer />
    </>
  )
}