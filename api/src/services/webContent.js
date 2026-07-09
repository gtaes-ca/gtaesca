import { randomUUID } from 'crypto';
import pool from '../db.js';
import { saveCmsImage } from './cmsImage.js';

const DEFAULT_TOPBAR = {
  email: 'example@gamil.com',
  address: '12 Green Road, 05 New York',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  },
};

const DEFAULT_SLIDER_SLIDES = [
  {
    subTitle: 'Service Company',
    titleLine1: 'Bright Solutions',
    titleLine2: 'for Dark Problems',
    text: 'We have been operating for over a decade, providing top-notch services to our clients',
    buttonText: 'Learn More',
    buttonLink: '/about',
    backgroundImage: 'assets/images/backgrounds/slider-1-1.jpg',
    backgroundImageMobile: 'assets/images/backgrounds/slider-1-1.jpg',
  },
  {
    subTitle: 'Service Company',
    titleLine1: 'Bright Solutions',
    titleLine2: 'for Dark Problems',
    text: 'We have been operating for over a decade, providing top-notch services to our clients',
    buttonText: 'Learn More',
    buttonLink: '/about',
    backgroundImage: 'assets/images/backgrounds/slider-1-2.jpg',
    backgroundImageMobile: 'assets/images/backgrounds/slider-1-2.jpg',
  },
  {
    subTitle: 'Service Company',
    titleLine1: 'Bright Solutions',
    titleLine2: 'for Dark Problems',
    text: 'We have been operating for over a decade, providing top-notch services to our clients',
    buttonText: 'Learn More',
    buttonLink: '/about',
    backgroundImage: 'assets/images/backgrounds/slider-1-3.jpg',
    backgroundImageMobile: 'assets/images/backgrounds/slider-1-3.jpg',
  },
];

const DEFAULT_HOME_SERVICES = {
  items: [
    {
      title: 'Fair & Transparent Pricing',
      text: 'Honest upfront quotes with no hidden fees on residential and commercial electrical work.',
      link: '/services',
      icon: 'icon-affordable-price',
    },
    {
      title: 'Licensed & Insured',
      text: 'ESA-certified electricians delivering safe, code-compliant work backed by our satisfaction guarantee.',
      link: '/about',
      icon: 'icon-setting',
    },
    {
      title: '24/7 Emergency Service',
      text: 'Available around the clock for urgent electrical repairs across the Greater Toronto Area.',
      link: '/contact',
      icon: 'icon-services',
    },
  ],
};

const DEFAULT_HOME_ABOUT = {
  tagline: 'Get To Know Us',
  title: 'Trusted Electrical Experts Across the Greater Toronto Area',
  text1: 'GTA Electric Services provides reliable residential and commercial electrical solutions, from troubleshooting and repairs to panel upgrades, lighting, EV chargers, and full-home rewiring.',
  text2: 'Our licensed ESA-certified electricians deliver safe, code-compliant work with honest pricing and dependable service you can count on.',
  buttonText: 'About Us More',
  buttonLink: '/about',
  image1: 'assets/images/resources/about-one-img-1.jpg',
  image2: 'assets/images/resources/about-one-img-2.jpg',
};

const DEFAULT_HOME_FEATURED_SERVICES = {
  tagline: 'Our Services',
  titleLine1: 'Featured Electrical Services',
  titleLine2: 'for Your Home & Business',
  serviceIds: [],
};

