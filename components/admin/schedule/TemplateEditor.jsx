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
import { getTemplate, createTemplate, updateTemplate, getActivities } from '@/lib/api/schedule';

export default function TemplateEditor({ templateId = null, onBack }) {
    const router = useRouter();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [availableActivities, setAvailableActivities] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        activities: [],
    });

    // Fetch available activities
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getActivities();
                setAvailableActivities(data.data || []);
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            }
        };
        fetchActivities();
    }, []);

    // Fetch template if editing
    useEffect(() => {
        if (templateId) {
            const fetchTemplate = async () => {
                try {
                    setLoading(true);
                    const data = await getTemplate(templateId);
                    setFormData({
                        name: data.name,
                        description: data.description || '',
                        activities: (data.activities || []).map((a, idx) => ({
                            id: a.template_activity_id || `existing-${idx}`,
                            activity_id: a.activity_id,
                            activity_title: a.activity_title,
                            start_time: a.start_time,
                            end_time: a.end_time,
                            notes: a.notes || '',
                        })),
                    });
                } catch (error) {
                    console.error('Failed to fetch template:', error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load template",
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchTemplate();
        }
    }, [templateId, toast]);

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

        try {
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

            if (templateId) {
                await updateTemplate(templateId, payload);
                toast({ title: "Success", description: "Template updated successfully" });
            } else {
                await createTemplate(payload);
                toast({ title: "Success", description: "Template created successfully" });
            }
            onBack?.();
        } catch (error) {
            console.error('Save error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to save template",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
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
