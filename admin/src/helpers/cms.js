const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const webBaseUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:3000';

export const MAX_CMS_IMAGE_BYTES = 5 * 1024 * 1024;
export const SLIDER_DESKTOP_RATIO = '16 / 9';
export const SLIDER_MOBILE_RATIO = '9 / 16';
export const ABOUT_IMAGE_RATIO = '4 / 5';
export const CONTACT_IMAGE_RATIO = '16 / 9';
export const BANNER_IMAGE_RATIO = '16 / 9';
export const GALLERY_IMAGE_RATIO = '4 / 3';

export function resolveCmsAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads')) return `${apiBaseUrl}${url}`;
  if (url.startsWith('assets/')) return `${webBaseUrl}/${url}`;
  return url;
}

export function mapSlidesFromApi(slides = []) {
  return slides.map((slide) => {
    const backgroundImage = slide.backgroundImage || '';
    const backgroundImageMobile = slide.backgroundImageMobile || backgroundImage;

    return {
      subTitle: slide.subTitle || '',
      titleLine1: slide.titleLine1 || '',
      titleLine2: slide.titleLine2 || '',
      text: slide.text || '',
      buttonText: slide.buttonText || 'Learn More',
      buttonLink: slide.buttonLink || '/about',
      backgroundImage,
      backgroundImageMobile,
      backgroundImagePreview: resolveCmsAssetUrl(backgroundImage),
      backgroundImageMobilePreview: resolveCmsAssetUrl(backgroundImageMobile),
      backgroundImageData: null,
      backgroundImageMobileData: null,
    };
  });
}

export function mapSlidesForSave(slides = []) {
  return slides.map((slide) => ({
    subTitle: slide.subTitle,
    titleLine1: slide.titleLine1,
    titleLine2: slide.titleLine2,
    text: slide.text,
    buttonText: slide.buttonText,
    buttonLink: slide.buttonLink,
    backgroundImage: slide.backgroundImage,
    backgroundImageMobile: slide.backgroundImageMobile || slide.backgroundImage,
  }));
}

export function mapAboutFromApi(content = {}) {
  const image1 = content.image1 || '';
  const image2 = content.image2 || '';

  return {
    tagline: content.tagline || '',
    title: content.title || '',
    text1: content.text1 || '',
    text2: content.text2 || '',
    buttonText: content.buttonText || 'About Us More',
    buttonLink: content.buttonLink || '/about',
    badgeLine1: content.badgeLine1 || '',
    badgeLine2: content.badgeLine2 || '',
    image1,
    image2,
    image1Preview: resolveCmsAssetUrl(image1),
    image2Preview: resolveCmsAssetUrl(image2),
    image1Data: null,
    image2Data: null,
  };
}

export function mapAboutForSave(content = {}) {
  return {
    tagline: content.tagline,
    title: content.title,
    text1: content.text1,
    text2: content.text2,
    buttonText: content.buttonText,
    buttonLink: content.buttonLink,
    badgeLine1: content.badgeLine1,
    badgeLine2: content.badgeLine2,
    image1: content.image1,
    image2: content.image2,
  };
}

export function mapAboutIntroFromApi(content = {}) {
  const image = content.image || '';
  const points = Array.isArray(content.points) && content.points.length
    ? content.points
    : ['', '', ''];

  return {
    tagline: content.tagline || 'Who We Are',
    title: content.title || '',
    text1: content.text1 || '',
    text2: content.text2 || '',
    points: [...points, '', '', ''].slice(0, 6),
    image,
    imagePreview: resolveCmsAssetUrl(image),
    imageData: null,
    buttonText: content.buttonText || 'Request a Quote',
    buttonLink: content.buttonLink || '/contact',
  };
}

export function mapAboutIntroForSave(content = {}) {
  return {
    tagline: content.tagline,
    title: content.title,
    text1: content.text1,
    text2: content.text2,
    points: (content.points || []).map((point) => String(point || '').trim()).filter(Boolean),
    image: content.image,
    buttonText: content.buttonText,
    buttonLink: content.buttonLink,
  };
}