const DEFAULT_HOME_GALLERY = {
  tagline: 'Our Gallery',
  titleLine1: 'Your Brightest',
  titleLine2: 'Choice in Repairs',
  buttonText: 'All Gallery',
  buttonLink: '/projects',
  items: [
    {
      subTitle: 'Home Electrical',
      title: 'Panel Upgrade & Installation',
      text: 'Safe electrical panel upgrades to support modern home power needs.',
      link: '/projects',
      image: 'assets/images/project/project-1-1.jpg',
    },
    {
      subTitle: 'Lighting',
      title: 'Indoor & Outdoor Lighting',
      text: 'Clean lighting installs for homes, exteriors, and landscape areas.',
      link: '/projects',
      image: 'assets/images/project/project-1-2.jpg',
    },
    {
      subTitle: 'EV Charging',
      title: 'EV Charger Installation',
      text: 'Professional Level 2 charger installs for convenient at-home charging.',
      link: '/projects',
      image: 'assets/images/project/project-1-3.jpg',
    },
    {
      subTitle: 'Commercial',
      title: 'Commercial Lighting Upgrade',
      text: 'Efficient lighting upgrades for offices, retail, and warehouses.',
      link: '/projects',
      image: 'assets/images/project/project-1-4.jpg',
    },
    {
      subTitle: 'Safety',
      title: 'Smoke & CO Alarm Setup',
      text: 'Code-compliant smoke and carbon monoxide alarm installations.',
      link: '/projects',
      image: 'assets/images/project/project-1-5.jpg',
    },
    {
      subTitle: 'Rewiring',
      title: 'Home Rewiring Project',
      text: 'Reliable rewiring for outdated or unsafe electrical systems.',
      link: '/projects',
      image: 'assets/images/project/project-1-6.jpg',
    },
  ],
};

function normalizeSlide(slide = {}, index = 0) {
  const fallback = DEFAULT_SLIDER_SLIDES[index] || DEFAULT_SLIDER_SLIDES[0];
  const backgroundImage = String(slide.backgroundImage ?? fallback.backgroundImage).trim();
  const backgroundImageMobile = String(
    slide.backgroundImageMobile ?? slide.backgroundImage ?? fallback.backgroundImageMobile
  ).trim();

  return {
    subTitle: String(slide.subTitle ?? fallback.subTitle).trim(),
    titleLine1: String(slide.titleLine1 ?? fallback.titleLine1).trim(),
    titleLine2: String(slide.titleLine2 ?? fallback.titleLine2).trim(),
    text: String(slide.text ?? fallback.text).trim(),
    buttonText: String(slide.buttonText ?? fallback.buttonText).trim(),
    buttonLink: String(slide.buttonLink ?? fallback.buttonLink).trim(),
    backgroundImage,
    backgroundImageMobile: backgroundImageMobile || backgroundImage,
  };
}

export function normalizeSliderContent(content = {}) {
  const slides = Array.isArray(content.slides) && content.slides.length
    ? content.slides.map((slide, index) => normalizeSlide(slide, index))
    : DEFAULT_SLIDER_SLIDES.map((slide, index) => normalizeSlide(slide, index));

  return { slides };
}

export function normalizeHomeServicesContent(content = {}) {
  const items = Array.isArray(content.items) && content.items.length
    ? content.items
    : DEFAULT_HOME_SERVICES.items;

  return {
    items: items.slice(0, 3).map((item, index) => {
      const fallback = DEFAULT_HOME_SERVICES.items[index] || DEFAULT_HOME_SERVICES.items[0];
      return {
        title: String(item?.title ?? fallback.title).trim(),
        text: String(item?.text ?? fallback.text).trim(),
        link: String(item?.link ?? fallback.link).trim(),
        icon: String(item?.icon ?? fallback.icon).trim(),
      };
    }),
  };
}

export function normalizeHomeAboutContent(content = {}) {
  return {
    tagline: String(content.tagline ?? DEFAULT_HOME_ABOUT.tagline).trim(),
    title: String(content.title ?? DEFAULT_HOME_ABOUT.title).trim(),
    text1: String(content.text1 ?? DEFAULT_HOME_ABOUT.text1).trim(),
    text2: String(content.text2 ?? DEFAULT_HOME_ABOUT.text2).trim(),
    buttonText: String(content.buttonText ?? DEFAULT_HOME_ABOUT.buttonText).trim(),
    buttonLink: String(content.buttonLink ?? DEFAULT_HOME_ABOUT.buttonLink).trim(),
    image1: String(content.image1 ?? DEFAULT_HOME_ABOUT.image1).trim(),
    image2: String(content.image2 ?? DEFAULT_HOME_ABOUT.image2).trim(),
  };
}

export function normalizeFeaturedServicesWidgetContent(content = {}) {
  const serviceIds = Array.isArray(content.serviceIds)
    ? content.serviceIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    : DEFAULT_HOME_FEATURED_SERVICES.serviceIds;

  return {
    tagline: String(content.tagline ?? DEFAULT_HOME_FEATURED_SERVICES.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_HOME_FEATURED_SERVICES.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_HOME_FEATURED_SERVICES.titleLine2).trim(),
    serviceIds,
  };
}

