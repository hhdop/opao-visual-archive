import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import type { Work } from '../data/works';

type WorkDetailModalProps = {
  work: Work | null;
  onClose: () => void;
};

function WorkDetailModal({ work, onClose }: WorkDetailModalProps) {
  useEffect(() => {
    if (!work) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, work]);

  if (!work) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`work-modal is-${work.orientation}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
        style={{ '--work-aspect': work.aspectRatio, '--focus': work.focus } as CSSProperties}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="关闭作品详情">
          ×
        </button>

        <figure className={`modal-artwork is-${work.orientation}`}>
          <span className="modal-image-shell">
            <img src={work.cover} alt={work.title} />
          </span>
          <figcaption>查看大图可打开原始作品文件</figcaption>
        </figure>

        <div className="modal-content">
          <p className="section-label">Artwork File</p>
          <h2 id="work-modal-title">{work.title}</h2>

          <p className="modal-meta-line">创作于 {work.year}　{work.dimensions.label}</p>

          <div className="modal-access" aria-label="作品原图领取入口">
            <p>原图领取</p>
            <div>
              <a href={work.downloadLinks.baidu}>百度网盘</a>
              <a href={work.downloadLinks.quark}>夸克网盘</a>
            </div>
          </div>

          <div className="modal-actions">
            <a className="button button-line" href={work.detailImages[0] ?? work.cover} target="_blank" rel="noreferrer">
              查看大图
            </a>
            <button className="button button-line" type="button" onClick={onClose}>
              返回归档
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkDetailModal;
