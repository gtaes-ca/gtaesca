import pool from '../db.js';

const ROLE_LABELS = {
  technician: 'Electrician',
  admin: 'Operations Admin',
  support: 'Support Specialist',
  viewer: 'Team Member',
};

function formatRoleLabel(role) {
  if (!role) return 'Team Member';
  return ROLE_LABELS[role] || role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function listPublicTeamMembers() {
  const result = await pool.query(
    `SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.profile_image_url,
        u.role,
        u.user_type,
        tp.bio,
        tp.years_experience,
        tp.onboarding_completed,
        (
          SELECT s.name
          FROM technician_expertise te
          JOIN services s ON s.id = te.service_id
          WHERE te.user_id = u.id
          ORDER BY s.name
          LIMIT 1
        ) AS primary_expertise
     FROM users u
     LEFT JOIN technician_profiles tp ON tp.user_id = u.id
     WHERE u.status = 'active'
       AND u.user_type IN ('technician', 'operation_team')
     ORDER BY
       CASE WHEN u.user_type = 'technician' THEN 0 ELSE 1 END,
       tp.onboarding_completed DESC NULLS LAST,
       u.first_name,
       u.last_name`
  );

  return result.rows.map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: `${row.first_name} ${row.last_name}`.trim(),
    profileImageUrl: row.profile_image_url,
    role: row.role,
    userType: row.user_type,
    title: row.primary_expertise || formatRoleLabel(row.role),
    bio: row.bio || '',
    yearsExperience: row.years_experience ?? 0,
    onboardingCompleted: Boolean(row.onboarding_completed),
  }));
}

export async function getPublicTeamMemberById(id) {
  const result = await pool.query(
    `SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.profile_image_url,
        u.bio AS user_bio,
        u.role,
        u.user_type,
        tp.bio,
        tp.years_experience,
        tp.certifications,
        tp.onboarding_completed
     FROM users u
     LEFT JOIN technician_profiles tp ON tp.user_id = u.id
     WHERE u.id = $1
       AND u.status = 'active'
       AND u.user_type IN ('technician', 'operation_team')`,
    [id]
  );

  if (!result.rowCount) {
    return null;
  }

  const row = result.rows[0];

  const expertiseResult = await pool.query(
    `SELECT s.name, sc.name AS category_name
     FROM technician_expertise te
     JOIN services s ON s.id = te.service_id
     JOIN service_categories sc ON sc.id = s.category_id
     WHERE te.user_id = $1
     ORDER BY sc.sort_order, s.sort_order, s.name`,
    [id]
  );

  const expertise = expertiseResult.rows.map((item) => ({
    name: item.name,
    categoryName: item.category_name,
  }));

  const primaryExpertise = expertise[0]?.name || null;
  const bio = String(row.bio || row.user_bio || '').trim();

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email || '',
    phone: row.phone || '',
    profileImageUrl: row.profile_image_url,
    role: row.role,
    userType: row.user_type,
    title: primaryExpertise || formatRoleLabel(row.role),
    bio,
    certifications: String(row.certifications || '').trim(),
    yearsExperience: row.years_experience ?? 0,
    onboardingCompleted: Boolean(row.onboarding_completed),
    expertise,
  };
}
