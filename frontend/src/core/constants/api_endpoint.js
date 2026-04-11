// src/core/utils/api_endpoint.js

export const ENDPOINTS = {
  // ─── Auth (public) ──────────────────────────────────────────────
  LOGIN_EMAIL:          "/auth/login-email",
  LOGIN_USERNAME:       "/auth/login-username",
  REGISTER:             "/auth/register",
  VERIFY_EMAIL:         "/auth/verify-email",          // GET ?token=&email=
  RESEND_VERIFICATION:  "/auth/resend-verification",
  FORGOT_PASSWORD:      "/auth/forgot-password",
  RESET_PASSWORD:       "/auth/reset-password",

  // ─── Auth (protected) ───────────────────────────────────────────
  GET_PROFILE:          "/auth/profile",

  // ─── Users ──────────────────────────────────────────────────────
  GET_ALL_USERS:        "/users",
  UPDATE_USER:          "/user/update",
  DELETE_USER:          (username) => `/users/${username}`,
};