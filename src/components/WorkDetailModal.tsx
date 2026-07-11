import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import type { Work } from '../data/works';

type WorkDetailModalProps = {
  work: Work | null;
  onClose: () => void;
};

function getSafeExternalUrl(url: string) {
  if (url === '#') {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:' ? parsedUrl.href : null;
  } catch {
    return null;
  }
}

function renderDownloadLink(label: string, url: string) {
  const safeUrl = getSafeExternalUrl(url);

  if (!safeUrl) {
    return <span className="is-pending">{label}（待补）</span>;
  }

  return (
    <a href={safeUrl} target="_blank" rel="noreferrer" referrerPolicy="no-referrer">
      {label}
    </a>
  );
}

function WorkDetailModal({ work, onClose }: WorkDetailModalProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!work) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.requestAnimationFrame(() => previouslyFocusedRef.current?.focus());
    };
  }, [onClose, work]);

  if (!work) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className={`work-modal is-${work.orientation}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
        style={{ '--work-aspect': work.aspectRatio, '--focus': work.focus } as CSSProperties}
      >
        <button ref={closeButtonRef} className="modal-close" type="button" onClick={onClose} aria-label="关闭作品详情">
          ×
        </button>

        <figure className={`modal-artwork is-${work.orientation}`}>
          <span className="modal-image-shell">
            <img src={work.cover} alt={work.title} decoding="async" />
          </span>
        </figure>

        <div className="modal-content">
          <p className="section-label">Artwork File</p>
          <h2 id="work-modal-title">{work.title}</h2>

          <dl className="modal-facts">
            <div>
              <dt>创作时间</dt>
              <dd>{work.year}</dd>
            </div>
            <div>
              <dt>图片尺寸</dt>
              <dd>{work.dimensions.label}</dd>
            </div>
          </dl>

          <div className="modal-access" aria-label="作品原图领取入口">
            <p>原图领取</p>
            <div>
              {renderDownloadLink('百度网盘', work.downloadLinks.baidu)}
              {renderDownloadLink('夸克网盘', work.downloadLinks.quark)}
            </div>
          </div>

          <div className="modal-actions">
            <a
              className="button button-line"
              href={work.detailImages[0] ?? work.cover}
              target="_blank"
              rel="noreferrer"
              referrerPolicy="no-referrer"
            >
              查看预览图
            </a>
            <button className="button button-line" type="button" onClick={onClose}>
              返回作品库
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkDetailModal;
