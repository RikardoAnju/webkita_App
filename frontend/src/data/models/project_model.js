// project_model.js
// ─── Constants ────────────────────────────────────────────────────────────────

export const ProjectStatus = {
  Pending:   "pending",
  InReview:  "in_review",
  Approved:  "approved",
  Rejected:  "rejected",
};

export const CategoryType = {
  Ecommerce:      "E-commerce",
  LandingPage:    "Landing Page",
  CompanyProfile: "Company Profile",
  MobileApp:      "Mobile Application",
  Dashboard:      "Dashboard",
  WebApp:         "Web Application",
  BlogCMS:        "Blog/CMS",
  Portfolio:      "Portfolio",
  Other:          "Lainnya",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** @param {string} category */
export const isValidCategory = (category) =>
  Object.values(CategoryType).includes(category);

/** @param {string} status */
export const isValidProjectStatus = (status) =>
  Object.values(ProjectStatus).includes(status);

// ─── Typedefs ─────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {number} userId
 * @property {string} [planTitle]
 * @property {string} projectTitle
 * @property {string} category
 * @property {string} description
 * @property {string} skills        
 * @property {string} contactName
 * @property {string} contactPhone
 * @property {string} [additionalNotes]
 * @property {"pending"|"in_review"|"approved"|"rejected"} status
 * @property {string|Date} createdAt
 * @property {string|Date} updatedAt
 */

/**
 * @typedef {Object} ProjectAttachment
 * @property {number} id
 * @property {number} projectId
 * @property {string} fileName
 * @property {number} fileSize      
 * @property {string} [fileType]
 * @property {string} storagePath
 * @property {string|Date} createdAt
 */

/**
 * @typedef {Object} ProjectSubmission
 * @property {number}   userId          
 * @property {string}   [planTitle]
 * @property {string}   projectTitle
 * @property {string}   category
 * @property {string}   description
 * @property {string}   skills          
 * @property {string}   contactName
 * @property {string}   contactPhone
 * @property {string}   [additionalNotes]
 */

/**
 * @typedef {Object} ProjectResponse
 * @property {number}               id
 * @property {string}               projectTitle
 * @property {string}               category
 * @property {"pending"|"in_review"|"approved"|"rejected"} status
 * @property {ProjectAttachment[]}  [attachments]
 * @property {string|Date}          createdAt
 * @property {string}               message
 */