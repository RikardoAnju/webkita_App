import React, { createContext, useContext, useState, useCallback } from "react";
import API from "../core/utils/api_client";
import { ENDPOINTS } from "../core/constants/api_endpoint";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mapResponseToProject = (r) => ({
    id: r.id,
    userId: r.userId,
    planTitle: r.planTitle,
    projectTitle: r.projectTitle,
    category: r.category,
    description: r.description,
    skills: r.skills,
    contactName: r.contactName,
    contactPhone: r.contactPhone,
    additionalNotes: r.additionalNotes,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
});

const extractErrorMessage = (err) => {
    if (typeof err === "string") return err;
    return (
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.message ||
        "Terjadi kesalahan pada server"
    );
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ProjectContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const clearError = useCallback(() => setError(""), []);

    // --- 1. CREATE PROJECT ---
    const createProject = async (submission, attachments = []) => {
        setLoading(true);
        setError("");
        try {
            const form = new FormData();

            if (submission.planTitle) form.append("planTitle", submission.planTitle);
            if (submission.projectTitle) form.append("projectTitle", submission.projectTitle);
            if (submission.category) form.append("category", submission.category);
            if (submission.description) form.append("description", submission.description);
            if (submission.skills) form.append("skills", submission.skills);
            if (submission.contactName) form.append("contactName", submission.contactName);
            if (submission.contactPhone) form.append("contactPhone", submission.contactPhone);
            if (submission.additionalNotes) form.append("additionalNotes", submission.additionalNotes);

            for (const file of attachments) {
                form.append("attachments", file);
            }

            const data = await API.post(ENDPOINTS.CREATE_PROJECT, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return { success: true, data: data.data };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // --- 2. GET ALL PROJECTS (admin) ---
    const getAllProjects = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await API.get(ENDPOINTS.GET_ALL_PROJECTS);
            const mapped = (data.data ?? []).map(mapResponseToProject);
            setProjects(mapped);
            return { success: true, data: mapped, total: data.total };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // --- 3. GET MY PROJECTS ---
    const getMyProjects = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await API.get(ENDPOINTS.GET_MY_PROJECTS);
            const mapped = (data.data ?? []).map(mapResponseToProject);
            setMyProjects(mapped);
            return { success: true, data: mapped, total: data.total };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // --- 4. GET PROJECT BY ID ---
    const getProjectById = async (projectId) => {
        setLoading(true);
        setError("");
        try {
            const data = await API.get(`${ENDPOINTS.GET_PROJECT_BY_ID}/${projectId}`);
            const mapped = mapResponseToProject(data.project);
            setSelectedProject({ ...mapped, attachments: data.attachments ?? [] });
            return { success: true, data: mapped, attachments: data.attachments ?? [] };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // --- 5. GET PROJECTS BY USER (admin) ---
    const getProjectsByUser = async (userId) => {
        setLoading(true);
        setError("");
        try {
            const data = await API.get(`${ENDPOINTS.GET_PROJECTS_BY_USER}/${userId}`);
            const mapped = (data.data ?? []).map(mapResponseToProject);
            return { success: true, data: mapped, total: data.total };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // --- 6. UPDATE PROJECT STATUS ---
    const updateProjectStatus = async (projectId, status) => {
        setLoading(true);
        setError("");
        try {
            const data = await API.patch(
                `${ENDPOINTS.UPDATE_PROJECT_STATUS}/${projectId}/status`,
                { status }
            );

            // Sync local state if the updated project is in the list
            setProjects((prev) =>
                prev.map((p) => (p.id === projectId ? { ...p, status } : p))
            );
            setMyProjects((prev) =>
                prev.map((p) => (p.id === projectId ? { ...p, status } : p))
            );
            if (selectedProject?.id === projectId) {
                setSelectedProject((prev) => ({ ...prev, status }));
            }

            return { success: true, status: data.status };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // --- 7. DELETE PROJECT ---
    const deleteProject = async (projectId) => {
        setLoading(true);
        setError("");
        try {
            await API.delete(`${ENDPOINTS.DELETE_PROJECT}/${projectId}`);

            setProjects((prev) => prev.filter((p) => p.id !== projectId));
            setMyProjects((prev) => prev.filter((p) => p.id !== projectId));
            if (selectedProject?.id === projectId) setSelectedProject(null);

            return { success: true };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProjectContext.Provider
            value={{
                projects,
                myProjects,
                selectedProject,
                loading,
                error,
                clearError,
                setError,
                createProject,
                getAllProjects,
                getMyProjects,
                getProjectById,
                getProjectsByUser,
                updateProjectStatus,
                deleteProject,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject harus digunakan di dalam ProjectProvider");
    }
    return context;
};