function formatFeaturedService(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    categoryName: row.category_name,
    link: '/services',
    icon: 'icon-services',
  };
}

function normalizeGalleryItem(item = {}, index = 0) {
  const fallback = DEFAULT_HOME_GALLERY.items[index] || DEFAULT_HOME_GALLERY.items[0];
  return {
    subTitle: String(item?.subTitle ?? fallback.subTitle).trim(),
    title: String(item?.title ?? fallback.title).trim(),
    text: String(item?.text ?? fallback.text).trim(),
    link: String(item?.link ?? fallback.link).trim(),
    image: String(item?.image ?? fallback.image).trim(),
  };
}

export function normalizeHomeGalleryContent(content = {}) {
  const items = Array.isArray(content.items) && content.items.length
    ? content.items.map((item, index) => normalizeGalleryItem(item, index))
    : DEFAULT_HOME_GALLERY.items.map((item, index) => normalizeGalleryItem(item, index));

  return {
    tagline: String(content.tagline ?? DEFAULT_HOME_GALLERY.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_HOME_GALLERY.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_HOME_GALLERY.titleLine2).trim(),
    buttonText: String(content.buttonText ?? DEFAULT_HOME_GALLERY.buttonText).trim(),
    buttonLink: String(content.buttonLink ?? DEFAULT_HOME_GALLERY.buttonLink).trim(),
    items,
  };
}

async function persistGalleryImages(items) {
  return Promise.all(items.map(async (item, index) => {
    const next = { ...item };
    if (item.imageData) {
      next.image = saveCmsImage(`home-gallery-${index}`, item.imageData);
    }
    delete next.imageData;
    return normalizeGalleryItem(next, index);
  }));
}

async function resolveFeaturedServices(serviceIds = []) {
  if (!serviceIds.length) {
    const result = await pool.query(
      `SELECT s.id, s.name, s.description, c.name AS category_name
       FROM services s
       JOIN service_categories c ON c.id = s.category_id
       ORDER BY s.sort_order, s.id
       LIMIT 3`
    );
    return result.rows.map((row) => formatFeaturedService(row));
  }

  const result = await pool.query(
    `SELECT s.id, s.name, s.description, c.name AS category_name
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     WHERE s.id = ANY($1::int[])
     ORDER BY array_position($1::int[], s.id)`,
    [serviceIds]
  );

  return result.rows.map((row) => formatFeaturedService(row));
}

async function persistAboutImages(content) {
  const next = { ...content };

  if (content.image1Data) {
    next.image1 = saveCmsImage('home-about-image-1', content.image1Data);
  }
  if (content.image2Data) {
    next.image2 = saveCmsImage('home-about-image-2', content.image2Data);
  }

  delete next.image1Data;
  delete next.image2Data;

  return normalizeHomeAboutContent(next);
}

async function persistSlideImages(slides) {
  return Promise.all(slides.map(async (slide, index) => {
    const next = { ...slide };

    if (slide.backgroundImageData) {
      next.backgroundImage = saveCmsImage(`home-slider-${index}-background`, slide.backgroundImageData);
    }
    if (slide.backgroundImageMobileData) {
      next.backgroundImageMobile = saveCmsImage(
        `home-slider-${index}-background-mobile`,
        slide.backgroundImageMobileData
      );
    }

    delete next.backgroundImageData;
    delete next.backgroundImageMobileData;
    delete next.overlayImageData;
    delete next.overlayImage;
    delete next.portraitImageData;
    delete next.portraitImage;

    return normalizeSlide(next, index);
  }));
}

