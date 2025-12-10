'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import TimelineEditor from './TimelineEditor';
import {
    useActivities,
    useTemplate,
    useCreateTemplate,
    useUpdateTemplate
} from '@/lib/hooks/use-schedule';

export default function TemplateEditor({ templateId = null, onBack }) {
    const router = useRouter();
    const { toast } = useToast();

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        activities: [],
    });

    // React Query Hooks
    const { data: activitiesData, isLoading: loadingActivities } = useActivities();
    const { data: templateData, isLoading: loadingTemplate, error: templateError } = useTemplate(templateId);

    const createTemplateMutation = useCreateTemplate();
    const updateTemplateMutation = useUpdateTemplate();

    const availableActivities = activitiesData?.data || [];

    // Initialize state from template data
    useEffect(() => {
        if (templateId && templateData) {
            setFormData({
                name: templateData.name,
                description: templateData.description || '',
                activities: (templateData.activities || []).map((a, idx) => ({
                    id: a.template_activity_id || `existing-${idx}`,
                    activity_id: a.activity_id,
                    activity_title: a.activity_title,
                    start_time: a.start_time,
                    end_time: a.end_time,
                    notes: a.notes || '',
                })),
            });
        }
    }, [templateId, templateData]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Template name is required",
            });
            return;
        }

        if (formData.activities.length === 0) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "At least one activity is required",
            });
            return;
        }

        setSaving(true);
        const payload = {
            name: formData.name,
            description: formData.description,
            activities: formData.activities.map(a => ({
                activityId: a.activity_id,
                startTime: a.start_time,
                endTime: a.end_time,
                notes: a.notes,
            })),
        };

        const onSuccess = () => {
            setSaving(false);
            toast({ title: "Success", description: templateId ? "Template updated successfully" : "Template created successfully" });
            onBack?.();
        };

        const onError = (error) => {
            setSaving(false);
            console.error('Save error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to save template",
            });
        };

        if (templateId) {
            updateTemplateMutation.mutate({ id: templateId, data: payload }, { onSuccess, onError });
        } else {
            createTemplateMutation.mutate(payload, { onSuccess, onError });
        }
    };

    if (loadingActivities || (templateId && loadingTemplate)) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    if (templateId && templateError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <p>Failed to load template</p>
                <Button variant="outline" onClick={onBack} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h2 className="text-2xl font-bold">
                        {templateId ? 'Edit Template' : 'Create Template'}
                    </h2>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-teal-600 hover:bg-teal-700"
                >
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                </Button>
            </div>

            {/* Template Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                <div className="space-y-2">
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                        id="name"
                        placeholder="e.g., Daily Routine"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Optional description..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={1}
                    />
                </div>
            </div>

            {/* Timeline Editor */}
            <TimelineEditor
                activities={formData.activities}
                availableActivities={availableActivities}
                onChange={(activities) => setFormData({ ...formData, activities })}
                emptyMessage="Add activities to create your schedule template"
            />
        </div>
    );
}
