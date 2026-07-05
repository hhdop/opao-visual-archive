import { useMemo, useState } from 'react';
import { categories, type Work, type WorkCategory } from '../data/works';
import WorkCard from './WorkCard';

type ArchiveGridProps = {
  works: Work[];
  onSelectWork: (work: Work) => void;
};

function ArchiveGrid({ works, onSelectWork }: ArchiveGridProps) {
  const [activeCategory, setActiveCategory] = useState<WorkCategory | 'All'>('All');

  const visibleWorks = useMemo(() => {
    if (activeCategory === 'All') {
      return works;
    }

    return works.filter((work) => work.category === activeCategory);
  }, [activeCategory, works]);

  return (
    <section className="section archive-section scroll-reveal" id="archive" aria-labelledby="archive-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="section-label">Archive</p>
            <h2 id="archive-title">作品归档</h2>
          </div>
          <p>
            按创作类型整理的作品记录。这里不是完整时间线，而是一个持续更新的个人视觉档案。
          </p>
        </div>

        <div className="category-tabs" aria-label="作品分类">
          {categories.map((category) => (
            <button
              className={category.value === activeCategory ? 'is-active' : ''}
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
            >
              <span>{category.label}</span>
              <small>{category.zh}</small>
            </button>
          ))}
        </div>

        <div className="archive-grid stagger-children">
          {visibleWorks.map((work, index) => (
            <WorkCard key={work.id} work={work} index={index} onSelect={() => onSelectWork(work)} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArchiveGrid;
