export type WorkCategory =
  | 'Fan Portraits'
  | 'Selected Works'
  | 'Original Sketches'
  | 'Commission Reference';

export type WorkSubject = string;

export type Work = {
  id: string;
  title: string;
  category: WorkCategory;
  subject: WorkSubject;
  sortOrder: number;
  cover: string;
  year: string;
  description: string;
  tags: string[];
  featured: boolean;
  referenceForCommission: boolean;
  detailImages: string[];
  orientation: 'portrait' | 'landscape' | 'square';
  focus: string;
  aspectRatio: string;
  dimensions: {
    width: number;
    height: number;
    label: string;
  };
  accessNote: string;
  downloadLinks: {
    baidu: string;
    quark: string;
  };
};

const pendingLinks = {
  baidu: '#',
  quark: '#',
};

export const works: Work[] = [
  {
    id: 'huahua-2025-0412',
    title: '25-0412-华晨宇',
    category: 'Fan Portraits',
    subject: '华晨宇',
    sortOrder: 120,
    cover: 'works/huahua-2025-0412-preview.webp',
    year: '2025',
    description: '',
    tags: ['华晨宇', '明星同人', '厚涂人像', '5400x7200'],
    featured: true,
    referenceForCommission: false,
    detailImages: ['works/huahua-2025-0412-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5400 / 7200',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'honfa',
    title: '红发-华晨宇',
    category: 'Fan Portraits',
    subject: '华晨宇',
    sortOrder: 110,
    cover: 'works/honfa-preview.webp',
    year: '2026',
    description: '',
    tags: ['华晨宇', '明星同人', '红发', '5400x7200'],
    featured: true,
    referenceForCommission: false,
    detailImages: ['works/honfa-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5400 / 7200',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'tjc',
    title: '粉丝投稿-檀健次',
    category: 'Fan Portraits',
    subject: '檀健次',
    sortOrder: 100,
    cover: 'works/tjc-preview.webp',
    year: '2026',
    description: '',
    tags: ['檀健次', '粉丝投稿', '明星同人', '5400x7200'],
    featured: false,
    referenceForCommission: false,
    detailImages: ['works/tjc-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5400 / 7200',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'huahua-0401',
    title: '花花4.1难度高-华晨宇',
    category: 'Fan Portraits',
    subject: '华晨宇',
    sortOrder: 90,
    cover: 'works/huahua-0401-preview.webp',
    year: '2026',
    description: '',
    tags: ['华晨宇', '明星同人', '厚涂人像', '5400x7200'],
    featured: false,
    referenceForCommission: false,
    detailImages: ['works/huahua-0401-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5400 / 7200',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'huahua-field',
    title: '花花风景-华晨宇',
    category: 'Selected Works',
    subject: '华晨宇',
    sortOrder: 80,
    cover: 'works/huahua-field-preview.webp',
    year: '2026',
    description: '',
    tags: ['华晨宇', '明星同人', '场景', '5400x7200'],
    featured: true,
    referenceForCommission: false,
    detailImages: ['works/huahua-field-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5400 / 7200',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'huahua-red-1',
    title: '花花红发1-华晨宇',
    category: 'Fan Portraits',
    subject: '华晨宇',
    sortOrder: 70,
    cover: 'works/huahua-red-1-preview.webp',
    year: '2026',
    description: '',
    tags: ['华晨宇', '明星同人', '红发', '5400x7200'],
    featured: false,
    referenceForCommission: false,
    detailImages: ['works/huahua-red-1-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5400 / 7200',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'huahua-red-recline',
    title: '花花红发躺-华晨宇',
    category: 'Fan Portraits',
    subject: '华晨宇',
    sortOrder: 60,
    cover: 'works/huahua-red-recline-preview.webp',
    year: '2026',
    description: '',
    tags: ['华晨宇', '明星同人', '红发', '5400x7200'],
    featured: false,
    referenceForCommission: false,
    detailImages: ['works/huahua-red-recline-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5400 / 7200',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'huahua-red-3',
    title: '花花红发3-华晨宇',
    category: 'Fan Portraits',
    subject: '华晨宇',
    sortOrder: 50,
    cover: 'works/huahua-red-3-preview.webp',
    year: '2026',
    description: '',
    tags: ['华晨宇', '明星同人', '红发', '5400x7200'],
    featured: false,
    referenceForCommission: false,
    detailImages: ['works/huahua-red-3-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5400 / 7200',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'huahua-white',
    title: '花花-华晨宇',
    category: 'Fan Portraits',
    subject: '华晨宇',
    sortOrder: 40,
    cover: 'works/huahua-white-preview.webp',
    year: '2026',
    description: '',
    tags: ['华晨宇', '明星同人', '厚涂人像', '5400x7140'],
    featured: false,
    referenceForCommission: false,
    detailImages: ['works/huahua-white-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5400 / 7140',
    dimensions: {
      width: 5400,
      height: 7140,
      label: '5400 × 7140',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'huahua-bangs',
    title: '花花碎盖-华晨宇',
    category: 'Fan Portraits',
    subject: '华晨宇',
    sortOrder: 30,
    cover: 'works/huahua-bangs-preview.webp',
    year: '2026',
    description: '',
    tags: ['华晨宇', '明星同人', '厚涂人像', '1080x1434'],
    featured: false,
    referenceForCommission: false,
    detailImages: ['works/huahua-bangs-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '1080 / 1434',
    dimensions: {
      width: 1080,
      height: 1434,
      label: '1080 × 1434',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'portrait-1126',
    title: '23-1112-个人练习',
    category: 'Original Sketches',
    subject: '个人练习',
    sortOrder: 20,
    cover: 'works/portrait-1126-preview.webp',
    year: '2023',
    description: '',
    tags: ['个人练习', '原创练习', '厚涂人像', '5000x7000'],
    featured: false,
    referenceForCommission: false,
    detailImages: ['works/portrait-1126-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '5000 / 7000',
    dimensions: {
      width: 5000,
      height: 7000,
      label: '5000 × 7000',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
  {
    id: 'huahua-dusk',
    title: '黄昏战神-华晨宇',
    category: 'Fan Portraits',
    subject: '华晨宇',
    sortOrder: 10,
    cover: 'works/huahua-dusk-preview.webp',
    year: '2026',
    description: '',
    tags: ['华晨宇', '明星同人', '厚涂人像', '7200x10800'],
    featured: true,
    referenceForCommission: false,
    detailImages: ['works/huahua-dusk-preview.webp'],
    orientation: 'portrait',
    focus: 'center',
    aspectRatio: '7200 / 10800',
    dimensions: {
      width: 7200,
      height: 10800,
      label: '7200 × 10800',
    },
    accessNote: '原图可领取',
    downloadLinks: pendingLinks,
  },
];

export const categories: Array<{ label: string; zh: string; value: WorkCategory | 'All' }> = [
  { label: 'All', zh: '全部', value: 'All' },
  { label: 'Fan Portraits', zh: '明星同人', value: 'Fan Portraits' },
  { label: 'Selected Works', zh: '精选作品', value: 'Selected Works' },
  { label: 'Original Sketches', zh: '原创练习', value: 'Original Sketches' },
  { label: 'Commission Reference', zh: '约稿参考', value: 'Commission Reference' },
];