function formatWidget(row) {
  if (!row) return null;
  return {
    id: row.id,
    page: row.page,
    section: row.section,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getWidget(page, section) {
  const result = await pool.query(
    'SELECT * FROM web_content_widgets WHERE page = $1 AND section = $2',
    [page, section]
  );
  return formatWidget(result.rows[0]);
}

export async function getPageWidgets(page) {
  const result = await pool.query(
    'SELECT * FROM web_content_widgets WHERE page = $1 ORDER BY section',
    [page]
  );
  return result.rows.map(formatWidget);
}

export async function upsertWidget(page, section, content) {
  if (!page || !section) {
    throw new Error('Page and section are required');
  }
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    throw new Error('Content must be a JSON object');
  }

  const result = await pool.query(
    `INSERT INTO web_content_widgets (page, section, content)
     VALUES ($1, $2, $3::jsonb)
     ON CONFLICT (page, section)
     DO UPDATE SET
       content = EXCLUDED.content,
       updated_at = NOW()
     RETURNING *`,
    [page, section, JSON.stringify(content)]
  );

  return formatWidget(result.rows[0]);
}

export function normalizeTopbarContent(content = {}) {
  return {
    email: String(content.email || DEFAULT_TOPBAR.email).trim(),
    address: String(content.address || DEFAULT_TOPBAR.address).trim(),
    social: {
      facebook: String(content.social?.facebook || '').trim(),
      twitter: String(content.social?.twitter || '').trim(),
      linkedin: String(content.social?.linkedin || '').trim(),
      instagram: String(content.social?.instagram || '').trim(),
    },
  };
}

export async function getTopbarContent() {
  const widget = await getWidget('home', 'topbar');
  return normalizeTopbarContent(widget?.content || DEFAULT_TOPBAR);
}

export async function updateTopbarContent(content) {
  const normalized = normalizeTopbarContent(content);
  if (!normalized.email) {
    throw new Error('Email is required');
  }
  if (!normalized.address) {
    throw new Error('Address is required');
  }
  return upsertWidget('home', 'topbar', normalized);
}

export async function getSliderContent() {
  const widget = await getWidget('home', 'slider');
  return normalizeSliderContent(widget?.content || { slides: DEFAULT_SLIDER_SLIDES });
}

export async function getHomeServicesContent() {
  const widget = await getWidget('home', 'services');
  return normalizeHomeServicesContent(widget?.content || DEFAULT_HOME_SERVICES);
}

export async function updateHomeServicesContent(content) {
  const normalized = normalizeHomeServicesContent(content);

  for (const item of normalized.items) {
    if (!item.title) {
      throw new Error('Each service feature requires a title');
    }
    if (!item.text) {
      throw new Error('Each service feature requires a description');
    }
    if (!item.link) {
      throw new Error('Each service feature requires a link');
    }
    if (!item.icon) {
      throw new Error('Each service feature requires an icon');
    }
  }

  return upsertWidget('home', 'services', normalized);
}

export async function getHomeAboutContent() {
  const widget = await getWidget('home', 'about');
  return normalizeHomeAboutContent(widget?.content || DEFAULT_HOME_ABOUT);
}

export async function updateHomeAboutContent(content) {
  const withImages = await persistAboutImages(content || {});
  const normalized = normalizeHomeAboutContent(withImages);

  if (!normalized.title) {
    throw new Error('Title is required');
  }
  if (!normalized.text1) {
    throw new Error('Primary description is required');
  }
  if (!normalized.image1) {
    throw new Error('Primary side image is required');
  }
  if (!normalized.image2) {
    throw new Error('Secondary side image is required');
  }

  return upsertWidget('home', 'about', normalized);
}

export async function getFeaturedServicesContent() {
  const widget = await getWidget('home', 'featured-services');
  const settings = normalizeFeaturedServicesWidgetContent(widget?.content || DEFAULT_HOME_FEATURED_SERVICES);
  const services = await resolveFeaturedServices(settings.serviceIds);

  return {
    ...settings,
    services,
  };
}

export async function updateFeaturedServicesContent(content) {
  const normalized = normalizeFeaturedServicesWidgetContent(content);

  if (!normalized.titleLine1) {
    throw new Error('Section title is required');
  }

  if (normalized.serviceIds.length) {
    const result = await pool.query(
      'SELECT id FROM services WHERE id = ANY($1::int[])',
      [normalized.serviceIds]
    );
    if (result.rowCount !== normalized.serviceIds.length) {
      throw new Error('One or more selected services are invalid');
    }
  }

  return upsertWidget('home', 'featured-services', {
    tagline: normalized.tagline,
    titleLine1: normalized.titleLine1,
    titleLine2: normalized.titleLine2,
    serviceIds: normalized.serviceIds,
  });
}

export async function getHomeGalleryContent() {
  const widget = await getWidget('home', 'gallery');
  return normalizeHomeGalleryContent(widget?.content || DEFAULT_HOME_GALLERY);
}

export async function updateHomeGalleryContent(content) {
  const incomingItems = Array.isArray(content?.items) ? content.items : [];
  if (!incomingItems.length) {
    throw new Error('At least one gallery item is required');
  }

  const itemsWithImages = await persistGalleryImages(incomingItems);
  const normalized = normalizeHomeGalleryContent({
    ...content,
    items: itemsWithImages,
  });

  if (!normalized.titleLine1) {
    throw new Error('Gallery title is required');
  }

  for (const item of normalized.items) {
    if (!item.title) {
      throw new Error('Each gallery item requires a title');
    }
    if (!item.image) {
      throw new Error('Each gallery item requires an image');
    }
  }

  return upsertWidget('home', 'gallery', normalized);
}

export async function updateSliderContent(content) {
  const incomingSlides = Array.isArray(content?.slides) ? content.slides : [];
  if (!incomingSlides.length) {
    throw new Error('At least one slide is required');
  }

  const slidesWithImages = await persistSlideImages(incomingSlides);
  const normalized = normalizeSliderContent({ slides: slidesWithImages });

  for (const slide of normalized.slides) {
    if (!slide.titleLine1) {
      throw new Error('Each slide requires a title');
    }
    if (!slide.backgroundImage) {
      throw new Error('Each slide requires a desktop background image');
    }
    if (!slide.backgroundImageMobile) {
      throw new Error('Each slide requires a mobile background image');
    }
  }

  return upsertWidget('home', 'slider', normalized);
}

const DEFAULT_ABOUT_BANNER = {
  title: 'About Us',
  backgroundImage: '',
};

const DEFAULT_TEAM_BANNER = {
  title: 'Our Team',
  backgroundImage: '',
};

const DEFAULT_TEAM_DETAILS_BANNER = {
  title: 'Member Details',
  backgroundImage: '',
};

const DEFAULT_ABOUT_CONTACT = {
  tagline: 'contact with us',
  title: 'Choose Our Electric Repair Service because its 24/7',
  text1: 'The wise man therefore always holds in these matters to this principle of selection. He rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains to the selection point.',
  text2: 'But in certain circumstances and owing to the claims of duty or the obligations of business we often need reliable electrical support around the clock.',
  primaryButtonText: 'Discover More',
  primaryButtonLink: '/about',
  secondaryButtonText: 'Free estimate',
  secondaryButtonLink: '/contact',
  backgroundImage: 'assets/images/backgrounds/video-one-bg.jpg',
  videoId: 'vfhzo499OeA',
};

export function normalizeAboutBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_ABOUT_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_ABOUT_BANNER.backgroundImage).trim(),
  };
}

