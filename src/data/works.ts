export type WorkCategory =
  | 'Fan Portraits'
  | 'Selected Works'
  | 'Original Sketches'
  | 'Commission Reference';

export type Work = {
  id: string;
  title: string;
  category: WorkCategory;
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
};

export const works: Work[] = [
  {
    id: 'huahua-dusk',
    title: '花花黄昏',
    category: 'Fan Portraits',
    cover: 'works/huahua-dusk-preview.webp',
    year: '2026',
    description: '偏舞台光感的明星同人厚涂，重点保留黄昏与冷色背景之间的反差，以及半透明衣料的柔光层次。',
    tags: ['明星同人', '厚涂人像', '舞台光感', '黄昏色调'],
    featured: true,
    referenceForCommission: false,
    detailImages: ['works/huahua-dusk.png'],
    orientation: 'portrait',
    focus: 'center 18%',
    aspectRatio: '2 / 3',
    dimensions: {
      width: 7200,
      height: 10800,
      label: '7200 × 10800',
    },
    accessNote: '原图可领取',
  },
  {
    id: 'huahua-blonde-profile',
    title: '金发侧影',
    category: 'Fan Portraits',
    cover: 'works/huahua-blonde-preview.webp',
    year: '2026',
    description: '黑灰底色里的金发侧脸练习，画面更接近杂志封面式的局部肖像，带一点图形化装饰与冷调边框。',
    tags: ['明星同人', '侧颜肖像', '金发', '杂志感构图'],
    featured: true,
    referenceForCommission: false,
    detailImages: ['works/huahua-blonde.png'],
    orientation: 'portrait',
    focus: 'center 34%',
    aspectRatio: '3 / 4',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
  },
  {
    id: 'huahua-field-scene',
    title: '风景场景',
    category: 'Selected Works',
    cover: 'works/huahua-field-preview.webp',
    year: '2026',
    description: '带有自编场景的半身画面，人物、风景与叙事小元素放在同一张视觉档案里，整体更偏故事感。',
    tags: ['明星同人', '场景绘画', '半身画面', '叙事氛围'],
    featured: true,
    referenceForCommission: false,
    detailImages: ['works/huahua-field.png'],
    orientation: 'portrait',
    focus: '42% 24%',
    aspectRatio: '3 / 4',
    dimensions: {
      width: 5400,
      height: 7200,
      label: '5400 × 7200',
    },
    accessNote: '原图可领取',
  },
  {
    id: 'luyuxiao-profile',
    title: '卢昱晓侧颜',
    category: 'Selected Works',
    cover: 'works/luyuxiao-profile-preview.webp',
    year: '2026',
    description: '横向侧颜肖像，画面留出大量深色背景与微光线条，更适合在网页中作为横幅或精选辅助图展示。',
    tags: ['明星同人', '数字肖像', '横幅构图', '柔光侧颜'],
    featured: true,
    referenceForCommission: false,
    detailImages: ['works/luyuxiao-profile.png'],
    orientation: 'landscape',
    focus: 'center 42%',
    aspectRatio: '16 / 9',
    dimensions: {
      width: 7680,
      height: 4320,
      label: '7680 × 4320',
    },
    accessNote: '原图可领取',
  },
];

export const categories: Array<{ label: string; zh: string; value: WorkCategory | 'All' }> = [
  { label: 'All', zh: '全部', value: 'All' },
  { label: 'Fan Portraits', zh: '明星同人', value: 'Fan Portraits' },
  { label: 'Selected Works', zh: '精选作品', value: 'Selected Works' },
  { label: 'Original Sketches', zh: '原创练习', value: 'Original Sketches' },
  { label: 'Commission Reference', zh: '约稿参考', value: 'Commission Reference' },
];
