import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const projectRoot = resolve(import.meta.dirname, '..');
const publicDirectory = resolve(projectRoot, 'public');
const worksFile = resolve(projectRoot, 'src/data/works.ts');
const maxPreviewBytes = 500 * 1024;
const validOrientations = new Set(['portrait', 'landscape', 'square']);
const validImageExtensions = new Set(['.avif', '.jpg', '.jpeg', '.png', '.webp']);
const errors = [];
const warnings = [];

function reportError(message) {
  errors.push(message);
}

function loadWorks() {
  const source = readFileSync(worksFile, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const module = { exports: {} };
  new Function('exports', 'module', compiled.outputText)(module.exports, module);
  return module.exports.works;
}

function isSafeExternalUrl(value) {
  if (value === '#') {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function checkAssetPath(path, label) {
  if (typeof path !== 'string' || !path.startsWith('works/') || path.includes('..')) {
    reportError(`${label}: preview path must stay inside public/works.`);
    return;
  }

  const filePath = resolve(publicDirectory, path);
  if (!filePath.startsWith(publicDirectory) || !existsSync(filePath)) {
    reportError(`${label}: preview file not found: ${path}`);
    return;
  }

  const extension = path.slice(path.lastIndexOf('.')).toLowerCase();
  if (!validImageExtensions.has(extension)) {
    reportError(`${label}: unsupported preview format: ${extension}`);
  }

  const size = statSync(filePath).size;
  if (size > maxPreviewBytes) {
    warnings.push(`${label}: preview is ${(size / 1024).toFixed(0)}KB; aim for 500KB or less.`);
  }
}

function validateWork(work, index, seenIds, seenSortOrders) {
  const label = `Work ${index + 1}${work?.id ? ` (${work.id})` : ''}`;

  if (!work || typeof work !== 'object') {
    reportError(`${label}: invalid work entry.`);
    return;
  }

  if (!/^[a-z0-9-]+$/.test(work.id ?? '')) {
    reportError(`${label}: id must use lowercase letters, numbers, and hyphens only.`);
  } else if (seenIds.has(work.id)) {
    reportError(`${label}: duplicate id.`);
  } else {
    seenIds.add(work.id);
  }

  if (typeof work.title !== 'string' || !work.title.trim()) {
    reportError(`${label}: missing title.`);
  }

  if (typeof work.subject !== 'string' || !work.subject.trim()) {
    reportError(`${label}: missing subject category.`);
  }

  if (!validOrientations.has(work.orientation)) {
    reportError(`${label}: unsupported orientation.`);
  }

  if (!Number.isInteger(work.sortOrder)) {
    reportError(`${label}: sortOrder must be an integer.`);
  } else if (seenSortOrders.has(work.sortOrder)) {
    reportError(`${label}: duplicate sortOrder.`);
  } else {
    seenSortOrders.add(work.sortOrder);
  }

  if (!/^\d{4}$/.test(work.year ?? '')) {
    reportError(`${label}: year must use four digits.`);
  }

  const { width, height, label: dimensionsLabel } = work.dimensions ?? {};
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    reportError(`${label}: invalid image dimensions.`);
  } else {
    const expectedAspectRatio = `${width} / ${height}`;
    if (work.aspectRatio !== expectedAspectRatio) {
      reportError(`${label}: aspectRatio must match dimensions (${expectedAspectRatio}).`);
    }

    if (typeof dimensionsLabel !== 'string' || !dimensionsLabel.includes(String(width)) || !dimensionsLabel.includes(String(height))) {
      reportError(`${label}: dimensions label must include width and height.`);
    }
  }

  checkAssetPath(work.cover, label);

  if (!Array.isArray(work.detailImages) || !work.detailImages.length) {
    reportError(`${label}: at least one detail image is required.`);
  } else {
    work.detailImages.forEach((path, detailIndex) => checkAssetPath(path, `${label}, detail image ${detailIndex + 1}`));
  }

  for (const [provider, url] of Object.entries(work.downloadLinks ?? {})) {
    if (typeof url !== 'string' || !isSafeExternalUrl(url)) {
      reportError(`${label}: ${provider} link must be # or https.`);
    }
  }
}

let works;

try {
  works = loadWorks();
} catch (error) {
  console.error('Unable to read src/data/works.ts.');
  console.error(error);
  process.exit(1);
}

if (!Array.isArray(works) || !works.length) {
  reportError('No artwork entries found.');
} else {
  const seenIds = new Set();
  const seenSortOrders = new Set();
  works.forEach((work, index) => validateWork(work, index, seenIds, seenSortOrders));
}

warnings.forEach((warning) => console.warn(`Warning: ${warning}`));

if (errors.length) {
  errors.forEach((error) => console.error(`Error: ${error}`));
  process.exit(1);
}

console.log(`Content check passed: ${works.length} artwork entries verified.`);
