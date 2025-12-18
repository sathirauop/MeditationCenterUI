'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
    Loader2,
    Upload,
    X,
    Image as ImageIcon,
    Plus,
    Settings2
} from 'lucide-react';

// Dynamic import for Markdown editor (SSR issues)
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor'),
    { ssr: false, loading: () => <div className="h-[400px] bg-muted animate-pulse rounded-lg" /> }
);

// File size limits
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Validation schema
const blogPostSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(500, 'Title must not exceed 500 characters'),
    excerpt: z
        .string()
        .max(500, 'Excerpt must not exceed 500 characters')
        .optional()
        .or(z.literal('')),
    content: z
        .string()
        .min(10, 'Content must be at least 10 characters'),
    titleSi: z
        .string()
        .max(500, 'Sinhala title must not exceed 500 characters')
        .optional()
        .or(z.literal('')),
    excerptSi: z
        .string()
        .max(500, 'Sinhala excerpt must not exceed 500 characters')
        .optional()
        .or(z.literal('')),
    contentSi: z
        .string()
        .optional()
        .or(z.literal('')),
    slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
        .optional()
        .or(z.literal('')),
    metaTitle: z
        .string()
        .max(255, 'Meta title must not exceed 255 characters')
        .optional()
        .or(z.literal('')),
    metaDescription: z
        .string()
        .max(500, 'Meta description must not exceed 500 characters')
        .optional()
        .or(z.literal('')),
});

