import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    activateTemplate,
    getActiveTemplate,
    getOverrides,
    getOverride,
    createOverride,
    updateOverride,
    deleteOverride,
    deleteOverrideByDate,
    getSchedulePreview,
    getTodaySchedule,
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity
} from '@/lib/api/schedule';

// Query Keys
export const scheduleKeys = {
    all: ['schedule'],
    templates: () => [...scheduleKeys.all, 'templates'],
    activeTemplate: () => [...scheduleKeys.templates(), 'active'],
    template: (id) => [...scheduleKeys.templates(), id],
    overrides: () => [...scheduleKeys.all, 'overrides'],
    override: (id) => [...scheduleKeys.overrides(), id],
    preview: (date) => [...scheduleKeys.all, 'preview', date],
    activities: () => [...scheduleKeys.all, 'activities'],
};

// --- Templates ---

export function useTemplates(params) {
    return useQuery({
        queryKey: [...scheduleKeys.templates(), params],
        queryFn: () => getTemplates(params),
    });
}

export function useTemplate(id) {
    return useQuery({
        queryKey: scheduleKeys.template(id),
        queryFn: () => getTemplate(id),
        enabled: !!id,
    });
}

export function useActiveTemplate() {
    return useQuery({
        queryKey: scheduleKeys.activeTemplate(),
        queryFn: getActiveTemplate,
    });
}

export function useCreateTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.templates() });
        },
    });
}

export function useUpdateTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateTemplate(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.templates() });
            queryClient.invalidateQueries({ queryKey: scheduleKeys.template(variables.id) });
        },
    });
}

export function useDeleteTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.templates() });
        },
    });
}

export function useActivateTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: activateTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.templates() });
        },
    });
}

// --- Overrides ---

export function useOverrides(params) {
    return useQuery({
        queryKey: [...scheduleKeys.overrides(), params],
        queryFn: () => getOverrides(params),
    });
}

export function useOverride(id) {
    return useQuery({
        queryKey: scheduleKeys.override(id),
        queryFn: () => getOverride(id),
        enabled: !!id,
    });
}

export function useCreateOverride() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOverride,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.overrides() });
            // Invalidate previews that might be affected
            queryClient.invalidateQueries({ queryKey: ['schedule', 'preview'] });
        },
    });
}

export function useUpdateOverride() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateOverride(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.overrides() });
            queryClient.invalidateQueries({ queryKey: scheduleKeys.override(variables.id) });
            queryClient.invalidateQueries({ queryKey: scheduleKeys.preview(variables.data.override_date) });
        },
    });
}

export function useDeleteOverride() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOverride,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.overrides() });
            queryClient.invalidateQueries({ queryKey: ['schedule', 'preview'] });
        },
    });
}

export function useDeleteOverrideByDate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOverrideByDate,
        onSuccess: (data, date) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.overrides() });
            queryClient.invalidateQueries({ queryKey: scheduleKeys.preview(date) });
        },
    });
}

// --- Preview ---

export function useSchedulePreview(date) {
    return useQuery({
        queryKey: scheduleKeys.preview(date),
        queryFn: () => getSchedulePreview(date),
        enabled: !!date,
    });
}

export function useTodaySchedule() {
    return useQuery({
        queryKey: ['schedule', 'today'],
        queryFn: () => getTodaySchedule(),
    });
}

// --- Activities (Master Data) ---

export function useActivities() {
    return useQuery({
        queryKey: scheduleKeys.activities(),
        queryFn: getActivities,
    });
}

export function useCreateActivity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.activities() });
        },
    });
}

export function useUpdateActivity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateActivity(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.activities() });
        },
    });
}

export function useDeleteActivity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.activities() });
        },
    });
}

