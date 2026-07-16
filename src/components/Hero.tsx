import { type CSSProperties, type PointerEvent, useState } from 'react';
import type { Work } from '../data/works';
import { toCssAssetUrl } from '../utils/assets';

type HeroProps = {
  works: Work[];
  onSelectWork: (work: Work) => void;
};

function Hero({ works, onSelectWork }: HeroProps) {
  const [isEntering, setIsEntering] = useState(false);
  const heroWorks = works.slice(0, 3);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    event.currentTarget.style.setProperty('--scene-x', `${(x * 16).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--scene-y', `${(y * 10).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--screen-x', `${(x * 7).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--screen-y', `${(y * 5).toFixed(2)}px`);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--scene-x', '0px');
    event.currentTarget.style.setProperty('--scene-y', '0px');
    event.currentTarget.style.setProperty('--screen-x', '0px');
    event.currentTarget.style.setProperty('--screen-y', '0px');
  };

  const startBrowse = (targetId = '#featured') => {
    if (isEntering) {
      return;
    }

    setIsEntering(true);

    window.setTimeout(() => {
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 720);

    window.setTimeout(() => setIsEntering(false), 1300);
  };

  return (
    <section
      className={`render-hero ${isEntering ? 'is-entering' : ''}`}
      id="home"
      aria-labelledby="hero-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="render-scene" aria-hidden="true" />
      <div className="render-atmosphere" aria-hidden="true" />

      <div className="render-nav">
        <a className="render-brand" href="#home" aria-label="画画的 o 泡 Visual Archive">
          <span>画画的 o 泡</span>
          <small>Visual Archive</small>
        </a>
        <nav aria-label="主导航">
          <a href="#home">Home</a>
          <a href="#archive">Archive</a>
          <a href="#featured">Featured</a>
          <a href="#commission">Commission</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <div className="container render-hero-grid">
        <div className="render-copy">
          <p className="render-kicker">Illustrated Gazette / Private Collection</p>
          <h1 id="hero-title">画画的 o 泡</h1>
          <p className="render-subtitle">绘画作品集 / Visual Archive</p>
          <p className="render-intro">
            收藏近期绘画作品、阶段练习与可参考的画面方向。慢慢看，不用急。
          </p>
          <div className="render-actions">
            <button type="button" onClick={() => startBrowse('#featured')}>
              浏览作品
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" onClick={() => startBrowse('#archive')}>
              作品列表
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="render-tv-area" aria-label="电视预览区域">
          <div className="render-tv-image" />
          <div className="render-screen-ui">
            <div className="screen-ui-nav">
              <span>画画的 o 泡</span>
              <div>
                <a href="#archive">Archive</a>
                <a href="#featured">Works</a>
              </div>
            </div>

            <div className="screen-ui-center">
              <p>Visual Archive</p>
              <strong>OPAO</strong>
              <button type="button" onClick={() => startBrowse('#featured')}>
                开始浏览
              </button>
            </div>

            <div className="screen-ui-strip">
              <span>Latest Preview</span>
              {heroWorks.slice(0, 2).map((work) => (
                <button
                  type="button"
                  key={work.id}
                  onClick={() => onSelectWork(work)}
                  style={{ '--cover': toCssAssetUrl(work.cover), '--focus': work.focus } as CSSProperties}
                  aria-label={`查看 ${work.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container render-bottom-row">
        <div className="render-scroll-cue">
          <i aria-hidden="true" />
          <span>Scroll to explore</span>
        </div>
        <div className="render-mini-gallery">
          {heroWorks.map((work, index) => (
            <button
              type="button"
              key={work.id}
              onClick={() => onSelectWork(work)}
              style={{ '--cover': toCssAssetUrl(work.cover), '--focus': work.focus } as CSSProperties}
            >
              <span>No. {String(index + 1).padStart(2, '0')}</span>
              <strong>{work.title}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
