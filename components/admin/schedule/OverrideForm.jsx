'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Trash2, Copy, Ban, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useToast } from '@/components/ui/use-toast';
import {
    createOverride,
    updateOverride,
    getOverride,
    getActivities,
    getActiveTemplate
} from '@/lib/api/schedule';

const activitySchema = z.object({
    activity_id: z.string().min(1, "Activity is required"),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    notes: z.string().optional(),
    is_cancelled: z.boolean().default(false),
}).refine((data) => {
    return data.end_time > data.start_time;
}, {
    message: "End time must be after start time",
    path: ["end_time"],
});

const formSchema = z.object({
    override_date: z.string().min(1, "Date is required"),
    activities: z.array(activitySchema).min(1, "At least one activity is required"),
});

export default function OverrideForm({ open, onOpenChange, override, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [activitiesList, setActivitiesList] = useState([]);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            override_date: '',
            activities: [{ activity_id: '', start_time: '', end_time: '', notes: '', is_cancelled: false }],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "activities",
    });

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getActivities();
                setActivitiesList(data.data || []);
            } catch (error) {
                console.error('Failed to fetch activities:', error);
                // Mock data
                setActivitiesList([
                    { activity_id: 1, title: 'Morning Meditation' },
                    { activity_id: 2, title: 'Breakfast' },
                    { activity_id: 3, title: 'Dharma Talk' },
                    { activity_id: 4, title: 'Evening Chant' },
                ]);
            }
        };

        if (open) {
            fetchActivities();
        }
    }, [open]);

    useEffect(() => {
        if (override && open) {
            const loadOverrideDetails = async () => {
                try {
                    setLoading(true);
                    // If override has activities loaded, use them, otherwise fetch
                    let overrideData = override;
                    if (!override.activities) {
                        overrideData = await getOverride(override.override_id);
                    }

                    form.reset({
                        override_date: overrideData.override_date,
                        activities: overrideData.activities?.map(a => ({
                            activity_id: a.activity_id.toString(),
                            start_time: a.start_time,
                            end_time: a.end_time,
                            notes: a.notes || '',
                            is_cancelled: a.is_cancelled || false
                        })) || []
                    });
                } catch (error) {
                    console.error('Failed to load override details:', error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load override details",
                    });
                } finally {
                    setLoading(false);
                }
            };
            loadOverrideDetails();
        } else if (open) {
            form.reset({
                override_date: '',
                activities: [{ activity_id: '', start_time: '', end_time: '', notes: '', is_cancelled: false }],
            });
        }
    }, [override, open, form, toast]);

    const handleCopyFromTemplate = async () => {
        const date = form.getValues('override_date');
        if (!date) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a date first",
            });
            return;
        }

        try {
            setLoading(true);
            const templateData = await getActiveTemplate();

            if (templateData && templateData.activities) {
                // Populate form with template activities
                const newActivities = templateData.activities.map(a => ({
                    activity_id: a.activity_id.toString(),
                    start_time: a.start_time,
                    end_time: a.end_time,
                    notes: a.notes || '',
                    is_cancelled: false
                }));

                // Clear existing activities and append new ones
                form.setValue('activities', newActivities);

                toast({ title: "Success", description: "Activities copied from active template" });
            } else {
                toast({
                    variant: "destructive",
                    title: "Info",
                    description: "No active template or activities found",
                });
            }
        } catch (error) {
            console.error('Copy template error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to copy from template",
            });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                activities: values.activities.map(a => ({
                    ...a,
                    activity_id: parseInt(a.activity_id)
                }))
            };

            if (override) {
                await updateOverride(override.override_id, payload);
                toast({ title: "Success", description: "Override updated successfully" });
            } else {
                // Use camelCase keys for creation payload as per docs
                const createPayload = {
                    overrideDate: payload.override_date,
                    activities: payload.activities.map(a => ({
                        activityId: a.activity_id,
                        startTime: a.start_time,
                        endTime: a.end_time,
                        notes: a.notes,
                        isCancelled: a.is_cancelled
                    }))
                };
                await createOverride(createPayload);
                toast({ title: "Success", description: "Override created successfully" });
            }
            onSuccess();
        } catch (error) {
            console.error('Submit error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to save override",
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleCancellation = (index) => {
        const current = fields[index];
        update(index, { ...current, is_cancelled: !current.is_cancelled });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{override ? 'Edit Override' : 'Create Override'}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex gap-4 items-end">
                            <FormField
                                control={form.control}
                                name="override_date"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} disabled={!!override} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!override && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCopyFromTemplate}
                                    className="mb-2"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Active Template
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Activities</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ activity_id: '', start_time: '', end_time: '', notes: '', is_cancelled: false })}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Activity
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className={`grid grid-cols-12 gap-4 items-start p-4 border rounded-lg ${field.is_cancelled ? 'bg-red-50 border-red-200' : 'bg-gray-50'
                                        }`}
                                >
                                    <div className="col-span-3">
                                        <FormField
                                            control={form.control}
                                            name={`activities.${index}.activity_id`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Activity</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={field.is_cancelled}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select activity" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {activitiesList.map((activity) => (
                                                                <SelectItem key={activity.activity_id} value={activity.activity_id.toString()}>
                                                                    {activity.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`activities.${index}.start_time`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Start</FormLabel>
                                                    <FormControl>
                                                        <Input type="time" {...field} disabled={field.is_cancelled} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`activities.${index}.end_time`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">End</FormLabel>
                                                    <FormControl>
                                                        <Input type="time" {...field} disabled={field.is_cancelled} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <FormField
                                            control={form.control}
                                            name={`activities.${index}.notes`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Notes</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Optional notes" {...field} disabled={field.is_cancelled} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-2 pt-8 flex gap-1 justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleCancellation(index)}
                                            className={field.is_cancelled ? "text-green-600 hover:bg-green-50" : "text-orange-600 hover:bg-orange-50"}
                                            title={field.is_cancelled ? "Restore Activity" : "Cancel Activity"}
                                        >
                                            {field.is_cancelled ? <Undo2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => remove(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {form.formState.errors.activities && (
                                <p className="text-sm text-red-500">{form.formState.errors.activities.message}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Override
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