const DEFAULT_VALUE_ITEMS = [
  {
    icon: 'icon-certified',
    title: 'Safety Above All',
    text: 'Every decision we make on the job starts with safety — for your family, your property, and our team. We follow ESA standards on every project, no exceptions.',
  },
  {
    icon: 'icon-speech-bubbles',
    title: 'Honest Communication',
    text: 'We tell you what the job involves, what it will cost, and how long it will take — before we start. No surprises, no upselling, no runaround.',
  },
  {
    icon: 'icon-medal',
    title: 'Quality Workmanship',
    text: 'We take pride in clean, careful work. From the wiring inside your walls to the finish on your pot lights, the details matter to us.',
  },
  {
    icon: 'icon-clock',
    title: 'Reliable Service',
    text: 'We show up when we say we will, complete the work on schedule, and follow up to make sure you are satisfied. That is how we have earned long-term client relationships.',
  },
];

export function mapAboutValuesFromApi(content = {}) {
  const items = Array.isArray(content.items) && content.items.length
    ? content.items
    : DEFAULT_VALUE_ITEMS;

  return {
    tagline: content.tagline || 'Our Values',
    title: content.title || 'What We Stand For',
    items: items.map((item) => ({
      icon: item.icon || 'icon-check',
      title: item.title || '',
      text: item.text || '',
    })),
  };
}

export function mapAboutValuesForSave(content = {}) {
  return {
    tagline: content.tagline,
    title: content.title,
    items: (content.items || [])
      .map((item) => ({
        icon: String(item.icon || '').trim() || 'icon-check',
        title: String(item.title || '').trim(),
        text: String(item.text || '').trim(),
      }))
      .filter((item) => item.title || item.text),
  };
}

const DEFAULT_CREDENTIAL_ITEMS = [
  {
    image: 'assets/images/brand/esa-logo.svg',
    label: 'ESA Licensed',
  },
  {
    image: 'assets/images/brand/wsib-logo.svg',
    label: 'WSIB Certified',
  },
];

export function mapAboutCredentialsFromApi(content = {}) {
  const items = Array.isArray(content.items) && content.items.length
    ? content.items
    : DEFAULT_CREDENTIAL_ITEMS;

  const esaLicenseNumber = String(content.esaLicenseNumber || '#7014495')
    .trim()
    .replace(/^esa\s*licen[sc]e[d]?\s*/i, '')
    .trim()
    .split(/\r?\n/)[0]
    .trim();

  return {
    title: content.title || 'Licensed & Certified',
    esaLicenseNumber,
    items: items.map((item) => {
      const image = item.image || '';
      return {
        image,
        imagePreview: resolveCmsAssetUrl(image),
        imageData: null,
        label: item.label || '',
      };
    }),
  };
}

export function mapAboutCredentialsForSave(content = {}) {
  return {
    title: content.title,
    esaLicenseNumber: String(content.esaLicenseNumber || '')
      .trim()
      .replace(/^esa\s*licen[sc]e[d]?\s*/i, '')
      .trim()
      .split(/\r?\n/)[0]
      .trim(),
    items: (content.items || []).map((item) => ({
      image: item.image,
      imageData: item.imageData || undefined,
      label: String(item.label || '').trim(),
    })),
  };
}

export function mapAboutBannerFromApi(content = {}) {
  const backgroundImage = content.backgroundImage || '';

  return {
    title: content.title || '',
    backgroundImage,
    backgroundImagePreview: resolveCmsAssetUrl(backgroundImage),
    backgroundImageData: null,
  };
}

export function mapAboutBannerForSave(content = {}) {
  return {
    title: content.title,
    backgroundImage: content.backgroundImage,
  };
}

export const mapTeamBannerFromApi = mapAboutBannerFromApi;
export const mapTeamBannerForSave = mapAboutBannerForSave;
export const mapTeamDetailsBannerFromApi = mapAboutBannerFromApi;
export const mapTeamDetailsBannerForSave = mapAboutBannerForSave;
export const mapProjectsBannerFromApi = mapAboutBannerFromApi;
export const mapProjectsBannerForSave = mapAboutBannerForSave;
export const mapProjectDetailsBannerFromApi = mapAboutBannerFromApi;
export const mapProjectDetailsBannerForSave = mapAboutBannerForSave;
export const mapServicesBannerFromApi = mapAboutBannerFromApi;
export const mapServicesBannerForSave = mapAboutBannerForSave;

export function mapServiceCategoryDetailsFromApi(content = {}) {
  return {
    tagline: content.tagline || '',
    title: content.title || '',
    text: content.text || '',
  };
}

