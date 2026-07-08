import { useMemo, useState, type CSSProperties } from 'react';
import type { Work } from '../data/works';

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

const libraryFilters: Array<{ label: string; value: Work['orientation'] | 'All' }> = [
  { label: '全部', value: 'All' },
  { label: '竖图', value: 'portrait' },
  { label: '横图', value: 'landscape' },
  { label: '方图', value: 'square' },
];

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
  const [activeFilter, setActiveFilter] = useState<Work['orientation'] | 'All'>('All');
  const [query, setQuery] = useState('');

  const filteredWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return works.filter((work) => {
      const matchesFilter = activeFilter === 'All' || work.orientation === activeFilter;
      const searchableText = [
        work.title,
        work.dimensions.label,
        work.orientation,
        ...work.tags,
      ]
        .join(' ')
        .toLowerCase();

      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeFilter, query, works]);

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
          {libraryFilters.map((filter) => (
            <button
              key={filter.value}
              className={filter.value === activeFilter ? 'is-active' : ''}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
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
                          <em>{work.accessNote}</em>
                        </span>
                        <span className="asset-meta">
                          创作于 {work.year}　{work.dimensions.label}
                        </span>
                        <span className="asset-links">百度网盘 / 夸克网盘</span>
                      </span>
                    </button>
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