export async function getAboutBannerContent() {
  const widget = await getWidget('about', 'banner');
  return normalizeAboutBannerContent(widget?.content || DEFAULT_ABOUT_BANNER);
}

export async function updateAboutBannerContent(content) {
  const normalized = normalizeAboutBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('about', 'banner', normalized);
  return normalizeAboutBannerContent(widget.content);
}

export function normalizeTeamBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_TEAM_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_TEAM_BANNER.backgroundImage).trim(),
  };
}

export async function getTeamBannerContent() {
  const widget = await getWidget('team', 'banner');
  return normalizeTeamBannerContent(widget?.content || DEFAULT_TEAM_BANNER);
}

export async function updateTeamBannerContent(content) {
  const normalized = normalizeTeamBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('team', 'banner', normalized);
  return normalizeTeamBannerContent(widget.content);
}

export function normalizeTeamDetailsBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_TEAM_DETAILS_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_TEAM_DETAILS_BANNER.backgroundImage).trim(),
  };
}

export async function getTeamDetailsBannerContent() {
  const widget = await getWidget('team-details', 'banner');
  return normalizeTeamDetailsBannerContent(widget?.content || DEFAULT_TEAM_DETAILS_BANNER);
}

export async function updateTeamDetailsBannerContent(content) {
  const normalized = normalizeTeamDetailsBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('team-details', 'banner', normalized);
  return normalizeTeamDetailsBannerContent(widget.content);
}

