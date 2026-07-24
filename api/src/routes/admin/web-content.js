import { Router } from 'express';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';
import { getAllowedPagesForUser } from '../../services/pageAccess.js';
import {
  getAboutBannerContent,
  getAboutContactContent,
  getFeaturedServicesContent,
  getHomeAboutContent,
  getHomeGalleryContent,
  getHomeServicesContent,
  getPageWidgets,
  getSliderContent,
  getTeamBannerContent,
  getTeamDetailsBannerContent,
  getProjectsBannerContent,
  getProjectsGalleryContent,
  getProjectDetailsBannerContent,
  getServicesBannerContent,
  getServiceCategoryBannerContent,
  getServiceCategoryDetailsContent,
  getServiceCategoryGalleryContent,
  getServiceDetailsBannerContent,
  getContactBannerContent,
  getContactPageSettingsContent,
  getFaqBannerContent,
  getFaqSettingsContent,
  getPrivacyBannerContent,
  getPrivacyPageContent,
  getTermsBannerContent,
  getTermsPageContent,
  getTopbarContent,
  getWidget,
  saveWidgetImage,
  updateAboutBannerContent,
  updateAboutContactContent,
  updateFeaturedServicesContent,
  updateHomeAboutContent,
  updateHomeGalleryContent,
  updateHomeServicesContent,
  updateSliderContent,
  updateTeamBannerContent,
  updateTeamDetailsBannerContent,
  updateProjectsBannerContent,
  updateProjectsGalleryContent,
  updateProjectDetailsBannerContent,
  updateServicesBannerContent,
  updateServiceCategoryBannerContent,
  updateServiceCategoryDetailsContent,
  updateServiceCategoryGalleryContent,
  updateServiceDetailsBannerContent,
  updateContactBannerContent,
  updateContactPageSettingsContent,
  updateFaqBannerContent,
  updateFaqSettingsContent,
  updatePrivacyBannerContent,
  updatePrivacyPageContent,
  updateTermsBannerContent,
  updateTermsPageContent,
  updateTopbarContent,
  upsertWidget,
} from '../../services/webContent.js';

const router = Router();

router.use(authenticate);

const CMS_PAGE_KEYS = [
  'management.cms',
  'management.cms.about',
  'management.cms.team',
  'management.cms.projects',
  'management.cms.services',
  'management.cms.contact',
  'management.cms.faq',
  'management.cms.legal',
];

function hasAnyCmsPageAccess(allowedPages) {
  return CMS_PAGE_KEYS.some((pageKey) => allowedPages.includes(pageKey));
}

async function requireAnyCmsAccess(req, res, next) {
  if (req.user?.userType === 'super_admin') {
    return next();
  }

  const allowedPages = await getAllowedPagesForUser(req.user);
  if (hasAnyCmsPageAccess(allowedPages)) {
    return next();
  }

  return res.status(403).json({ error: 'You do not have access to this page' });
}

router.get('/home/topbar', requirePageAccess('management.cms'), async (_req, res) => {
  const content = await getTopbarContent();
  return res.json({ content });
});

