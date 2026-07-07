import { useEffect, useState } from 'react';
import About from './components/About';
import Commission from './components/Commission';
import Contact from './components/Contact';
import MaterialLibrary from './components/MaterialLibrary';
import Navbar from './components/Navbar';
import WorkDetailModal from './components/WorkDetailModal';
import { works, type Work } from './data/works';

function App() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.scroll-reveal'));

    if (!targets.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <MaterialLibrary works={works} onSelectWork={setSelectedWork} />
        <Commission />
        <About />
        <Contact />
      </main>
      <WorkDetailModal work={selectedWork} onClose={() => setSelectedWork(null)} />
    </>
  );
}

export default App;
