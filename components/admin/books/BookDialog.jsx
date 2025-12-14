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
import { createBook } from '@/lib/api/books';

export default function BookDialog({ open, onOpenChange, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { toast } = useToast();

    const handleSubmit = async (bookData, pdfFile, coverImage) => {
        setIsLoading(true);
        setUploadProgress(0);

        try {
            const result = await createBook(bookData, pdfFile, coverImage, (progress) => {
                setUploadProgress(progress);
            });

            toast({
                title: 'Success',
                description: `Book "${result.title}" uploaded successfully!`,
            });

            onOpenChange(false);
            setUploadProgress(0);

            if (onSuccess) {
                onSuccess(result);
            }
        } catch (error) {
            console.error('Error creating book:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to upload book. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (newOpen) => {
        // Prevent closing while uploading
        if (isLoading && !newOpen) {
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
                    isLoading={isLoading}
                    uploadProgress={uploadProgress}
                />
            </DialogContent>
        </Dialog>
    );
}