router.put('/home/topbar', requirePageAccess('management.cms'), async (req, res) => {
  try {
    const widget = await updateTopbarContent(req.body?.content || req.body);
    return res.json({ widget, content: widget.content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/home/slider', requirePageAccess('management.cms'), async (_req, res) => {
  const content = await getSliderContent();
  return res.json({ content });
});

router.put('/home/slider', requirePageAccess('management.cms'), async (req, res) => {
  try {
    const widget = await updateSliderContent(req.body?.content || req.body);
    return res.json({ widget, content: widget.content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/home/services', requirePageAccess('management.cms'), async (_req, res) => {
  const content = await getHomeServicesContent();
  return res.json({ content });
});

router.put('/home/services', requirePageAccess('management.cms'), async (req, res) => {
  try {
    const widget = await updateHomeServicesContent(req.body?.content || req.body);
    return res.json({ widget, content: widget.content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/home/about', requireAnyCmsAccess, async (_req, res) => {
  const content = await getHomeAboutContent();
  return res.json({ content });
});

router.put('/home/about', requireAnyCmsAccess, async (req, res) => {
  try {
    const widget = await updateHomeAboutContent(req.body?.content || req.body);
    return res.json({ widget, content: widget.content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/home/featured-services', requirePageAccess('management.cms'), async (_req, res) => {
  const content = await getFeaturedServicesContent();
  return res.json({ content });
});

router.put('/home/featured-services', requirePageAccess('management.cms'), async (req, res) => {
  try {
    await updateFeaturedServicesContent(req.body?.content || req.body);
    const content = await getFeaturedServicesContent();
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/home/gallery', requirePageAccess('management.cms'), async (_req, res) => {
  const content = await getHomeGalleryContent();
  return res.json({ content });
});

router.put('/home/gallery', requirePageAccess('management.cms'), async (req, res) => {
  try {
    const widget = await updateHomeGalleryContent(req.body?.content || req.body);
    return res.json({ widget, content: widget.content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/team-details/banner', requirePageAccess('management.cms.team'), async (_req, res) => {
  const content = await getTeamDetailsBannerContent();
  return res.json({ content });
});

router.put('/team-details/banner', requirePageAccess('management.cms.team'), async (req, res) => {
  try {
    const content = await updateTeamDetailsBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/team/banner', requirePageAccess('management.cms.team'), async (_req, res) => {
  const content = await getTeamBannerContent();
  return res.json({ content });
});

router.put('/team/banner', requirePageAccess('management.cms.team'), async (req, res) => {
  try {
    const content = await updateTeamBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/projects/gallery', requirePageAccess('management.cms.projects'), async (_req, res) => {
  const content = await getProjectsGalleryContent();
  return res.json({ content });
});

router.put('/projects/gallery', requirePageAccess('management.cms.projects'), async (req, res) => {
  try {
    const widget = await updateProjectsGalleryContent(req.body?.content || req.body);
    return res.json({ widget, content: widget.content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/projects/banner', requirePageAccess('management.cms.projects'), async (_req, res) => {
  const content = await getProjectsBannerContent();
  return res.json({ content });
});

router.put('/projects/banner', requirePageAccess('management.cms.projects'), async (req, res) => {
  try {
    const content = await updateProjectsBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/project-details/banner', requirePageAccess('management.cms.projects'), async (_req, res) => {
  const content = await getProjectDetailsBannerContent();
  return res.json({ content });
});

router.put('/project-details/banner', requirePageAccess('management.cms.projects'), async (req, res) => {
  try {
    const content = await updateProjectDetailsBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/services/banner', requirePageAccess('management.cms.services'), async (_req, res) => {
  const content = await getServicesBannerContent();
  return res.json({ content });
});

router.put('/services/banner', requirePageAccess('management.cms.services'), async (req, res) => {
  try {
    const content = await updateServicesBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/residential/banner', requirePageAccess('management.cms.services'), async (_req, res) => {
  const content = await getServiceCategoryBannerContent('residential');
  return res.json({ content });
});

router.put('/residential/banner', requirePageAccess('management.cms.services'), async (req, res) => {
  try {
    const content = await updateServiceCategoryBannerContent('residential', req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/residential/details', requirePageAccess('management.cms.services'), async (_req, res) => {
  const content = await getServiceCategoryDetailsContent('residential');
  return res.json({ content });
});

router.put('/residential/details', requirePageAccess('management.cms.services'), async (req, res) => {
  try {
    const content = await updateServiceCategoryDetailsContent('residential', req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/residential/gallery', requirePageAccess('management.cms.services'), async (_req, res) => {
  const content = await getServiceCategoryGalleryContent('residential');
  return res.json({ content });
});

router.put('/residential/gallery', requirePageAccess('management.cms.services'), async (req, res) => {
  try {
    const content = await updateServiceCategoryGalleryContent('residential', req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/commercial/banner', requirePageAccess('management.cms.services'), async (_req, res) => {
  const content = await getServiceCategoryBannerContent('commercial');
  return res.json({ content });
});

router.put('/commercial/banner', requirePageAccess('management.cms.services'), async (req, res) => {
  try {
    const content = await updateServiceCategoryBannerContent('commercial', req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/commercial/details', requirePageAccess('management.cms.services'), async (_req, res) => {
  const content = await getServiceCategoryDetailsContent('commercial');
  return res.json({ content });
});

router.put('/commercial/details', requirePageAccess('management.cms.services'), async (req, res) => {
  try {
    const content = await updateServiceCategoryDetailsContent('commercial', req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/commercial/gallery', requirePageAccess('management.cms.services'), async (_req, res) => {
  const content = await getServiceCategoryGalleryContent('commercial');
  return res.json({ content });
});

router.put('/commercial/gallery', requirePageAccess('management.cms.services'), async (req, res) => {
  try {
    const content = await updateServiceCategoryGalleryContent('commercial', req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/service-details/banner', requirePageAccess('management.cms.services'), async (_req, res) => {
  const content = await getServiceDetailsBannerContent();
  return res.json({ content });
});

router.put('/service-details/banner', requirePageAccess('management.cms.services'), async (req, res) => {
  try {
    const content = await updateServiceDetailsBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/contact/settings', requirePageAccess('management.cms.contact'), async (_req, res) => {
  const content = await getContactPageSettingsContent();
  return res.json({ content });
});

router.put('/contact/settings', requirePageAccess('management.cms.contact'), async (req, res) => {
  try {
    const content = await updateContactPageSettingsContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/contact/banner', requirePageAccess('management.cms.contact'), async (_req, res) => {
  const content = await getContactBannerContent();
  return res.json({ content });
});

router.put('/contact/banner', requirePageAccess('management.cms.contact'), async (req, res) => {
  try {
    const content = await updateContactBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/faq/banner', requirePageAccess('management.cms.faq'), async (_req, res) => {
  const content = await getFaqBannerContent();
  return res.json({ content });
});

router.put('/faq/banner', requirePageAccess('management.cms.faq'), async (req, res) => {
  try {
    const content = await updateFaqBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/faq/settings', requirePageAccess('management.cms.faq'), async (_req, res) => {
  const content = await getFaqSettingsContent();
  return res.json({ content });
});

router.put('/faq/settings', requirePageAccess('management.cms.faq'), async (req, res) => {
  try {
    const content = await updateFaqSettingsContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/terms/banner', requirePageAccess('management.cms.legal'), async (_req, res) => {
  const content = await getTermsBannerContent();
  return res.json({ content });
});

router.put('/terms/banner', requirePageAccess('management.cms.legal'), async (req, res) => {
  try {
    const content = await updateTermsBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/terms/content', requirePageAccess('management.cms.legal'), async (_req, res) => {
  const content = await getTermsPageContent();
  return res.json({ content });
});

router.put('/terms/content', requirePageAccess('management.cms.legal'), async (req, res) => {
  try {
    const content = await updateTermsPageContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/privacy/banner', requirePageAccess('management.cms.legal'), async (_req, res) => {
  const content = await getPrivacyBannerContent();
  return res.json({ content });
});

router.put('/privacy/banner', requirePageAccess('management.cms.legal'), async (req, res) => {
  try {
    const content = await updatePrivacyBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/privacy/content', requirePageAccess('management.cms.legal'), async (_req, res) => {
  const content = await getPrivacyPageContent();
  return res.json({ content });
});

router.put('/privacy/content', requirePageAccess('management.cms.legal'), async (req, res) => {
  try {
    const content = await updatePrivacyPageContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/about/banner', requirePageAccess('management.cms.about'), async (_req, res) => {
  const content = await getAboutBannerContent();
  return res.json({ content });
});

router.put('/about/banner', requirePageAccess('management.cms.about'), async (req, res) => {
  try {
    const content = await updateAboutBannerContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/about/contact', requirePageAccess('management.cms.about'), async (_req, res) => {
  const content = await getAboutContactContent();
  return res.json({ content });
});

router.put('/about/contact', requirePageAccess('management.cms.about'), async (req, res) => {
  try {
    const content = await updateAboutContactContent(req.body.content || {});
    return res.json({ content });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/upload-image', requireAnyCmsAccess, async (req, res) => {
  try {
    const { dataUrl, key } = req.body || {};
    if (!dataUrl || !key) {
      return res.status(400).json({ error: 'dataUrl and key are required' });
    }
    const url = await saveWidgetImage(dataUrl, key);
    return res.json({ url });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/:page', requirePageAccess('management.cms'), async (req, res) => {
  const widgets = await getPageWidgets(req.params.page);
  return res.json({ widgets });
});

router.get('/:page/:section', requirePageAccess('management.cms'), async (req, res) => {
  const widget = await getWidget(req.params.page, req.params.section);
  if (!widget) {
    return res.status(404).json({ error: 'Widget not found' });
  }
  return res.json({ widget });
});

router.put('/:page/:section', requirePageAccess('management.cms'), async (req, res) => {
  try {
    const widget = await upsertWidget(req.params.page, req.params.section, req.body?.content || req.body);
    return res.json({ widget });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