// Format file size for display
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export default function BlogPostForm({
    onSubmit,
    isLoading,
    uploadProgress = 0,
    availableTags = [],
    initialValues = null,
}) {
    const [activeLanguage, setActiveLanguage] = useState('en');
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [fileErrors, setFileErrors] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(blogPostSchema),
        defaultValues: initialValues || {
            title: '',
            excerpt: '',
            content: '',
            titleSi: '',
            excerptSi: '',
            contentSi: '',
            slug: '',
            metaTitle: '',
            metaDescription: '',
        },
    });

    const titleValue = watch('title');
    const titleSiValue = watch('titleSi');
    const contentSiValue = watch('contentSi');

    // Auto-generate slug from title
    const handleGenerateSlug = useCallback(() => {
        if (titleValue) {
            setValue('slug', generateSlug(titleValue));
        }
    }, [titleValue, setValue]);

    // Clean up image previews on unmount
    useEffect(() => {
        return () => {
            if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
            galleryPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [coverImagePreview, galleryPreviews]);

    // Validate image file
    const validateImage = (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return 'Invalid file type. Use JPG, PNG, or WebP.';
        }
        if (file.size > MAX_IMAGE_SIZE) {
            return `File too large. Maximum ${formatFileSize(MAX_IMAGE_SIZE)}.`;
        }
        return null;
    };

    // Handle cover image selection
    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        setFileErrors(prev => ({ ...prev, coverImage: null }));

        if (!file) {
            setCoverImage(null);
            setCoverImagePreview(null);
            return;
        }

        const error = validateImage(file);
        if (error) {
            setFileErrors(prev => ({ ...prev, coverImage: error }));
            e.target.value = '';
            return;
        }

        setCoverImage(file);
        setCoverImagePreview(URL.createObjectURL(file));
    };

    // Remove cover image
    const removeCoverImage = () => {
        setCoverImage(null);
        if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
        setCoverImagePreview(null);
        setFileErrors(prev => ({ ...prev, coverImage: null }));
        const input = document.getElementById('coverImage');
        if (input) input.value = '';
    };

    // Handle gallery images selection
    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        setFileErrors(prev => ({ ...prev, galleryImages: null }));

        const validFiles = [];
        const errors = [];

        files.forEach(file => {
            const error = validateImage(file);
            if (error) {
                errors.push(`${file.name}: ${error}`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length) {
            setFileErrors(prev => ({ ...prev, galleryImages: errors.join(', ') }));
        }

        if (validFiles.length) {
            setGalleryImages(prev => [...prev, ...validFiles]);
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }

        e.target.value = '';
    };

    // Remove gallery image
    const removeGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    // Toggle tag selection
    const toggleTag = (tagId) => {
        setSelectedTagIds(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    // Check if Sinhala content exists
    const hasSinhalaContent = useMemo(() => {
        return !!(titleSiValue || contentSiValue);
    }, [titleSiValue, contentSiValue]);

    // Form submission
    const onFormSubmit = async (data) => {
        const request = {
            title: data.title.trim(),
            excerpt: data.excerpt?.trim() || null,
            content: data.content,
            titleSi: data.titleSi?.trim() || null,
            excerptSi: data.excerptSi?.trim() || null,
            contentSi: data.contentSi || null,
            slug: data.slug?.trim() || null,
            metaTitle: data.metaTitle?.trim() || null,
            metaDescription: data.metaDescription?.trim() || null,
            tagIds: selectedTagIds.length > 0 ? selectedTagIds : null,
            status: 'DRAFT',
        };

        await onSubmit(request, coverImage, galleryImages);

        // Reset form on success
        reset();
        setCoverImage(null);
        setCoverImagePreview(null);
        setGalleryImages([]);
        setGalleryPreviews([]);
        setSelectedTagIds([]);
        setFileErrors({});
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Metadata */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Cover Image */}
                    <div className="space-y-2">
                        <Label>Cover Image</Label>
                        {coverImagePreview ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={coverImagePreview}
                                    alt="Cover preview"
                                    className="w-full h-full object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={removeCoverImage}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">Click to upload</span>
                                <input
                                    id="coverImage"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleCoverImageChange}
                                    disabled={isLoading}
                                    className="hidden"
                                />
                            </label>
                        )}
                        {fileErrors.coverImage && (
                            <p className="text-sm text-destructive">{fileErrors.coverImage}</p>
                        )}
                    </div>

                    {/* Gallery Images */}
                    <div className="space-y-2">
                        <Label>Gallery Images</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {galleryPreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={preview}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6"
                                        onClick={() => removeGalleryImage(index)}
                                        disabled={isLoading}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                <Plus className="h-6 w-6 text-muted-foreground" />
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleGalleryImagesChange}
                                    disabled={isLoading}
                                    multiple
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {fileErrors.galleryImages && (
                            <p className="text-sm text-destructive">{fileErrors.galleryImages}</p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map(tag => (
                                <Badge
                                    key={tag.tag_id}
                                    variant={selectedTagIds.includes(tag.tag_id) ? 'default' : 'outline'}
                                    className="cursor-pointer"
                                    onClick={() => !isLoading && toggleTag(tag.tag_id)}
                                >
                                    {tag.name}
                                    {selectedTagIds.includes(tag.tag_id) && (
                                        <X className="ml-1 h-3 w-3" />
                                    )}
                                </Badge>
                            ))}
                            {availableTags.length === 0 && (
                                <p className="text-sm text-muted-foreground">No tags available</p>
                            )}
                        </div>
                    </div>

                    {/* SEO Settings (Collapsible) */}
                    <Accordion type="single" collapsible>
                        <AccordionItem value="seo">
                            <AccordionTrigger className="text-sm">
                                <div className="flex items-center gap-2">
                                    <Settings2 className="h-4 w-4" />
                                    SEO Settings
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                {/* Slug */}
                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="slug"
                                            {...register('slug')}
                                            placeholder="auto-generated-from-title"
                                            disabled={isLoading}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleGenerateSlug}
                                            disabled={isLoading || !titleValue}
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                    {errors.slug && (
                                        <p className="text-sm text-destructive">{errors.slug.message}</p>
                                    )}
                                </div>

                                {/* Meta Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="metaTitle">Meta Title</Label>
                                    <Input
                                        id="metaTitle"
                                        {...register('metaTitle')}
                                        placeholder="SEO title for search engines"
                                        disabled={isLoading}
                                        maxLength={255}
                                    />
                                    {errors.metaTitle && (
                                        <p className="text-sm text-destructive">{errors.metaTitle.message}</p>
                                    )}
                                </div>

                                {/* Meta Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="metaDescription">Meta Description</Label>
                                    <Textarea
                                        id="metaDescription"
                                        {...register('metaDescription')}
                                        placeholder="SEO description for search engines"
                                        disabled={isLoading}
                                        rows={3}
                                        maxLength={500}
                                    />
                                    {errors.metaDescription && (
                                        <p className="text-sm text-destructive">{errors.metaDescription.message}</p>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Right Column - Content */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Language Tabs */}
                    <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
                        <TabsList>
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="si" className="flex items-center gap-1">
                                සිංහල
                                {hasSinhalaContent && (
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                )}
                            </TabsTrigger>
                        </TabsList>

                        {/* English Content */}
                        <TabsContent value="en" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    {...register('title')}
                                    placeholder="Enter blog post title"
                                    disabled={isLoading}
                                    maxLength={500}
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    {...register('excerpt')}
                                    placeholder="Brief summary of the post"
                                    disabled={isLoading}
                                    rows={2}
                                    maxLength={500}
                                />
                                {errors.excerpt && (
                                    <p className="text-sm text-destructive">{errors.excerpt.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Content * (Markdown)</Label>
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) => (
                                        <div data-color-mode="light">
                                            <MDEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                height={400}
                                                preview="edit"
                                            />
                                        </div>
                                    )}
                                />
                                {errors.content && (
                                    <p className="text-sm text-destructive">{errors.content.message}</p>
                                )}
                            </div>
                        </TabsContent>

                        {/* Sinhala Content */}
                        <TabsContent value="si" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="titleSi">මාතෘකාව (Title)</Label>
                                <Input
                                    id="titleSi"
                                    {...register('titleSi')}
                                    placeholder="බ්ලොග් සටහනේ මාතෘකාව ඇතුළත් කරන්න"
                                    disabled={isLoading}
                                    maxLength={500}
                                />
                                {errors.titleSi && (
                                    <p className="text-sm text-destructive">{errors.titleSi.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerptSi">සාරාංශය (Excerpt)</Label>
                                <Textarea
                                    id="excerptSi"
                                    {...register('excerptSi')}
                                    placeholder="සටහනේ කෙටි සාරාංශය"
                                    disabled={isLoading}
                                    rows={2}
                                    maxLength={500}
                                />
                                {errors.excerptSi && (
                                    <p className="text-sm text-destructive">{errors.excerptSi.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>අන්තර්ගතය (Content)</Label>
                                <Controller
                                    name="contentSi"
                                    control={control}
                                    render={({ field }) => (
                                        <div data-color-mode="light">
                                            <MDEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                height={400}
                                                preview="edit"
                                            />
                                        </div>
                                    )}
                                />
                                {errors.contentSi && (
                                    <p className="text-sm text-destructive">{errors.contentSi.message}</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
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

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Saving...' : 'Save as Draft'}
                </Button>
            </div>
        </form>
    );
}
