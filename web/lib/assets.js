export function assetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/')) return path;
  return `/${path.replace(/^\/+/, '')}`;
}
