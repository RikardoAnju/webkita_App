
export const ENDPOINTS = {
    // Auth
    LOGIN: "/login",
    REGISTER: "/register",
    
    // Users
    GET_ALL_USERS: "/users",
    GET_USER_PROFILE: "/profile",
    UPDATE_USER: "/users/update",
    DELETE_USER: (username) => `/users/${username}`,
    
    // Others
    CHECK_EMAIL: "/check-email",
};