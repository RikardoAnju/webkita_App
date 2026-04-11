// user_model.js

// ─── Constants ────────────────────────────────────────────────────────────────

export const Role = {
  User: "user",
  Admin: "admin",
};

export const StatusAktif = {
  Active: "Y",
  Inactive: "N",
};

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} email
 * @property {string} [phone]
 * @property {number} groupId
 * @property {"user"|"admin"} role
 * @property {"Y"|"N"} isAktif
 * @property {boolean} isEmailVerified
 * @property {boolean} subscribeNewsletter
 * @property {string|Date} [createdAt]
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [phone]
 * @property {number} [group_id]
 * @property {boolean} [subscribe_newsletter]
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} LoginWithUsernameRequest
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {Object} VerifyEmailRequest
 * @property {string} token
 * @property {string} email
 */

/**
 * @typedef {Object} ResendVerificationRequest
 * @property {string} email
 */

/**
 * @typedef {Object} ForgotPasswordRequest
 * @property {string} email
 */

/**
 * @typedef {Object} ResetPasswordRequest
 * @property {string} otp_token
 * @property {string} otp
 * @property {string} new_password
 * @property {string} confirm_password
 */

/**
 * @typedef {Object} UserResponse
 * @property {number} id
 * @property {string} username
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} email
 * @property {string} [phone]
 * @property {number} group_id
 * @property {"user"|"admin"} [role]
 * @property {"Y"|"N"} is_aktif
 * @property {boolean} is_email_verified
 * @property {boolean} subscribe_newsletter
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {UserResponse} user
 */

/**
 * @typedef {Object} AppError
 * @property {string} [field]
 * @property {string} message
 */

/**
 * @typedef {Object} ActionResult
 * @property {boolean} success
 * @property {string} [message]
 */

/**
 * @typedef {Object} ForgotPasswordResult
 * @property {boolean} success
 * @property {string} [message]
 * @property {string} [otpToken]
 */