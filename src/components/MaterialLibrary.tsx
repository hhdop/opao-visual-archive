import { useMemo, useState, type CSSProperties } from 'react';
import { categories, type Work, type WorkCategory } from '../data/works';

type MaterialLibraryProps = {
  works: Work[];
  onSelectWork: (work: Work) => void;
};

type LibraryGroup = {
  key: string;
  title: string;
  note: string;
  works: Work[];
};

const categoryCopy: Record<WorkCategory | 'All', string> = {
  All: '全部',
  'Fan Portraits': '明星同人',
  'Selected Works': '精选作品',
  'Original Sketches': '原创练习',
  'Commission Reference': '约稿参考',
};

function getGroupTitle(work: Work) {
  if (work.orientation === 'landscape') {
    return `横图 ${work.dimensions.label}`;
  }

  if (work.orientation === 'square') {
    return `方图 ${work.dimensions.label}`;
  }

  return `竖图 ${work.dimensions.label}`;
}

function getGroupNote(work: Work) {
  if (work.orientation === 'landscape') {
    return '适合横幅、头图、宽屏预览。';
  }

  if (work.orientation === 'square') {
    return '适合头像、封面与社媒预览。';
  }

  return '适合原图领取、长图浏览与作品细节查看。';
}

function MaterialLibrary({ works, onSelectWork }: MaterialLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<WorkCategory | 'All'>('All');
  const [query, setQuery] = useState('');

  const filteredWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return works.filter((work) => {
      const matchesCategory = activeCategory === 'All' || work.category === activeCategory;
      const searchableText = [
        work.title,
        work.category,
        work.dimensions.label,
        work.orientation,
        ...work.tags,
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeCategory, query, works]);

  const groups = useMemo(() => {
    const groupMap = new Map<string, LibraryGroup>();

    filteredWorks.forEach((work) => {
      const title = getGroupTitle(work);
      const key = `${work.orientation}-${work.dimensions.label}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          key,
          title,
          note: getGroupNote(work),
          works: [],
        });
      }

      groupMap.get(key)?.works.push(work);
    });

    return Array.from(groupMap.values()).sort((a, b) => {
      const order = ['portrait', 'landscape', 'square'];
      const aOrder = order.findIndex((item) => a.key.startsWith(item));
      const bOrder = order.findIndex((item) => b.key.startsWith(item));

      return aOrder - bOrder || a.title.localeCompare(b.title, 'zh-Hans-CN');
    });
  }, [filteredWorks]);

  return (
    <section className="library-page" id="home" aria-labelledby="library-title">
      <div className="library-shell">
        <div className="library-search-row" id="archive" aria-labelledby="library-title">
          <h1 id="library-title">作品素材库</h1>
          <label className="library-search">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索作品名、标签、尺寸..."
              aria-label="搜索作品"
            />
            <span aria-hidden="true">⌕</span>
          </label>
        </div>

        <nav className="library-tabs" aria-label="作品分类">
          {categories.map((category) => (
            <button
              key={category.value}
              className={category.value === activeCategory ? 'is-active' : ''}
              type="button"
              onClick={() => setActiveCategory(category.value)}
            >
              {categoryCopy[category.value]}
            </button>
          ))}
        </nav>

        <div className="library-toolbar" aria-label="作品筛选信息">
          <button type="button">筛选</button>
          <span className="is-active">最近更新</span>
          <span>尺寸分组</span>
          <span>{filteredWorks.length} 件作品</span>
        </div>

        <div className="library-groups">
          {groups.length ? (
            groups.map((group) => (
              <section className="library-group" key={group.key} aria-labelledby={`${group.key}-title`}>
                <div className="library-group-head">
                  <div>
                    <h2 id={`${group.key}-title`}>{group.title}</h2>
                    <p>{group.note}</p>
                  </div>
                  <span>{group.works.length} items</span>
                </div>

                <div className={`asset-grid is-${group.works[0]?.orientation ?? 'portrait'}`}>
                  {group.works.map((work) => (
                    <button
                      className={`asset-card is-${work.orientation}`}
                      type="button"
                      key={work.id}
                      onClick={() => onSelectWork(work)}
                      style={
                        {
                          '--cover': `url(${work.cover})`,
                          '--focus': work.focus,
                          '--work-aspect': work.aspectRatio,
                        } as CSSProperties
                      }
                    >
                      <span className="asset-thumb" aria-hidden="true" />
                      <span className="asset-copy">
                        <span className="asset-title-line">
                          <i aria-hidden="true" />
                          <strong>{work.title}</strong>
                          <em>原图</em>
                        </span>
                        <span className="asset-meta">
                          {categoryCopy[work.category]}　{work.dimensions.label}　{work.year}
                        </span>
                        <span className="asset-tags">{work.tags.slice(0, 4).join('　')}</span>
                      </span>
                    </button>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - group.works.length) }).map((_, index) => (
                    <div className="asset-card asset-placeholder" key={`${group.key}-placeholder-${index}`}>
                      <span className="asset-thumb" aria-hidden="true" />
                      <span className="asset-copy">
                        <span className="asset-title-line">
                          <i aria-hidden="true" />
                          <strong>预留作品位</strong>
                        </span>
                        <span className="asset-meta">后续替换同尺寸作品</span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="library-empty">
              <strong>没有找到对应作品</strong>
              <p>换一个关键词，或先回到全部分类。</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MaterialLibrary;
