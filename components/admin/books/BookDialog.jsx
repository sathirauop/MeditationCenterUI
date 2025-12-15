'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import BookForm from './BookForm';
import { useCreateBook } from '@/lib/hooks/use-books';

export default function BookDialog({ open, onOpenChange, onSuccess }) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const { toast } = useToast();

    const createBookMutation = useCreateBook();

    const handleSubmit = async (bookData, pdfFile, coverImage) => {
        setUploadProgress(0);

        createBookMutation.mutate(
            {
                bookData,
                pdfFile,
                coverImage,
                onUploadProgress: (progress) => setUploadProgress(progress)
            },
            {
                onSuccess: (result) => {
                    toast({
                        title: 'Success',
                        description: `Book "${result.title}" uploaded successfully!`,
                    });
                    onOpenChange(false);
                    setUploadProgress(0);
                    if (onSuccess) {
                        onSuccess(result);
                    }
                },
                onError: (error) => {
                    console.error('Error creating book:', error);
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: error.message || 'Failed to upload book. Please try again.',
                    });
                }
            }
        );
    };

    const handleOpenChange = (newOpen) => {
        // Prevent closing while uploading
        if (createBookMutation.isPending && !newOpen) {
            return;
        }
        setUploadProgress(0);
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Upload New Book</DialogTitle>
                    <DialogDescription>
                        Upload a book PDF with optional cover image. The PDF will be available for all authenticated users to download.
                    </DialogDescription>
                </DialogHeader>
                <BookForm
                    onSubmit={handleSubmit}
                    isLoading={createBookMutation.isPending}
                    uploadProgress={uploadProgress}
                />
            </DialogContent>
        </Dialog>
    );
}

