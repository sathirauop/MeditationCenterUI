'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, Loader2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import TimelineEditor from './TimelineEditor';
import {
    useActivities,
    useSchedulePreview,
    useUpdateOverride,
    useCreateOverride,
    useDeleteOverride
} from '@/lib/hooks/use-schedule';

export default function DateScheduleEditor({ date, onBack }) {
    const { toast } = useToast();

    const [saving, setSaving] = useState(false);
    const [activities, setActivities] = useState([]);
    const [overrideId, setOverrideId] = useState(null);
    const [isFromTemplate, setIsFromTemplate] = useState(true);
    const [showRevertDialog, setShowRevertDialog] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const dateStr = useMemo(() => {
        return date.toISOString().split('T')[0];
    }, [date]);

    const formattedDate = useMemo(() => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [date]);

    // React Query Hooks
    const { data: activitiesData, isLoading: loadingActivities } = useActivities();
    const { data: previewData, isLoading: loadingPreview, error: previewError } = useSchedulePreview(dateStr);

    const updateOverrideMutation = useUpdateOverride();
    const createOverrideMutation = useCreateOverride();
    const deleteOverrideMutation = useDeleteOverride();

    const availableActivities = activitiesData?.data || [];

    // Initialize state from preview data
    useEffect(() => {
        if (previewData) {
            if (previewData.is_override && previewData.override_id) {
                // Date has an override
                setOverrideId(previewData.override_id);
                setIsFromTemplate(false);
                setActivities((previewData.activities || []).map((a, idx) => ({
                    id: a.override_activity_id || `existing-${idx}`,
                    activity_id: a.activity_id,
                    activity_title: a.activity_title || a.title,
                    start_time: a.start_time,
                    end_time: a.end_time,
                    notes: a.notes || '',
                    is_cancelled: a.is_cancelled || false,
                })));
            } else {
                // Date uses template
                setOverrideId(null);
                setIsFromTemplate(true);
                setActivities((previewData.activities || []).map((a, idx) => ({
                    id: `template-${idx}`,
                    activity_id: a.activity_id,
                    activity_title: a.activity_title || a.title,
                    start_time: a.start_time,
                    end_time: a.end_time,
                    notes: a.notes || '',
                    is_cancelled: false,
                })));
            }
            setHasChanges(false);
        }
    }, [previewData]);

    const handleActivitiesChange = (newActivities) => {
        setActivities(newActivities);
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);

        const payload = {
            override_date: dateStr,
            activities: activities.map(a => ({
                activityId: a.activity_id,
                startTime: a.start_time,
                endTime: a.end_time,
                notes: a.notes,
                isCancelled: a.is_cancelled || false,
            })),
        };

        const onSuccess = () => {
            setSaving(false);
            setHasChanges(false);
            toast({ title: "Success", description: "Schedule saved successfully" });
        };

        const onError = (error) => {
            setSaving(false);
            console.error('Save error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to save schedule",
            });
        };

        if (overrideId) {
            // Update existing override
            updateOverrideMutation.mutate({ id: overrideId, data: payload }, { onSuccess, onError });
        } else {
            // Create new override
            // Use overrideDate to match API documentation
            const createPayload = {
                overrideDate: dateStr,
                activities: activities.map(a => ({
                    activityId: a.activity_id,
                    startTime: a.start_time,
                    endTime: a.end_time,
                    notes: a.notes,
                    isCancelled: a.is_cancelled || false,
                })),
            };

            createOverrideMutation.mutate(createPayload, {
                onSuccess: (data) => {
                    setOverrideId(data.override_id);
                    setIsFromTemplate(false);
                    onSuccess();
                },
                onError
            });
        }
    };

    const handleRevert = async () => {
        if (!overrideId) return;

        setSaving(true);
        deleteOverrideMutation.mutate(overrideId, {
            onSuccess: () => {
                setSaving(false);
                toast({ title: "Success", description: "Schedule reverted to default template" });
                setShowRevertDialog(false);
                onBack();
            },
            onError: (error) => {
                setSaving(false);
                console.error('Revert error:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to revert schedule",
                });
            }
        });
    };

    if (loadingActivities || loadingPreview) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    if (previewError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <AlertTriangle className="w-8 h-8 mb-2" />
                <p>Failed to load schedule for this date</p>
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
                        Back to Calendar
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold">{formattedDate}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            {isFromTemplate ? (
                                <Badge variant="outline" className="text-gray-600">
                                    Using Default Template
                                </Badge>
                            ) : (
                                <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 border-teal-200">
                                    Override Schedule
                                </Badge>
                            )}
                            {hasChanges && (
                                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                    Unsaved Changes
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isFromTemplate && (
                        <Button
                            variant="outline"
                            onClick={() => setShowRevertDialog(true)}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Revert to Template
                        </Button>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                        className="bg-teal-600 hover:bg-teal-700"
                    >
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Timeline Editor */}
            <TimelineEditor
                activities={activities}
                availableActivities={availableActivities}
                onChange={handleActivitiesChange}
                showCancelled={true}
                emptyMessage="No activities scheduled for this date. Add activities from the left panel."
            />

            {/* Revert Confirmation Dialog */}
            <AlertDialog open={showRevertDialog} onOpenChange={setShowRevertDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Revert to Default Template?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete all customizations for this date and restore the default template schedule.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRevert}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            Revert
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
