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
  firstIndex: number;
  works: Work[];
};

const libraryFilters: Array<{ label: string; value: Work['orientation'] | 'All' }> = [
  { label: '全部', value: 'All' },
  { label: '竖图', value: 'portrait' },
  { label: '横图', value: 'landscape' },
  { label: '方图', value: 'square' },
];

function getOrientationLabel(work: Work) {
  if (work.orientation === 'landscape') {
    return '横图';
  }

  if (work.orientation === 'square') {
    return '方图';
  }

  return '竖图';
}

function getGroupTitle(work: Work) {
  return `${getOrientationLabel(work)} ${work.dimensions.label}`;
}

function getGroupNote(work: Work) {
  if (work.orientation === 'landscape') {
    return '同一横向比例的作品会收在这一排，适合头图、宽屏预览和横幅展示。';
  }

  if (work.orientation === 'square') {
    return '同一方图比例的作品会收在这一排，适合头像、封面和社媒预览。';
  }

  return '同一竖向尺寸的作品会收在这一排，方便之后继续补图和整理原图链接。';
}

function hasPendingLinks(work: Work) {
  return work.downloadLinks.baidu === '#' && work.downloadLinks.quark === '#';
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
        getOrientationLabel(work),
        ...work.tags,
      ]
        .join(' ')
        .toLowerCase();

      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeFilter, query, works]);

  const groups = useMemo(() => {
    const groupMap = new Map<string, LibraryGroup>();

    filteredWorks.forEach((work, index) => {
      const title = getGroupTitle(work);
      const key = `${work.orientation}-${work.dimensions.width}x${work.dimensions.height}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          key,
          title,
          note: getGroupNote(work),
          firstIndex: index,
          works: [],
        });
      }

      groupMap.get(key)?.works.push(work);
    });

    return Array.from(groupMap.values()).sort((a, b) => {
      const order = ['portrait', 'landscape', 'square'];
      const aOrder = order.findIndex((item) => a.key.startsWith(item));
      const bOrder = order.findIndex((item) => b.key.startsWith(item));

      return aOrder - bOrder || b.works.length - a.works.length || a.firstIndex - b.firstIndex;
    });
  }, [filteredWorks]);

  return (
    <section className="library-page" id="home" aria-labelledby="library-title">
      <div className="library-shell">
        <div className="library-search-row" id="archive">
          <h1 id="library-title">画画的 o 泡作品库</h1>
          <label className="library-search">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索作品名、尺寸、标签..."
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
          <span className="toolbar-filter">筛选</span>
          <span className="is-active">最近更新</span>
          <span>按尺寸分组</span>
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
                          <strong title={work.title}>{work.title}</strong>
                          <em>{work.accessNote}</em>
                        </span>
                        <span className="asset-meta">
                          创作于 {work.year} · {work.dimensions.label}
                        </span>
                        <span className="asset-links">
                          {hasPendingLinks(work) ? '网盘链接待补' : '百度网盘 / 夸克网盘'}
                        </span>
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
