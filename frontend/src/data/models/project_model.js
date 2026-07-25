
export const ProjectStatus = {
  Pending:  "pending",
  Process:  "process",   
  Approved: "approved",
  Rejected: "rejected",
  Done:     "done",       
};


export const CategoryLabel = {
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


export const CategoryType = {
  Website:   "website",
  Mobile:    "mobile",
  Desktop:   "desktop",
  Design:    "design",
  Marketing: "marketing",
  Other:     "other",
};



/** @param {string} category */
export const isValidCategory = (category) =>
  Object.values(CategoryType).includes(category);

/** @param {string} status */
export const isValidProjectStatus = (status) =>
  Object.values(ProjectStatus).includes(status);


/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {number} userId
 * @property {string} [planTitle]
 * @property {string} [priceRange]    
 * @property {string} projectTitle
 * @property {string} category
 * @property {string} description
 * @property {string} skills
 * @property {string} contactName
 * @property {string} contactPhone
 * @property {string} [additionalNotes]
 * @property {"pending"|"process"|"approved"|"rejected"|"done"} status
 * @property {string|Date} createdAt
 * @property {string|Date} [updatedAt]
 * @property {string|Date|null} [deletedAt]
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
 * @property {number} userId
 * @property {string} [planTitle]
 * @property {string} [priceRange]     
 * @property {string} projectTitle
 * @property {string} category
 * @property {string} description
 * @property {string} skills
 * @property {string} contactName
 * @property {string} contactPhone
 * @property {string} [additionalNotes]
 */

/**
 * @typedef {Object} ProjectResponse
 * @property {number} id
 * @property {string} [planTitle]
 * @property {string} [priceRange]   
 * @property {string} projectTitle
 * @property {string} category
 * @property {"pending"|"process"|"approved"|"rejected"|"done"} status
 * @property {ProjectAttachment[]} [attachments]
 * @property {string|Date} createdAt
 * @property {string} [message]
 */

/**
 * 
 * @typedef {Object} SelectedPlan
 * @property {string} title
 * @property {string} priceRange
 * @property {string} tier
 * @property {number} minPrice
 * @property {number} maxPrice
 * @property {string[]} features
 * @property {string[]} [notIncluded]
 * @property {string} [badge]
 * @property {number} [userId]        
 */