export function mapServiceCategoryDetailsForSave(content = {}) {
  return {
    tagline: content.tagline,
    title: content.title,
    text: content.text,
  };
}

export function mapServiceCategoryGalleryFromApi(content = {}) {
  const items = Array.isArray(content.items) ? content.items : [];

  return {
    tagline: content.tagline || '',
    titleLine1: content.titleLine1 || '',
    titleLine2: content.titleLine2 || '',
    buttonText: content.buttonText || '',
    buttonLink: content.buttonLink || '',
    items: items.map((item) => {
      const image = item.image || '';
      return {
        serviceId: item.serviceId ? String(item.serviceId) : '',
        serviceName: item.serviceName || '',
        subTitle: item.subTitle || '',
        title: item.title || '',
        text: item.text || '',
        image,
        imagePreview: resolveCmsAssetUrl(image),
        imageData: null,
      };
    }),
  };
}

export function mapServiceCategoryGalleryForSave(content = {}) {
  return {
    tagline: content.tagline,
    titleLine1: content.titleLine1,
    titleLine2: content.titleLine2,
    buttonText: content.buttonText,
    buttonLink: content.buttonLink,
    items: (content.items || []).map((item) => ({
      serviceId: item.serviceId ? String(item.serviceId) : '',
      serviceName: item.serviceName || '',
      subTitle: item.subTitle,
      title: item.title,
      text: item.text,
      image: item.image,
    })),
  };
}

export const mapContactBannerFromApi = mapAboutBannerFromApi;
export const mapContactBannerForSave = mapAboutBannerForSave;
export const mapFaqBannerFromApi = mapAboutBannerFromApi;
export const mapFaqBannerForSave = mapAboutBannerForSave;

export function mapFaqSettingsFromApi(content = {}) {
  return {
    tagline: content.tagline || 'FAQ',
    title: content.title || 'Frequently Asked Questions',
    introText: content.introText || '',
  };
}

export function mapFaqSettingsForSave(content = {}) {
  return {
    tagline: content.tagline,
    title: content.title,
    introText: content.introText,
  };
}

export const mapLegalBannerFromApi = mapAboutBannerFromApi;
export const mapLegalBannerForSave = mapAboutBannerForSave;

export function mapLegalPageContentFromApi(content = {}) {
  const sections = Array.isArray(content.sections) ? content.sections : [];

  return {
    title: content.title || '',
    lastUpdated: content.lastUpdated || '',
    introText: content.introText || '',
    sections: sections.map((section, index) => ({
      id: section.id || crypto.randomUUID(),
      heading: section.heading || '',
      body: section.body || '',
      sortOrder: section.sortOrder ?? index,
    })),
  };
}

export function mapLegalPageContentForSave(content = {}) {
  return {
    title: content.title,
    lastUpdated: content.lastUpdated,
    introText: content.introText,
    sections: (content.sections || []).map((section, index) => ({
      id: section.id,
      heading: section.heading,
      body: section.body,
      sortOrder: section.sortOrder ?? index,
    })),
  };
}

export function mapContactSettingsFromApi(content = {}) {
  return {
    formTitle: content.formTitle || 'Get A Free Quote',
    recipientEmail: content.recipientEmail || '',
    latitude: content.latitude ?? 43.6532,
    longitude: content.longitude ?? -79.3832,
    mapZoom: content.mapZoom ?? 14,
  };
}

export function mapContactSettingsForSave(content = {}) {
  return {
    formTitle: content.formTitle,
    recipientEmail: content.recipientEmail,
    latitude: Number(content.latitude),
    longitude: Number(content.longitude),
    mapZoom: Number.parseInt(content.mapZoom, 10) || 14,
  };
}

export function mapProjectsGalleryFromApi(content = {}) {
  const items = Array.isArray(content.items) ? content.items : [];

  return {
    tagline: content.tagline || '',
    titleLine1: content.titleLine1 || '',
    titleLine2: content.titleLine2 || '',
    buttonText: content.buttonText || '',
    buttonLink: content.buttonLink || '/projects',
    items: items.map((item) => {
      const image = item.image || '';
      return {
        id: item.id || crypto.randomUUID(),
        slug: item.slug || '',
        subTitle: item.subTitle || '',
        title: item.title || '',
        text: item.text || '',
        challengeText: item.challengeText || '',
        resultText: item.resultText || '',
        client: item.client || '',
        date: item.date || '',
        location: item.location || '',
        image,
        imagePreview: resolveCmsAssetUrl(image),
        imageData: null,
      };
    }),
  };
}

