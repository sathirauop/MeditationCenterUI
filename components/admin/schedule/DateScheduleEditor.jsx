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
    getOverrides,
    getOverride,
    createOverrideFromTemplate,
    updateOverride,
    deleteOverride,
    getActivities,
    getSchedulePreview
} from '@/lib/api/schedule';

export default function DateScheduleEditor({ date, onBack }) {
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [availableActivities, setAvailableActivities] = useState([]);
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

    // Fetch schedule for date
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch available activities
                const activitiesData = await getActivities();
                setAvailableActivities(activitiesData.data || []);

                // Fetch schedule preview for this date
                const preview = await getSchedulePreview(dateStr);

                if (preview.is_override && preview.override_id) {
                    // Date has an override
                    setOverrideId(preview.override_id);
                    setIsFromTemplate(false);
                    setActivities((preview.activities || []).map((a, idx) => ({
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
                    setActivities((preview.activities || []).map((a, idx) => ({
                        id: `template-${idx}`,
                        activity_id: a.activity_id,
                        activity_title: a.activity_title || a.title,
                        start_time: a.start_time,
                        end_time: a.end_time,
                        notes: a.notes || '',
                        is_cancelled: false,
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch schedule:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load schedule for this date",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateStr, toast]);

    const handleActivitiesChange = (newActivities) => {
        setActivities(newActivities);
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
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

            if (overrideId) {
                // Update existing override
                await updateOverride(overrideId, payload);
            } else {
                // Create new override
                const result = await createOverrideFromTemplate(payload);
                setOverrideId(result.override_id);
            }

            setIsFromTemplate(false);
            setHasChanges(false);
            toast({ title: "Success", description: "Schedule saved successfully" });
        } catch (error) {
            console.error('Save error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to save schedule",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleRevert = async () => {
        if (!overrideId) return;

        try {
            setSaving(true);
            await deleteOverride(overrideId);
            toast({ title: "Success", description: "Schedule reverted to default template" });
            setShowRevertDialog(false);
            onBack();
        } catch (error) {
            console.error('Revert error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to revert schedule",
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