const DEFAULT_PROJECTS_BANNER = {
  title: 'Projects',
  backgroundImage: '',
};

const DEFAULT_PROJECT_DETAILS_BANNER = {
  title: 'Project Details',
  backgroundImage: '',
};

const DEFAULT_PROJECTS_GALLERY = {
  tagline: 'Our Gallery',
  titleLine1: 'Your Brightest',
  titleLine2: 'Choice in Repairs',
  buttonText: '',
  buttonLink: '/projects',
  items: DEFAULT_HOME_GALLERY.items.map((item, index) => ({
    id: `project-default-${index + 1}`,
    subTitle: item.subTitle,
    title: item.title,
    text: item.text,
    challengeText: '',
    resultText: '',
    client: '',
    date: '',
    location: '',
    image: item.image,
    link: `/project-details?id=project-default-${index + 1}`,
  })),
};

function normalizeProjectItem(item = {}, index = 0) {
  const fallback = DEFAULT_PROJECTS_GALLERY.items[index] || DEFAULT_PROJECTS_GALLERY.items[0];
  const id = String(item?.id ?? fallback?.id ?? randomUUID()).trim();

  return {
    id,
    subTitle: String(item?.subTitle ?? fallback.subTitle).trim(),
    title: String(item?.title ?? fallback.title).trim(),
    text: String(item?.text ?? fallback.text).trim(),
    challengeText: String(item?.challengeText ?? fallback.challengeText ?? '').trim(),
    resultText: String(item?.resultText ?? fallback.resultText ?? '').trim(),
    client: String(item?.client ?? fallback.client ?? '').trim(),
    date: String(item?.date ?? fallback.date ?? '').trim(),
    location: String(item?.location ?? fallback.location ?? '').trim(),
    image: String(item?.image ?? fallback.image).trim(),
    link: `/project-details?id=${id}`,
  };
}

export function normalizeProjectsGalleryContent(content = {}) {
  const items = Array.isArray(content.items) && content.items.length
    ? content.items.map((item, index) => normalizeProjectItem(item, index))
    : DEFAULT_PROJECTS_GALLERY.items.map((item, index) => normalizeProjectItem(item, index));

  return {
    tagline: String(content.tagline ?? DEFAULT_PROJECTS_GALLERY.tagline).trim(),
    titleLine1: String(content.titleLine1 ?? DEFAULT_PROJECTS_GALLERY.titleLine1).trim(),
    titleLine2: String(content.titleLine2 ?? DEFAULT_PROJECTS_GALLERY.titleLine2).trim(),
    buttonText: String(content.buttonText ?? DEFAULT_PROJECTS_GALLERY.buttonText).trim(),
    buttonLink: String(content.buttonLink ?? DEFAULT_PROJECTS_GALLERY.buttonLink).trim(),
    items,
  };
}

async function persistProjectImages(items) {
  return Promise.all(items.map(async (item, index) => {
    const next = { ...item };
    if (item.imageData) {
      const key = item.id ? `projects-gallery-${item.id}` : `projects-gallery-${index}`;
      next.image = saveCmsImage(key, item.imageData);
    }
    delete next.imageData;
    return normalizeProjectItem(next, index);
  }));
}

export async function getProjectsGalleryContent() {
  const widget = await getWidget('projects', 'gallery');
  return normalizeProjectsGalleryContent(widget?.content || DEFAULT_PROJECTS_GALLERY);
}

export async function updateProjectsGalleryContent(content) {
  const incomingItems = Array.isArray(content?.items) ? content.items : [];
  if (!incomingItems.length) {
    throw new Error('At least one project is required');
  }

  const itemsWithImages = await persistProjectImages(incomingItems);
  const normalized = normalizeProjectsGalleryContent({
    ...content,
    items: itemsWithImages,
  });

  if (!normalized.titleLine1) {
    throw new Error('Projects title is required');
  }

  for (const item of normalized.items) {
    if (!item.title) {
      throw new Error('Each project requires a title');
    }
    if (!item.image) {
      throw new Error('Each project requires an image');
    }
  }

  return upsertWidget('projects', 'gallery', normalized);
}