export function mapProjectsGalleryForSave(content = {}) {
  return {
    tagline: content.tagline,
    titleLine1: content.titleLine1,
    titleLine2: content.titleLine2,
    buttonText: content.buttonText,
    buttonLink: content.buttonLink,
    items: (content.items || []).map((item) => ({
      id: item.id,
      slug: item.slug,
      subTitle: item.subTitle,
      title: item.title,
      text: item.text,
      challengeText: item.challengeText,
      resultText: item.resultText,
      client: item.client,
      date: item.date,
      location: item.location,
      image: item.image,
    })),
  };
}

export function mapGalleryFromApi(content = {}) {
  const items = Array.isArray(content.items) ? content.items : [];

  return {
    tagline: content.tagline || '',
    titleLine1: content.titleLine1 || '',
    titleLine2: content.titleLine2 || '',
    buttonText: content.buttonText || 'All Gallery',
    buttonLink: content.buttonLink || '/projects',
    items: items.map((item) => {
      const image = item.image || '';
      return {
        subTitle: item.subTitle || '',
        title: item.title || '',
        text: item.text || '',
        link: item.link || '/projects',
        image,
        imagePreview: resolveCmsAssetUrl(image),
        imageData: null,
      };
    }),
  };
}

export function mapGalleryForSave(content = {}) {
  return {
    tagline: content.tagline,
    titleLine1: content.titleLine1,
    titleLine2: content.titleLine2,
    buttonText: content.buttonText,
    buttonLink: content.buttonLink,
    items: (content.items || []).map((item) => ({
      subTitle: item.subTitle,
      title: item.title,
      text: item.text,
      link: item.link,
      image: item.image,
    })),
  };
}

function toDatetimeLocalValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function mapTestimonialsFromApi(content = {}) {
  const items = Array.isArray(content.items) ? content.items : [];

  return {
    tagline: content.tagline || 'Testimonials',
    titleLine1: content.titleLine1 || 'What Our Clients Say',
    titleLine2: content.titleLine2 || '',
    items: items.map((item) => ({
      message: item.message || '',
      clientName: item.clientName || '',
      timestamp: toDatetimeLocalValue(item.timestamp) || '',
      rating: Number(item.rating) >= 1 && Number(item.rating) <= 5 ? Number(item.rating) : 5,
    })),
  };
}

export function mapTestimonialsForSave(content = {}) {
  return {
    tagline: content.tagline,
    titleLine1: content.titleLine1,
    titleLine2: content.titleLine2,
    items: (content.items || []).map((item) => ({
      message: item.message,
      clientName: item.clientName,
      timestamp: item.timestamp ? new Date(item.timestamp).toISOString() : '',
      rating: Number(item.rating) || 5,
    })),
  };
}

export function mapServicesHomepageSectionFromApi(content = {}) {
  return {
    tagline: content.tagline || 'What We Do',
    titleLine1: content.titleLine1 || 'Featured Electrical Services',
    titleLine2: content.titleLine2 || 'for Your Home & Business',
  };
}

export function mapServicesHomepageSectionForSave(content = {}) {
  return {
    tagline: content.tagline,
    titleLine1: content.titleLine1,
    titleLine2: content.titleLine2,
  };
}

export function mapHomeCoverageFromApi(content = {}) {
  return {
    tagline: content.tagline || 'Service Coverage',
    titleLine1: content.titleLine1 || 'Areas We Serve Across the GTA',
    titleLine2: content.titleLine2 || '',
    text: content.text || '',
    gtaLabel: content.gtaLabel || 'Greater Toronto Area',
    nearbyLabel: content.nearbyLabel || 'Nearby Areas',
  };
}

export function mapHomeCoverageForSave(content = {}) {
  return {
    tagline: content.tagline,
    titleLine1: content.titleLine1,
    titleLine2: content.titleLine2,
    text: content.text,
    gtaLabel: content.gtaLabel,
    nearbyLabel: content.nearbyLabel,
  };
}
