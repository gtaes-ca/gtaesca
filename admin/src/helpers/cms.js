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

export function mapAboutContactFromApi(content = {}) {
  const backgroundImage = content.backgroundImage || '';

  return {
    tagline: content.tagline || '',
    title: content.title || '',
    text1: content.text1 || '',
    text2: content.text2 || '',
    primaryButtonText: content.primaryButtonText || '',
    primaryButtonLink: content.primaryButtonLink || '',
    secondaryButtonText: content.secondaryButtonText || '',
    secondaryButtonLink: content.secondaryButtonLink || '',
    backgroundImage,
    backgroundImagePreview: resolveCmsAssetUrl(backgroundImage),
    backgroundImageData: null,
  };
}

export function mapAboutContactForSave(content = {}) {
  return {
    tagline: content.tagline,
    title: content.title,
    text1: content.text1,
    text2: content.text2,
    primaryButtonText: content.primaryButtonText,
    primaryButtonLink: content.primaryButtonLink,
    secondaryButtonText: content.secondaryButtonText,
    secondaryButtonLink: content.secondaryButtonLink,
    backgroundImage: content.backgroundImage,
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
