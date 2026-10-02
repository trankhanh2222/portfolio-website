import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Interests from "./components/Interests";
import Skills from "./components/Skills";
import Journey from "./components/Journey";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useSite } from "./site-context";

export default function App() {
  const { t } = useSite();
  return (
    <>
      <a className="skip-link" href="#main">
        {t.ui.skipToContent}
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Interests />
        <Skills />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
