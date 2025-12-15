'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';
import { useCreateActivity, useUpdateActivity } from '@/lib/hooks/use-schedule';

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    media_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export default function ActivityForm({ open, onOpenChange, activity, onSuccess }) {
    const { toast } = useToast();

    const createActivityMutation = useCreateActivity();
    const updateActivityMutation = useUpdateActivity();

    const isLoading = createActivityMutation.isPending || updateActivityMutation.isPending;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            media_url: '',
        },
    });

    useEffect(() => {
        if (activity && open) {
            form.reset({
                title: activity.title,
                description: activity.description || '',
                media_url: activity.media_url || '',
            });
        } else if (open) {
            form.reset({
                title: '',
                description: '',
                media_url: '',
            });
        }
    }, [activity, open, form]);

    const onSubmit = async (values) => {
        const mutationOptions = {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: activity ? "Activity updated successfully" : "Activity created successfully"
                });
                onSuccess();
            },
            onError: (error) => {
                console.error('Submit error:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.response?.data?.message || "Failed to save activity",
                });
            }
        };

        if (activity) {
            updateActivityMutation.mutate({ id: activity.activity_id, data: values }, mutationOptions);
        } else {
            createActivityMutation.mutate(values, mutationOptions);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{activity ? 'Edit Activity' : 'Create Activity'}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Morning Meditation" {...field} />
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

                        <FormField
                            control={form.control}
                            name="media_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Media URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/video.mp4" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Activity
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
