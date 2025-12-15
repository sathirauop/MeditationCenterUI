'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useUpdateBook } from '@/lib/hooks/use-books';

// Validation schema
const editBookSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title must not exceed 255 characters'),
    author: z
        .string()
        .max(255, 'Author must not exceed 255 characters')
        .optional()
        .or(z.literal('')),
    description: z
        .string()
        .max(2000, 'Description must not exceed 2000 characters')
        .optional()
        .or(z.literal('')),
});

export default function EditBookDialog({ book, open, onOpenChange, onSuccess }) {
    const { toast } = useToast();

    const updateBookMutation = useUpdateBook();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(editBookSchema),
        defaultValues: {
            title: book?.title || '',
            author: book?.author || '',
            description: book?.description || '',
        },
    });

    const titleValue = watch('title');
    const authorValue = watch('author');
    const descriptionValue = watch('description');

    const onFormSubmit = async (data) => {
        // Only send changed fields
        const updates = {};
        if (data.title !== book.title) {
            updates.title = data.title.trim();
        }
        if ((data.author || '') !== (book.author || '')) {
            updates.author = data.author?.trim() || null;
        }
        if ((data.description || '') !== (book.description || '')) {
            updates.description = data.description?.trim() || null;
        }

        // Check if any field changed
        if (Object.keys(updates).length === 0) {
            toast({
                title: 'No changes',
                description: 'No changes were made to the book.',
            });
            return;
        }

        updateBookMutation.mutate(
            { bookId: book.book_id, updates },
            {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Book updated successfully!',
                    });
                    onOpenChange(false);
                    if (onSuccess) {
                        onSuccess();
                    }
                },
                onError: (error) => {
                    console.error('Error updating book:', error);
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: error.message || 'Failed to update book.',
                    });
                }
            }
        );
    };

    if (!book) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Book</DialogTitle>
                    <DialogDescription>
                        Update book metadata. Only changed fields will be saved.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                            id="edit-title"
                            {...register('title')}
                            placeholder="Book title"
                            disabled={updateBookMutation.isPending}
                            maxLength={255}
                        />
                        <div className="flex justify-between">
                            <div>
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title.message}</p>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {titleValue?.length || 0}/255
                            </span>
                        </div>
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-author">Author</Label>
                        <Input
                            id="edit-author"
                            {...register('author')}
                            placeholder="Book author"
                            disabled={updateBookMutation.isPending}
                            maxLength={255}
                        />
                        <div className="flex justify-between">
                            <div>
                                {errors.author && (
                                    <p className="text-sm text-destructive">{errors.author.message}</p>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {authorValue?.length || 0}/255
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            {...register('description')}
                            placeholder="Book description"
                            rows={4}
                            disabled={updateBookMutation.isPending}
                            maxLength={2000}
                        />
                        <div className="flex justify-between">
                            <div>
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description.message}</p>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {descriptionValue?.length || 0}/2000
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateBookMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateBookMutation.isPending}>
                            {updateBookMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {updateBookMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
