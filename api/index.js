import cors from 'cors';
import express from 'express';
import pool from './src/db.js';
import { getUploadsDir, ensureUploadsDirs } from './src/services/profileImage.js';
import { migrate } from './src/migrate.js';
import { BRAND_NAME } from './src/constants.js';
import authRoutes from './src/routes/auth.js';
import invitationRoutes from './src/routes/invitations.js';
import adminUserRoutes from './src/routes/admin/users.js';
import serviceCategoryRoutes from './src/routes/admin/service-categories.js';
import adminServicesRoutes from './src/routes/admin/services.js';
import serviceLocationRoutes from './src/routes/admin/service-locations.js';
import technicianRoutes from './src/routes/technician.js';
import technicianBookingsRoutes from './src/routes/technician/bookings.js';
import customerBookingsRoutes from './src/routes/customer/bookings.js';
import bookingsRoutes from './src/routes/bookings.js';
import adminBookingsRoutes from './src/routes/admin/bookings.js';
import bookingSettingsRoutes from './src/routes/admin/booking-settings.js';
import adminMaterialsRoutes from './src/routes/admin/materials.js';
import adminAnalyticsRoutes from './src/routes/admin/analytics.js';
import pageAccessRoutes from './src/routes/admin/page-access.js';
import notificationsRoutes from './src/routes/notifications.js';
import servicesRoutes from './src/routes/services.js';
import teamRoutes from './src/routes/team.js';
import projectsRoutes from './src/routes/projects.js';
import contactRoutes from './src/routes/contact.js';
import faqsRoutes from './src/routes/faqs.js';
import webContentRoutes from './src/routes/web-content.js';
import adminWebContentRoutes from './src/routes/admin/web-content.js';
import adminFaqsRoutes from './src/routes/admin/faqs.js';

const app = express();
const port = Number(process.env.PORT) || 3001;
const jsonBodyLimit = process.env.JSON_BODY_LIMIT || '15mb';

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  }),
);
app.use(express.json({ limit: jsonBodyLimit }));
app.use('/uploads', express.static(getUploadsDir()));

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: error.message,
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/service-categories', serviceCategoryRoutes);
app.use('/api/admin/services', adminServicesRoutes);
app.use('/api/admin/service-locations', serviceLocationRoutes);
app.use('/api/admin/bookings', adminBookingsRoutes);
app.use('/api/admin/booking-settings', bookingSettingsRoutes);
app.use('/api/admin/materials', adminMaterialsRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin/page-access', pageAccessRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/technician', technicianBookingsRoutes);
app.use('/api/customer/bookings', customerBookingsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/web-content', webContentRoutes);
app.use('/api/admin/web-content', adminWebContentRoutes);
app.use('/api/admin/faqs', adminFaqsRoutes);

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({
      error: `Request payload is too large. Image uploads must be ${jsonBodyLimit} or smaller after encoding.`,
    });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  ensureUploadsDirs();
  await migrate();
  app.listen(port, '0.0.0.0', () => {
    console.log(`${BRAND_NAME} API listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});
