import { Router } from 'express';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';
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
  getServiceDetailsBannerContent,
  getContactBannerContent,
  getContactPageSettingsContent,
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
  updateServiceDetailsBannerContent,
  updateContactBannerContent,
  updateContactPageSettingsContent,
  updateTopbarContent,
  upsertWidget,
} from '../../services/webContent.js';

const router = Router();

router.use(authenticate);

function requireCmsAccess(req, res, next) {
  if (req.user?.userType === 'super_admin') {
    return next();
  }

  const allowedPages = req.user?.allowedPages || [];
  if (
    allowedPages.includes('management.cms')
    || allowedPages.includes('management.cms.about')
    || allowedPages.includes('management.cms.team')
    || allowedPages.includes('management.cms.projects')
    || allowedPages.includes('management.cms.services')
    || allowedPages.includes('management.cms.contact')
  ) {
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

function requireHomeOrAboutCmsAccess(req, res, next) {
  if (req.user?.userType === 'super_admin') {
    return next();
  }

  const allowedPages = req.user?.allowedPages || [];
  if (
    allowedPages.includes('management.cms')
    || allowedPages.includes('management.cms.about')
    || allowedPages.includes('management.cms.team')
    || allowedPages.includes('management.cms.projects')
    || allowedPages.includes('management.cms.services')
    || allowedPages.includes('management.cms.contact')
  ) {
    return next();
  }

  return res.status(403).json({ error: 'You do not have access to this page' });
}

router.get('/home/about', requireHomeOrAboutCmsAccess, async (_req, res) => {
  const content = await getHomeAboutContent();
  return res.json({ content });
});

router.put('/home/about', requireHomeOrAboutCmsAccess, async (req, res) => {
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

router.post('/upload-image', requireCmsAccess, async (req, res) => {
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
