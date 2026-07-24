export function serviceCategoryPath(categoryName = '') {
  const name = String(categoryName || '').toLowerCase();
  if (name.includes('commercial')) return '/commercial';
  return '/residential';
}

export function serviceCategoryLabel(categoryName = '') {
  const name = String(categoryName || '').toLowerCase();
  if (name.includes('commercial')) return 'Commercial';
  return 'Residential';
}

export function serviceDetailPath(service) {
  if (!service) return '/residential';
  if (typeof service === 'string') return `/services/${service}`;
  if (service.slug) return `/services/${service.slug}`;
  return serviceCategoryPath(service.categoryName);
}

export function projectDetailPath(project) {
  if (!project) return '/projects';
  if (typeof project === 'string') return `/projects/${project}`;
  if (project.slug) return `/projects/${project.slug}`;
  if (project.link?.startsWith('/projects/')) return project.link;
  if (project.link) return project.link;
  return '/projects';
}
