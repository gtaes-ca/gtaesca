import pool from '../db.js';
import { deleteProfileImage, saveProfileImage } from './profileImage.js';
import { formatUser } from './users.js';

export async function updateUserProfileImage(userId, { profileImageData, removeProfileImage }) {
  let profileImageUrl;

  if (removeProfileImage === true) {
    deleteProfileImage(userId);
    profileImageUrl = null;
  } else if (profileImageData) {
    profileImageUrl = saveProfileImage(userId, profileImageData);
  } else {
    return null;
  }

  const result = await pool.query(
    `UPDATE users
     SET profile_image_url = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [profileImageUrl, userId]
  );

  return formatUser(result.rows[0]);
}

export async function updateUserPhone(userId, phone) {
  const result = await pool.query(
    `UPDATE users SET phone = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [phone, userId]
  );
  return formatUser(result.rows[0]);
}

export async function updateUserProfile(userId, { firstName, lastName, phone, bio }) {
  const sets = [];
  const params = [];
  let paramIndex = 1;

  if (firstName !== undefined) {
    sets.push(`first_name = $${paramIndex++}`);
    params.push(firstName?.trim() || null);
  }
  if (lastName !== undefined) {
    sets.push(`last_name = $${paramIndex++}`);
    params.push(lastName?.trim() || null);
  }
  if (phone !== undefined) {
    sets.push(`phone = $${paramIndex++}`);
    params.push(phone?.trim() || null);
  }
  if (bio !== undefined) {
    sets.push(`bio = $${paramIndex++}`);
    params.push(bio?.trim() || null);
  }

  if (sets.length === 0) {
    return null;
  }

  sets.push('updated_at = NOW()');
  params.push(userId);

  const result = await pool.query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    params
  );

  return formatUser(result.rows[0]);
}
