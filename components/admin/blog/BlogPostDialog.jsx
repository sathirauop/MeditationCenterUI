'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import BlogPostForm from './BlogPostForm';
import { useCreateBlogPost, useAdminBlogTags } from '@/lib/hooks/use-blog';
import { useToast } from '@/components/ui/use-toast';

export default function BlogPostDialog({ open, onOpenChange, onSuccess }) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const { toast } = useToast();

    const createPostMutation = useCreateBlogPost();
    const { data: tags = [] } = useAdminBlogTags();

    const handleSubmit = async (request, coverImage, galleryImages) => {
        try {
            await createPostMutation.mutateAsync({
                request,
                coverImage,
                galleryImages,
                onUploadProgress: setUploadProgress,
            });

            toast({
                title: 'Success',
                description: 'Blog post created successfully!',
            });

            setUploadProgress(0);
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error creating post:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to create blog post',
            });
            setUploadProgress(0);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Blog Post</DialogTitle>
                    <DialogDescription>
                        Create a new blog post. Posts are saved as drafts by default.
                    </DialogDescription>
                </DialogHeader>
                <BlogPostForm
                    onSubmit={handleSubmit}
                    isLoading={createPostMutation.isPending}
                    uploadProgress={uploadProgress}
                    availableTags={tags}
                />
            </DialogContent>
        </Dialog>
    );
}
