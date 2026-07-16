function getDocumentBaseUrl() {
  if (typeof document !== 'undefined') {
    return document.baseURI;
  }

  return 'http://localhost/';
}

export function resolveAssetUrl(assetPath: string, baseUrl = getDocumentBaseUrl()) {
  const normalizedPath = assetPath.replace(/^\/+/, '');
  return new URL(normalizedPath, baseUrl).href;
}

export function toCssAssetUrl(assetPath: string, baseUrl?: string) {
  return `url("${resolveAssetUrl(assetPath, baseUrl)}")`;
}
