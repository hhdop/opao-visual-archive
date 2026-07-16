import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const helperPath = new URL('../src/utils/assets.ts', import.meta.url);
const componentPaths = [
  new URL('../src/components/Hero.tsx', import.meta.url),
  new URL('../src/components/FeaturedWorks.tsx', import.meta.url),
  new URL('../src/components/MaterialLibrary.tsx', import.meta.url),
  new URL('../src/components/WorkCard.tsx', import.meta.url),
];

test('CSS artwork URLs resolve from the document base', async () => {
  assert.ok(existsSync(helperPath), 'src/utils/assets.ts is missing');

  const { toCssAssetUrl } = await import(helperPath.href);
  const documentBase = 'https://hhdop.github.io/opao-visual-archive/';

  assert.equal(
    toCssAssetUrl('works/sample.webp', documentBase),
    'url("https://hhdop.github.io/opao-visual-archive/works/sample.webp")',
  );
  assert.doesNotMatch(toCssAssetUrl('works/sample.webp', documentBase), /\/assets\/works\//);
});

test('components do not place unresolved relative paths in CSS url()', () => {
  for (const componentPath of componentPaths) {
    const source = readFileSync(componentPath, 'utf8');

    assert.doesNotMatch(
      source,
      /`url\(\$\{(?:cover|work\.cover|lead\.cover)\}\)`/,
      `${componentPath.pathname} still creates a relative CSS URL`,
    );
  }
});
