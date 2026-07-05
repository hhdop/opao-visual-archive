import type { CSSProperties } from 'react';
import type { Work } from '../data/works';

type FeaturedWorksProps = {
  works: Work[];
  onSelectWork: (work: Work) => void;
};

function FeaturedWorks({ works, onSelectWork }: FeaturedWorksProps) {
  const [lead, ...rest] = works;

  if (!lead) {
    return null;
  }

  return (
    <section className="section featured-section scroll-reveal" id="featured" aria-labelledby="featured-title">
      <div className="container">
        <div className="section-heading editorial-heading">
          <div>
            <p className="section-label">Featured Works</p>
            <h2 id="featured-title">本期精选</h2>
          </div>
          <p>
            一些近期完成、风格相对完整的作品，被整理进这一期视觉档案中。
          </p>
        </div>

        <div className="featured-layout">
          <button
            className={`featured-lead artwork-surface is-${lead.orientation}`}
            type="button"
            onClick={() => onSelectWork(lead)}
            style={{ '--cover': `url(${lead.cover})` } as CSSProperties}
          >
            <span className="featured-ribbon">Selected Cover</span>
            <span className="featured-info">
              <strong>{lead.title}</strong>
              <small>
                {lead.year} / {lead.category}
              </small>
            </span>
          </button>

          <div className="featured-copy">
            <p className="archive-note">
              这些作品更接近我目前想保留的画面方向：克制的色彩、带一点故事感的光线，以及不完全磨平的厚涂笔触。
            </p>
            <div className="featured-stack stagger-children">
              {rest.map((work, index) => (
                <button
                  className="featured-row"
                  type="button"
                  key={work.id}
                  onClick={() => onSelectWork(work)}
                >
                  <span>0{index + 2}</span>
                  <strong>{work.title}</strong>
                  <em>{work.referenceForCommission ? '可作为约稿参考' : '作品档案'}</em>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorks;
