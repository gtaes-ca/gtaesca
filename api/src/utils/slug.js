export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ensureUniqueSlug(baseSlug, usedSlugs, { excludeSlug } = {}) {
  const normalizedBase = slugify(baseSlug) || 'item';
  let slug = normalizedBase;
  let counter = 2;

  while (usedSlugs.has(slug) && slug !== excludeSlug) {
    slug = `${normalizedBase}-${counter}`;
    counter += 1;
  }

  return slug;
}

export function buildUniqueSlugs(items, getBaseSlug, getExistingSlug) {
  const usedSlugs = new Set();

  return items.map((item) => {
    const existingSlug = slugify(getExistingSlug(item));
    const baseSlug = slugify(getBaseSlug(item)) || 'item';
    const slug = existingSlug && !usedSlugs.has(existingSlug)
      ? existingSlug
      : ensureUniqueSlug(baseSlug, usedSlugs);

    usedSlugs.add(slug);
    return { ...item, slug };
  });
}
