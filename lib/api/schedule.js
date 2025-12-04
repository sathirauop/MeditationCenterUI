import axiosClient from '@/lib/axios-client';

const API_BASE = '/admin';
const PUBLIC_API_BASE = '/schedule';

// Templates
export const getTemplates = async (params) => {
    return await axiosClient.get(`${API_BASE}/templates`, { params });
};

export const getTemplate = async (id) => {
    return await axiosClient.get(`${API_BASE}/templates/${id}`);
};

export const createTemplate = async (data) => {
    return await axiosClient.post(`${API_BASE}/templates`, data);
};

export const updateTemplate = async (id, data) => {
    return await axiosClient.put(`${API_BASE}/templates/${id}`, data);
};

export const deleteTemplate = async (id) => {
    return await axiosClient.delete(`${API_BASE}/templates/${id}`);
};

export const activateTemplate = async (id) => {
    return await axiosClient.patch(`${API_BASE}/templates/${id}/activate`);
};

// Template Activities
export const addTemplateActivity = async (templateId, data) => {
    return await axiosClient.post(`${API_BASE}/templates/${templateId}/activities`, data);
};

export const updateTemplateActivity = async (templateId, activityId, data) => {
    return await axiosClient.put(`${API_BASE}/templates/${templateId}/activities/${activityId}`, data);
};

export const deleteTemplateActivity = async (templateId, activityId) => {
    return await axiosClient.delete(`${API_BASE}/templates/${templateId}/activities/${activityId}`);
};

// Overrides
export const getOverrides = async (params) => {
    return await axiosClient.get(`${API_BASE}/overrides`, { params });
};

export const getOverride = async (id) => {
    return await axiosClient.get(`${API_BASE}/overrides/${id}`);
};

export const createOverride = async (data) => {
    return await axiosClient.post(`${API_BASE}/overrides`, data);
};

export const createOverrideFromTemplate = async (data) => {
    return await axiosClient.post(`${API_BASE}/overrides/from-template`, data);
};

export const updateOverride = async (id, data) => {
    return await axiosClient.put(`${API_BASE}/overrides/${id}`, data);
};

export const deleteOverride = async (id) => {
    return await axiosClient.delete(`${API_BASE}/overrides/${id}`);
};

// Override Activities
export const updateOverrideActivity = async (overrideId, activityId, data) => {
    return await axiosClient.put(`${API_BASE}/overrides/${overrideId}/activities/${activityId}`, data);
};

export const cancelOverrideActivity = async (overrideId, activityId) => {
    return await axiosClient.patch(`${API_BASE}/overrides/${overrideId}/activities/${activityId}/cancel`);
};

export const restoreOverrideActivity = async (overrideId, activityId) => {
    return await axiosClient.patch(`${API_BASE}/overrides/${overrideId}/activities/${activityId}/restore`);
};

// Public Preview
export const getSchedulePreview = async (date) => {
    return await axiosClient.get(`${PUBLIC_API_BASE}/preview`, { params: { date } });
};

// Activities (Master Data)
export const getActivities = async () => {
    return await axiosClient.get(`${API_BASE}/activities`);
};

export const createActivity = async (data) => {
    return await axiosClient.post(`${API_BASE}/activities`, data);
};

export const updateActivity = async (id, data) => {
    return await axiosClient.patch(`${API_BASE}/activities/${id}`, data);
};

export const deleteActivity = async (id) => {
    return await axiosClient.delete(`${API_BASE}/activities/${id}`);
};
