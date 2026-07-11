import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
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

type AssetThumbnailProps = {
  cover: string;
  priority: boolean;
};

const libraryFilters: Array<{ label: string; value: Work['orientation'] | 'All' }> = [
  { label: '全部', value: 'All' },
  { label: '竖图', value: 'portrait' },
  { label: '横图', value: 'landscape' },
  { label: '方图', value: 'square' },
];

const preferredSubjects = ['华晨宇', '侯明昊', '檀健次', '个人练习'];

type SortMode = 'recent' | 'created';

function getOrientationLabel(work: Work) {
  if (work.orientation === 'landscape') {
    return '横图';
  }

  if (work.orientation === 'square') {
    return '方图';
  }

  return '竖图';
}

function getWorkSubject(work: Work) {
  return work.subject;
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

function AssetThumbnail({ cover, priority }: AssetThumbnailProps) {
  const thumbnailRef = useRef<HTMLSpanElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);

  useEffect(() => {
    if (shouldLoad || !thumbnailRef.current) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '720px 0px' },
    );

    observer.observe(thumbnailRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <span
      ref={thumbnailRef}
      className={`asset-thumb${shouldLoad ? ' is-loaded' : ''}`}
      style={shouldLoad ? ({ '--cover': `url(${cover})` } as CSSProperties) : undefined}
      aria-hidden="true"
    />
  );
}

function MaterialLibrary({ works, onSelectWork }: MaterialLibraryProps) {
  const [activeFilter, setActiveFilter] = useState<Work['orientation'] | 'All'>('All');
  const [activeSubject, setActiveSubject] = useState('全部');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [query, setQuery] = useState('');

  const subjectFilters = useMemo(() => {
    const availableSubjects = new Set(works.map((work) => work.subject));
    const orderedSubjects = preferredSubjects.filter((subject) => availableSubjects.has(subject) || subject === '侯明昊');
    const additionalSubjects = [...availableSubjects]
      .filter((subject) => !preferredSubjects.includes(subject))
      .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));

    return ['全部', ...orderedSubjects, ...additionalSubjects];
  }, [works]);

  const filteredWorks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return works
      .filter((work) => {
      const matchesFilter = activeFilter === 'All' || work.orientation === activeFilter;
      const matchesSubject = activeSubject === '全部' || getWorkSubject(work) === activeSubject;
      const searchableText = [
        work.title,
        work.dimensions.label,
        getOrientationLabel(work),
        getWorkSubject(work),
        ...work.tags,
      ]
        .join(' ')
        .toLowerCase();

      return matchesFilter && matchesSubject && (!normalizedQuery || searchableText.includes(normalizedQuery));
      })
      .sort((a, b) => {
        if (sortMode === 'created') {
          return Number(b.year) - Number(a.year) || b.sortOrder - a.sortOrder;
        }

        return b.sortOrder - a.sortOrder;
      });
  }, [activeFilter, activeSubject, query, sortMode, works]);

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
          <div className="sort-filters" aria-label="作品排序">
            <button
              type="button"
              className={sortMode === 'recent' ? 'is-active' : ''}
              onClick={() => setSortMode('recent')}
            >
              最近更新
            </button>
            <button
              type="button"
              className={sortMode === 'created' ? 'is-active' : ''}
              onClick={() => setSortMode('created')}
            >
              创作时间
            </button>
          </div>
          <div className="subject-filters" aria-label="人物分类">
            {subjectFilters.map((subject) => (
              <button
                key={subject}
                type="button"
                className={subject === activeSubject ? 'is-active' : ''}
                onClick={() => setActiveSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
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
                </div>

                <div className={`asset-grid is-${group.works[0]?.orientation ?? 'portrait'}`}>
                  {group.works.map((work, workIndex) => (
                    <button
                      className={`asset-card is-${work.orientation}`}
                      type="button"
                      key={work.id}
                      onClick={() => onSelectWork(work)}
                      style={
                        {
                          '--focus': work.focus,
                          '--work-aspect': work.aspectRatio,
                        } as CSSProperties
                      }
                    >
                      <AssetThumbnail cover={work.cover} priority={group.firstIndex === 0 && workIndex < 5} />
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
