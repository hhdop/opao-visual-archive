import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { archiveLinks } from '../data/links';
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
          <p className="section-label">Work Detail</p>
          <h2 id="work-modal-title">{work.title}</h2>

          <dl className="detail-list">
            <div>
              <dt>作品名称</dt>
              <dd>{work.title}</dd>
            </div>
            <div>
              <dt>创作年份</dt>
              <dd>{work.year}</dd>
            </div>
            <div>
              <dt>作品类型</dt>
              <dd>{work.category}</dd>
            </div>
            <div>
              <dt>作品说明</dt>
              <dd>{work.description}</dd>
            </div>
            <div>
              <dt>关键词标签</dt>
              <dd>{work.tags.join(' / ')}</dd>
            </div>
            <div>
              <dt>约稿参考状态</dt>
              <dd>{work.referenceForCommission ? '可参考此风格进行定制约稿' : '仅作为作品档案展示'}</dd>
            </div>
          </dl>

          <p className="modal-note">
            该作品仅作为风格展示与约稿参考。具体定制内容、复杂度与排期请联系确认。
          </p>

          <div className="modal-access" aria-label="作品原图领取入口">
            <p>原图领取</p>
            <div>
              {archiveLinks.map((link) => (
                <a href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <a className="button button-light" href="#contact" onClick={onClose}>
              联系约稿
            </a>
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
