import { Router } from 'express';
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
  getPublicContactPageSettingsContent,
  getFaqBannerContent,
  getFaqSettingsContent,
  getPrivacyBannerContent,
  getPrivacyPageContent,
  getTermsBannerContent,
  getTermsPageContent,
  getTopbarContent,
  getWidget,
} from '../services/webContent.js';

const router = Router();

router.get('/home/topbar', async (_req, res) => {
  const content = await getTopbarContent();
  return res.json({ content });
});

router.get('/home/slider', async (_req, res) => {
  const content = await getSliderContent();
  return res.json({ content });
});

router.get('/home/services', async (_req, res) => {
  const content = await getHomeServicesContent();
  return res.json({ content });
});

router.get('/home/about', async (_req, res) => {
  const content = await getHomeAboutContent();
  return res.json({ content });
});

router.get('/home/featured-services', async (_req, res) => {
  const content = await getFeaturedServicesContent();
  return res.json({ content });
});

router.get('/home/gallery', async (_req, res) => {
  const content = await getHomeGalleryContent();
  return res.json({ content });
});

router.get('/contact/settings', async (_req, res) => {
  const content = await getPublicContactPageSettingsContent();
  return res.json({ content });
});

router.get('/contact/banner', async (_req, res) => {
  const content = await getContactBannerContent();
  return res.json({ content });
});

router.get('/faq/banner', async (_req, res) => {
  const content = await getFaqBannerContent();
  return res.json({ content });
});

router.get('/faq/settings', async (_req, res) => {
  const content = await getFaqSettingsContent();
  return res.json({ content });
});

router.get('/terms/banner', async (_req, res) => {
  const content = await getTermsBannerContent();
  return res.json({ content });
});

router.get('/terms/content', async (_req, res) => {
  const content = await getTermsPageContent();
  return res.json({ content });
});

router.get('/privacy/banner', async (_req, res) => {
  const content = await getPrivacyBannerContent();
  return res.json({ content });
});

router.get('/privacy/content', async (_req, res) => {
  const content = await getPrivacyPageContent();
  return res.json({ content });
});

router.get('/services/banner', async (_req, res) => {
  const content = await getServicesBannerContent();
  return res.json({ content });
});

router.get('/service-details/banner', async (_req, res) => {
  const content = await getServiceDetailsBannerContent();
  return res.json({ content });
});

router.get('/projects/gallery', async (_req, res) => {
  const content = await getProjectsGalleryContent();
  return res.json({ content });
});

router.get('/projects/banner', async (_req, res) => {
  const content = await getProjectsBannerContent();
  return res.json({ content });
});

router.get('/project-details/banner', async (_req, res) => {
  const content = await getProjectDetailsBannerContent();
  return res.json({ content });
});

router.get('/team-details/banner', async (_req, res) => {
  const content = await getTeamDetailsBannerContent();
  return res.json({ content });
});

router.get('/team/banner', async (_req, res) => {
  const content = await getTeamBannerContent();
  return res.json({ content });
});

router.get('/about/banner', async (_req, res) => {
  const content = await getAboutBannerContent();
  return res.json({ content });
});

router.get('/about/contact', async (_req, res) => {
  const content = await getAboutContactContent();
  return res.json({ content });
});

router.get('/:page', async (req, res) => {
  const widgets = await getPageWidgets(req.params.page);
  return res.json({ widgets });
});

router.get('/:page/:section', async (req, res) => {
  const widget = await getWidget(req.params.page, req.params.section);
  if (!widget) {
    return res.status(404).json({ error: 'Widget not found' });
  }
  return res.json({ content: widget.content });
});

export default router;
