'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getTemplate } from '@/lib/api/schedule';
import { useActivities, useCreateTemplate, useUpdateTemplate } from '@/lib/hooks/use-schedule';

const activitySchema = z.object({
    activity_id: z.string().min(1, "Activity is required"),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    notes: z.string().optional(),
}).refine((data) => {
    return data.end_time > data.start_time;
}, {
    message: "End time must be after start time",
    path: ["end_time"],
});

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    activities: z.array(activitySchema).min(1, "At least one activity is required"),
});

export default function TemplateForm({ open, onOpenChange, template, onSuccess }) {
    const [loadingDetails, setLoadingDetails] = useState(false);
    const { toast } = useToast();

    const { data: activitiesData } = useActivities();
    const activitiesList = activitiesData?.data || [];

    const createTemplateMutation = useCreateTemplate();
    const updateTemplateMutation = useUpdateTemplate();

    const isSubmitting = createTemplateMutation.isPending || updateTemplateMutation.isPending;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            activities: [{ activity_id: '', start_time: '', end_time: '', notes: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "activities",
    });

    useEffect(() => {
        if (template && open) {
            const loadTemplateDetails = async () => {
                try {
                    setLoadingDetails(true);
                    // If template has activities loaded, use them, otherwise fetch
                    let templateData = template;
                    if (!template.activities) {
                        templateData = await getTemplate(template.template_id);
                    }

                    form.reset({
                        name: templateData.name,
                        description: templateData.description || '',
                        activities: templateData.activities?.map(a => ({
                            activity_id: a.activity_id.toString(),
                            start_time: a.start_time,
                            end_time: a.end_time,
                            notes: a.notes || ''
                        })) || []
                    });
                } catch (error) {
                    console.error('Failed to load template details:', error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load template details",
                    });
                } finally {
                    setLoadingDetails(false);
                }
            };
            loadTemplateDetails();
        } else if (open) {
            form.reset({
                name: '',
                description: '',
                activities: [{ activity_id: '', start_time: '', end_time: '', notes: '' }],
            });
        }
    }, [template, open, form, toast]);

    const onSubmit = async (values) => {
        // Convert activity_id back to number and use camelCase for API
        const payload = {
            name: values.name,
            description: values.description,
            activities: values.activities.map(a => ({
                activityId: parseInt(a.activity_id),
                startTime: a.start_time,
                endTime: a.end_time,
                notes: a.notes
            }))
        };

        const mutationOptions = {
            onSuccess: () => {
                toast({ title: "Success", description: template ? "Template updated successfully" : "Template created successfully" });
                onSuccess();
            },
            onError: (error) => {
                console.error('Submit error:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.response?.data?.message || "Failed to save template",
                });
            }
        };

        if (template) {
            updateTemplateMutation.mutate({ id: template.template_id, data: payload }, mutationOptions);
        } else {
            createTemplateMutation.mutate(payload, mutationOptions);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{template ? 'Edit Template' : 'Create Template'}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Regular Weekday" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Optional description..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Activities</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ activity_id: '', start_time: '', end_time: '', notes: '' })}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Activity
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-lg bg-gray-50">
                                    <div className="col-span-4">
                                        <FormField
                                            control={form.control}
                                            name={`activities.${index}.activity_id`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Activity</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                        <Input type="time" {...field} />
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
                                                        <Input type="time" {...field} />
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
                                                        <Input placeholder="Optional notes" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-1 pt-8">
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
                            <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Template
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
