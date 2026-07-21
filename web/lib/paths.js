export function serviceDetailPath(service) {
  if (!service) return '/services';
  if (typeof service === 'string') return `/services/${service}`;
  if (service.slug) return `/services/${service.slug}`;
  return '/services';
}

export function projectDetailPath(project) {
  if (!project) return '/projects';
  if (typeof project === 'string') return `/projects/${project}`;
  if (project.slug) return `/projects/${project.slug}`;
  if (project.link?.startsWith('/projects/')) return project.link;
  if (project.link) return project.link;
  return '/projects';
}
