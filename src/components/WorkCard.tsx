import type { CSSProperties } from 'react';
import type { Work } from '../data/works';

type WorkCardProps = {
  work: Work;
  index: number;
  onSelect: () => void;
};

function WorkCard({ work, index, onSelect }: WorkCardProps) {
  const hoverText = work.referenceForCommission ? '可参考约稿' : index % 2 === 0 ? '查看档案' : '查看详情';

  return (
    <button
      className={`work-card is-${work.orientation} ${index % 3 === 0 ? 'is-tall' : ''}`}
      type="button"
      onClick={onSelect}
      style={
        {
          '--cover': `url(${work.cover})`,
          '--focus': work.focus,
          '--work-aspect': work.aspectRatio,
        } as CSSProperties
      }
    >
      <span className="work-card-image" aria-hidden="true" />
      <span className="work-card-body">
        <span className="work-card-kicker">
          {work.year} / {work.category}
        </span>
        <strong>{work.title}</strong>
        <span className="work-card-tags">{work.tags.slice(0, 2).join(' · ')}</span>
      </span>
      <span className="work-card-hover">{hoverText}</span>
    </button>
  );
}

export default WorkCard;
