import { Router } from 'express';
import pool from '../db.js';
import { authenticate, requireAdminPanelAccess } from '../middleware/auth.js';
import { USER_TYPES } from '../constants.js';
import { deleteProfileImage, saveProfileImage } from '../services/profileImage.js';

const router = Router();

router.get('/profile', authenticate, requireAdminPanelAccess, async (req, res) => {
  if (req.user.userType !== USER_TYPES.TECHNICIAN) {
    return res.status(403).json({ error: 'Technician profile only' });
  }

  const profileResult = await pool.query(
    `SELECT tp.*, u.first_name, u.last_name, u.email, u.phone, u.profile_image_url
     FROM technician_profiles tp
     JOIN users u ON u.id = tp.user_id
     WHERE tp.user_id = $1`,
    [req.user.id]
  );

  if (profileResult.rowCount === 0) {
    return res.status(404).json({ error: 'Technician profile not found' });
  }

  const expertiseResult = await pool.query(
    `SELECT s.id, s.name, sc.name AS category_name
     FROM technician_expertise te
     JOIN services s ON s.id = te.service_id
     JOIN service_categories sc ON sc.id = s.category_id
     WHERE te.user_id = $1
     ORDER BY sc.sort_order, s.sort_order`,
    [req.user.id]
  );

  const profile = profileResult.rows[0];

  return res.json({
    profile: {
      userId: profile.user_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      profileImageUrl: profile.profile_image_url,
      yearsExperience: profile.years_experience,
      bio: profile.bio,
      certifications: profile.certifications,
      onboardingCompleted: profile.onboarding_completed,
    },
    expertise: expertiseResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      categoryName: row.category_name,
    })),
  });
});

router.put('/profile', authenticate, requireAdminPanelAccess, async (req, res) => {
  if (req.user.userType !== USER_TYPES.TECHNICIAN) {
    return res.status(403).json({ error: 'Technician profile only' });
  }

  const { yearsExperience, bio, certifications, phone, serviceIds, completeOnboarding, profileImageData, removeProfileImage } = req.body;

  if (yearsExperience !== undefined && (Number.isNaN(Number(yearsExperience)) || Number(yearsExperience) < 0)) {
    return res.status(400).json({ error: 'Years of experience must be a positive number' });
  }

  let profileImageUrl;
  if (removeProfileImage === true) {
    deleteProfileImage(req.user.id);
    profileImageUrl = null;
  } else if (profileImageData) {
    try {
      profileImageUrl = saveProfileImage(req.user.id, profileImageData);
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Invalid profile image' });
    }
  }

  await pool.query('BEGIN');
  try {
    if (phone !== undefined || profileImageUrl !== undefined || removeProfileImage === true) {
      await pool.query(
        `UPDATE users
         SET phone = COALESCE($1, phone),
             profile_image_url = CASE WHEN $3 = true THEN NULL WHEN $2::text IS NOT NULL THEN $2 ELSE profile_image_url END,
             updated_at = NOW()
         WHERE id = $4`,
        [
          phone ?? null,
          profileImageUrl ?? null,
          removeProfileImage === true,
          req.user.id,
        ]
      );
    }

    await pool.query(
      `UPDATE technician_profiles
       SET years_experience = COALESCE($1, years_experience),
           bio = COALESCE($2, bio),
           certifications = COALESCE($3, certifications),
           onboarding_completed = CASE WHEN $4 = true THEN true ELSE onboarding_completed END,
           updated_at = NOW()
       WHERE user_id = $5`,
      [
        yearsExperience !== undefined ? Number(yearsExperience) : null,
        bio ?? null,
        certifications ?? null,
        completeOnboarding === true,
        req.user.id,
      ]
    );

    if (Array.isArray(serviceIds)) {
      await pool.query('DELETE FROM technician_expertise WHERE user_id = $1', [req.user.id]);

      if (serviceIds.length > 0) {
        const validServices = await pool.query(
          `SELECT id FROM services WHERE id = ANY($1::int[])`,
          [serviceIds]
        );

        for (const row of validServices.rows) {
          await pool.query(
            `INSERT INTO technician_expertise (user_id, service_id) VALUES ($1, $2)`,
            [req.user.id, row.id]
          );
        }
      }
    }

    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }

  const updatedUser = await pool.query(
    'SELECT profile_image_url FROM users WHERE id = $1',
    [req.user.id]
  );

  return res.json({
    message: 'Technician profile updated successfully',
    profileImageUrl: updatedUser.rows[0]?.profile_image_url || null,
  });
});

export default router;
