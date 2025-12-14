'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

// File size limits
const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Validation schema
const bookSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title must not exceed 255 characters'),
    author: z
        .string()
        .max(255, 'Author must not exceed 255 characters')
        .optional()
        .or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
});

// Format file size for display
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function BookForm({ onSubmit, isLoading, uploadProgress = 0 }) {
    const [pdfFile, setPdfFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [fileErrors, setFileErrors] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: '',
            author: '',
            description: '',
        },
    });

    const titleValue = watch('title');
    const authorValue = watch('author');

    // Cleanup cover image preview URL on unmount
    useEffect(() => {
        return () => {
            if (coverImagePreview) {
                URL.revokeObjectURL(coverImagePreview);
            }
        };
    }, [coverImagePreview]);

    const handlePdfChange = (e) => {
        const file = e.target.files?.[0];
        setFileErrors((prev) => ({ ...prev, pdfFile: null }));

        if (!file) {
            setPdfFile(null);
            return;
        }

        // Validate file size
        if (file.size > MAX_PDF_SIZE) {
            setFileErrors((prev) => ({
                ...prev,
                pdfFile: `PDF file size must not exceed ${formatFileSize(MAX_PDF_SIZE)}`,
            }));
            setPdfFile(null);
            e.target.value = '';
            return;
        }

        // Validate file type (basic check)
        if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
            setFileErrors((prev) => ({
                ...prev,
                pdfFile: 'Please select a valid PDF file',
            }));
            setPdfFile(null);
            e.target.value = '';
            return;
        }

        setPdfFile(file);
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        setFileErrors((prev) => ({ ...prev, coverImage: null }));

        if (!file) {
            setCoverImage(null);
            setCoverImagePreview(null);
            return;
        }

        // Validate file size
        if (file.size > MAX_IMAGE_SIZE) {
            setFileErrors((prev) => ({
                ...prev,
                coverImage: `Cover image size must not exceed ${formatFileSize(MAX_IMAGE_SIZE)}`,
            }));
            setCoverImage(null);
            setCoverImagePreview(null);
            e.target.value = '';
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setFileErrors((prev) => ({
                ...prev,
                coverImage: 'Please select a valid image file (JPEG, PNG, GIF, WebP)',
            }));
            setCoverImage(null);
            setCoverImagePreview(null);
            e.target.value = '';
            return;
        }

        setCoverImage(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setCoverImagePreview(previewUrl);
    };

    const removePdfFile = () => {
        setPdfFile(null);
        setFileErrors((prev) => ({ ...prev, pdfFile: null }));
        // Reset file input
        const input = document.getElementById('pdfFile');
        if (input) input.value = '';
    };

    const removeCoverImage = () => {
        setCoverImage(null);
        if (coverImagePreview) {
            URL.revokeObjectURL(coverImagePreview);
        }
        setCoverImagePreview(null);
        setFileErrors((prev) => ({ ...prev, coverImage: null }));
        // Reset file input
        const input = document.getElementById('coverImage');
        if (input) input.value = '';
    };

    const onFormSubmit = async (data) => {
        // Validate PDF is selected
        if (!pdfFile) {
            setFileErrors((prev) => ({
                ...prev,
                pdfFile: 'PDF file is required',
            }));
            return;
        }

        // Prepare book data
        const bookData = {
            title: data.title.trim(),
            author: data.author?.trim() || null,
            description: data.description?.trim() || null,
        };

        await onSubmit(bookData, pdfFile, coverImage);

        // Reset form on success (parent should close dialog)
        reset();
        setPdfFile(null);
        setCoverImage(null);
        setCoverImagePreview(null);
        setFileErrors({});
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    {...register('title')}
                    placeholder="e.g., The Art of Meditation"
                    disabled={isLoading}
                    maxLength={255}
                />
                <div className="flex justify-between">
                    <div>
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {titleValue?.length || 0}/255 characters
                    </span>
                </div>
            </div>

            {/* Author */}
            <div className="space-y-2">
                <Label htmlFor="author">Author (optional)</Label>
                <Input
                    id="author"
                    {...register('author')}
                    placeholder="e.g., Venerable Narada Thera"
                    disabled={isLoading}
                    maxLength={255}
                />
                <div className="flex justify-between">
                    <div>
                        {errors.author && (
                            <p className="text-sm text-destructive">{errors.author.message}</p>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {authorValue?.length || 0}/255 characters
                    </span>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Enter a brief description of the book..."
                    rows={4}
                    disabled={isLoading}
                />
                {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
            </div>

            {/* PDF File */}
            <div className="space-y-2">
                <Label htmlFor="pdfFile">PDF File *</Label>
                <div className="flex items-center gap-4">
                    <Input
                        id="pdfFile"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfChange}
                        disabled={isLoading || pdfFile !== null}
                        className="flex-1"
                    />
                </div>
                {pdfFile && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <FileText className="h-5 w-5 text-teal-600" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{pdfFile.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(pdfFile.size)}</p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={removePdfFile}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                {fileErrors.pdfFile && (
                    <p className="text-sm text-destructive">{fileErrors.pdfFile}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Maximum file size: {formatFileSize(MAX_PDF_SIZE)}
                </p>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image (optional)</Label>
                <Input
                    id="coverImage"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleCoverImageChange}
                    disabled={isLoading || coverImage !== null}
                />
                {coverImage && (
                    <div className="flex items-start gap-4 p-3 bg-muted rounded-lg">
                        <div className="relative w-20 h-28 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                            {coverImagePreview && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={coverImagePreview}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{coverImage.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(coverImage.size)}</p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={removeCoverImage}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                {fileErrors.coverImage && (
                    <p className="text-sm text-destructive">{fileErrors.coverImage}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Accepted formats: JPEG, PNG, GIF, WebP. Maximum size: {formatFileSize(MAX_IMAGE_SIZE)}
                </p>
            </div>

            {/* Upload Progress */}
            {isLoading && uploadProgress > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Uploading...</span>
                        <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-teal-600 transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Uploading...' : 'Upload Book'}
                </Button>
            </div>
        </form>
    );
}
