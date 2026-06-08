import React, { createContext, useContext, useState, useCallback } from "react";
import API from "../core/utils/api_client";
import { ENDPOINTS } from "../core/constants/api_endpoint";

const mapResponseToProject = (r) => ({
    id: r.id,
    userId: r.user_id ?? r.userId,
    planTitle: r.plan_title ?? r.planTitle ?? "",
    priceRange: r.price_range ?? r.priceRange ?? "",
    planPriceRange: r.plan_price_range ?? r.planPriceRange ?? "",
    projectTitle: r.project_title ?? r.projectTitle,
    category: r.category,
    description: r.description,
    skills: r.skills,
    contactName: r.contact_name ?? r.contactName,
    contactPhone: r.contact_phone ?? r.contactPhone,
    additionalNotes: r.additional_notes ?? r.additionalNotes ?? "",
    status: r.status,
    createdAt: r.created_at ?? r.createdAt,
    updatedAt: r.updated_at ?? r.updatedAt,
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

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const clearError = useCallback(() => setError(""), []);

    const createProject = async (submission, attachments = []) => {
        setLoading(true);
        setError("");
        try {
            const projectData = {
                plan_title: submission.planTitle || "",
                price_range: submission.priceRange || "",
                project_title: submission.projectTitle,
                category: submission.category,
                description: submission.description,
                skills: submission.skills,
                contact_name: submission.contactName,
                contact_phone: submission.contactPhone,
                additional_notes: submission.additionalNotes || "",
            };

            const data = await API.post(ENDPOINTS.CREATE_PROJECT, projectData);
            const projectId = data.data?.id;

            if (attachments.length > 0 && projectId) {
                for (const file of attachments) {
                    const form = new FormData();
                    form.append("file", file);
                    await API.post(ENDPOINTS.UPLOAD_ATTACHMENT(projectId), form);
                }
            }

            return { success: true, data: data.data };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

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

    const updateProjectStatus = async (projectId, status) => {
        setLoading(true);
        setError("");
        try {
            const data = await API.patch(
                `${ENDPOINTS.UPDATE_PROJECT_STATUS}/${projectId}/status`,
                { status }
            );

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

    // ✅ BARU — update harga project
    const updateProjectPrice = async (projectId, price) => {
        setLoading(true);
        setError("");
        try {
            const data = await API.patch(
                `/project/${projectId}/price`,
                { plan_price_range: price }
            );

            // Update state lokal langsung supaya tampilan berubah tanpa full refresh
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId
                        ? { ...p, priceRange: price, planPriceRange: price }
                        : p
                )
            );
            setMyProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId
                        ? { ...p, priceRange: price, planPriceRange: price }
                        : p
                )
            );
            if (selectedProject?.id === projectId) {
                setSelectedProject((prev) => ({
                    ...prev,
                    priceRange: price,
                    planPriceRange: price,
                }));
            }

            return { success: true, data: data.data };
        } catch (err) {
            const msg = extractErrorMessage(err);
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

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
                updateProjectPrice, // ✅ tambah ini
                deleteProject,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject harus digunakan di dalam ProjectProvider");
    }
    return context;
};