export async function getProjectById(projectId) {
  const gallery = await getProjectsGalleryContent();
  return gallery.items.find((item) => item.id === projectId) || null;
}

export function normalizeProjectsBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_PROJECTS_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_PROJECTS_BANNER.backgroundImage).trim(),
  };
}

export async function getProjectsBannerContent() {
  const widget = await getWidget('projects', 'banner');
  return normalizeProjectsBannerContent(widget?.content || DEFAULT_PROJECTS_BANNER);
}

export async function updateProjectsBannerContent(content) {
  const normalized = normalizeProjectsBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('projects', 'banner', normalized);
  return normalizeProjectsBannerContent(widget.content);
}

export function normalizeProjectDetailsBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_PROJECT_DETAILS_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_PROJECT_DETAILS_BANNER.backgroundImage).trim(),
  };
}

export async function getProjectDetailsBannerContent() {
  const widget = await getWidget('project-details', 'banner');
  return normalizeProjectDetailsBannerContent(widget?.content || DEFAULT_PROJECT_DETAILS_BANNER);
}

export async function updateProjectDetailsBannerContent(content) {
  const normalized = normalizeProjectDetailsBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('project-details', 'banner', normalized);
  return normalizeProjectDetailsBannerContent(widget.content);
}

const DEFAULT_SERVICES_BANNER = {
  title: 'Our Services',
  backgroundImage: '',
};

const DEFAULT_SERVICE_DETAILS_BANNER = {
  title: 'Service Details',
  backgroundImage: '',
};

export function normalizeServicesBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_SERVICES_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_SERVICES_BANNER.backgroundImage).trim(),
  };
}

export async function getServicesBannerContent() {
  const widget = await getWidget('services', 'banner');
  return normalizeServicesBannerContent(widget?.content || DEFAULT_SERVICES_BANNER);
}

export async function updateServicesBannerContent(content) {
  const normalized = normalizeServicesBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('services', 'banner', normalized);
  return normalizeServicesBannerContent(widget.content);
}

export function normalizeServiceDetailsBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_SERVICE_DETAILS_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_SERVICE_DETAILS_BANNER.backgroundImage).trim(),
  };
}

export async function getServiceDetailsBannerContent() {
  const widget = await getWidget('service-details', 'banner');
  return normalizeServiceDetailsBannerContent(widget?.content || DEFAULT_SERVICE_DETAILS_BANNER);
}

export async function updateServiceDetailsBannerContent(content) {
  const normalized = normalizeServiceDetailsBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('service-details', 'banner', normalized);
  return normalizeServiceDetailsBannerContent(widget.content);
}

const DEFAULT_CONTACT_BANNER = {
  title: 'Contact',
  backgroundImage: '',
};

const DEFAULT_CONTACT_PAGE_SETTINGS = {
  formTitle: 'Get A Free Quote',
  recipientEmail: 'example@gamil.com',
  phone: '+55 827 057 5405',
  displayEmail: 'example@gamil.com',
  address: '12 Green Road, 05 New York',
  latitude: 43.6532,
  longitude: -79.3832,
  mapZoom: 14,
};

