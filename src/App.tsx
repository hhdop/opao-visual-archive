import { useState } from 'react';
import MaterialLibrary from './components/MaterialLibrary';
import Navbar from './components/Navbar';
import WorkDetailModal from './components/WorkDetailModal';
import { works, type Work } from './data/works';

function App() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  return (
    <>
      <Navbar />
      <main>
        <MaterialLibrary works={works} onSelectWork={setSelectedWork} />
      </main>
      <footer className="site-footer-lite">
        <span>© 2026 画画的 o 泡 Visual Archive.</span>
        <span>作品原图请在作品详情中查看百度网盘 / 夸克网盘入口。</span>
      </footer>
      <WorkDetailModal work={selectedWork} onClose={() => setSelectedWork(null)} />
    </>
  );
}

export default App;