function parseCoordinate(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseMapZoom(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(20, Math.max(1, parsed));
}

export function normalizeContactPageSettingsContent(content = {}) {
  return {
    formTitle: String(content.formTitle ?? DEFAULT_CONTACT_PAGE_SETTINGS.formTitle).trim(),
    recipientEmail: String(content.recipientEmail ?? DEFAULT_CONTACT_PAGE_SETTINGS.recipientEmail).trim(),
    phone: String(content.phone ?? DEFAULT_CONTACT_PAGE_SETTINGS.phone).trim(),
    displayEmail: String(content.displayEmail ?? DEFAULT_CONTACT_PAGE_SETTINGS.displayEmail).trim(),
    address: String(content.address ?? DEFAULT_CONTACT_PAGE_SETTINGS.address).trim(),
    latitude: parseCoordinate(content.latitude, DEFAULT_CONTACT_PAGE_SETTINGS.latitude),
    longitude: parseCoordinate(content.longitude, DEFAULT_CONTACT_PAGE_SETTINGS.longitude),
    mapZoom: parseMapZoom(content.mapZoom, DEFAULT_CONTACT_PAGE_SETTINGS.mapZoom),
  };
}

export function toPublicContactPageSettings(content = {}) {
  const normalized = normalizeContactPageSettingsContent(content);
  return {
    formTitle: normalized.formTitle,
    phone: normalized.phone,
    displayEmail: normalized.displayEmail,
    address: normalized.address,
    latitude: normalized.latitude,
    longitude: normalized.longitude,
    mapZoom: normalized.mapZoom,
  };
}

export async function getContactPageSettingsContent() {
  const widget = await getWidget('contact', 'settings');
  return normalizeContactPageSettingsContent(widget?.content || DEFAULT_CONTACT_PAGE_SETTINGS);
}

export async function getPublicContactPageSettingsContent() {
  const settings = await getContactPageSettingsContent();
  return toPublicContactPageSettings(settings);
}

export async function updateContactPageSettingsContent(content) {
  const normalized = normalizeContactPageSettingsContent(content);

  if (!normalized.formTitle) {
    throw new Error('Form title is required');
  }
  if (!normalized.recipientEmail) {
    throw new Error('Recipient email is required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.recipientEmail)) {
    throw new Error('Recipient email is invalid');
  }
  if (normalized.displayEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.displayEmail)) {
    throw new Error('Display email is invalid');
  }
  if (normalized.latitude < -90 || normalized.latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (normalized.longitude < -180 || normalized.longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  const widget = await upsertWidget('contact', 'settings', normalized);
  return normalizeContactPageSettingsContent(widget.content);
}

export function normalizeContactBannerContent(content = {}) {
  return {
    title: String(content.title ?? DEFAULT_CONTACT_BANNER.title).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_CONTACT_BANNER.backgroundImage).trim(),
  };
}

export async function getContactBannerContent() {
  const widget = await getWidget('contact', 'banner');
  return normalizeContactBannerContent(widget?.content || DEFAULT_CONTACT_BANNER);
}

export async function updateContactBannerContent(content) {
  const normalized = normalizeContactBannerContent(content);

  if (!normalized.title) {
    throw new Error('Banner title is required');
  }

  const widget = await upsertWidget('contact', 'banner', normalized);
  return normalizeContactBannerContent(widget.content);
}

export function normalizeAboutContactContent(content = {}) {
  return {
    tagline: String(content.tagline ?? DEFAULT_ABOUT_CONTACT.tagline).trim(),
    title: String(content.title ?? DEFAULT_ABOUT_CONTACT.title).trim(),
    text1: String(content.text1 ?? DEFAULT_ABOUT_CONTACT.text1).trim(),
    text2: String(content.text2 ?? DEFAULT_ABOUT_CONTACT.text2).trim(),
    primaryButtonText: String(content.primaryButtonText ?? DEFAULT_ABOUT_CONTACT.primaryButtonText).trim(),
    primaryButtonLink: String(content.primaryButtonLink ?? DEFAULT_ABOUT_CONTACT.primaryButtonLink).trim(),
    secondaryButtonText: String(content.secondaryButtonText ?? DEFAULT_ABOUT_CONTACT.secondaryButtonText).trim(),
    secondaryButtonLink: String(content.secondaryButtonLink ?? DEFAULT_ABOUT_CONTACT.secondaryButtonLink).trim(),
    backgroundImage: String(content.backgroundImage ?? DEFAULT_ABOUT_CONTACT.backgroundImage).trim(),
    videoId: String(content.videoId ?? DEFAULT_ABOUT_CONTACT.videoId).trim(),
  };
}

export async function getAboutContactContent() {
  const widget = await getWidget('about', 'contact');
  return normalizeAboutContactContent(widget?.content || DEFAULT_ABOUT_CONTACT);
}

export async function updateAboutContactContent(content) {
  const normalized = normalizeAboutContactContent(content);

  if (!normalized.title) {
    throw new Error('Title is required');
  }

  const widget = await upsertWidget('about', 'contact', normalized);
  return normalizeAboutContactContent(widget.content);
}

export async function saveWidgetImage(dataUrl, key) {
  return saveCmsImage(key, dataUrl);
}
