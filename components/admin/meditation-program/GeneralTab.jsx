'use client';

import { useState, useRef } from 'react';
import { useActiveProgram, useUpdateProgram, useCreateProgramWithImages } from '@/lib/hooks/use-programs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Upload, Image as ImageIcon, Plus, X, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function GeneralTab() {
    const { data: program, isLoading, error, isError } = useActiveProgram();
    const updateProgram = useUpdateProgram();
    const createProgram = useCreateProgramWithImages();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        name_si: '',
        description: '',
        description_si: '',
        maxSeats: 50,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const coverInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    // Initialize form when program data loads
    useState(() => {
        if (program) {
            setFormData({
                name: program.name || '',
                name_si: program.name_si || '',
                description: program.description || '',
                description_si: program.description_si || '',
                maxSeats: program.max_seats || 50,
            });
        }
    }, [program]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'maxSeats' ? parseInt(value) || 0 : value
        }));
        if (!isCreating) setIsEditing(true);
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            if (!isCreating) setIsEditing(true);
        }
    };

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryFiles(prev => [...prev, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setGalleryPreviews(prev => [...prev, e.target.result]);
                };
                reader.readAsDataURL(file);
            });
            if (!isCreating) setIsEditing(true);
        }
    };

    const removeGalleryImage = (index) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        if (!isCreating) setIsEditing(true);
    };

    const handleSave = async () => {
        if (!program) return;

        try {
            await updateProgram.mutateAsync({
                programId: program.meditation_program_id,
                data: formData
            });

            toast({
                title: "Success",
                description: "Program updated successfully",
            });
            setIsEditing(false);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to update program",
                variant: "destructive",
            });
        }
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            toast({
                title: "Validation Error",
                description: "Program name is required",
                variant: "destructive",
            });
            return;
        }

        try {
            await createProgram.mutateAsync({
                programData: {
                    name: formData.name,
                    name_si: formData.name_si || null,
                    description: formData.description,
                    description_si: formData.description_si || null,
                    maxSeats: formData.maxSeats,
                    isActive: true
                },
                coverImage: coverImageFile,
                galleryImages: galleryFiles
            });

            toast({
                title: "Success",
                description: "Program created successfully",
            });
            setIsCreating(false);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to create program",
                variant: "destructive",
            });
        }
    };

    const startCreateMode = () => {
        setIsCreating(true);
        setFormData({
            name: '',
            name_si: '',
            description: '',
            description_si: '',
            maxSeats: 50,
        });
        setCoverImageFile(null);
        setCoverImagePreview(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                <span className="ml-2 text-gray-600">Loading program...</span>
            </div>
        );
    }

    // If no program exists and not in create mode
    const noProgram = isError || !program;

    if (noProgram && !isCreating) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-teal-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">No Active Program</CardTitle>
                    <CardDescription className="text-gray-600">
                        No meditation program has been created yet. Create one to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button
                        onClick={startCreateMode}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Program
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Get existing images from program
    const existingCoverImage = program?.cover_image_url;
    const existingGalleryImages = program?.gallery_image_urls || [];

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isCreating ? 'Create New Program' : 'Program Details'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {isCreating
                            ? 'Fill in the details below to create a new meditation program'
                            : 'Manage your meditation program information'
                        }
                    </p>
                </div>
                {(isEditing || isCreating) && (
                    <div className="flex gap-2">
                        {isCreating && (
                            <Button
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                                disabled={createProgram.isPending}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            onClick={isCreating ? handleCreate : handleSave}
                            disabled={updateProgram.isPending || createProgram.isPending}
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                            {(updateProgram.isPending || createProgram.isPending) ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {isCreating ? 'Create Program' : 'Save Changes'}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            {/* Form Fields */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Program Name (English) */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Program Name (English)</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Vipassana Meditation Retreat"
                            className="max-w-xl"
                        />
                    </div>

                    {/* Program Name (Sinhala) */}
                    <div className="space-y-2">
                        <Label htmlFor="name_si">Program Name (Sinhala) <span className="text-muted-foreground text-xs">— සිංහල</span></Label>
                        <Input
                            id="name_si"
                            name="name_si"
                            value={formData.name_si}
                            onChange={handleInputChange}
                            placeholder="උදා: විපස්සනා භාවනා වීසියාව"
                            className="max-w-xl font-sinhala"
                        />
                    </div>

                    {/* Description (English) */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (English)</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your meditation program..."
                            rows={4}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Description (Sinhala) */}
                    <div className="space-y-2">
                        <Label htmlFor="description_si">Description (Sinhala) <span className="text-muted-foreground text-xs">— සිංහල</span></Label>
                        <Textarea
                            id="description_si"
                            name="description_si"
                            value={formData.description_si}
                            onChange={handleInputChange}
                            placeholder="ඔබගේ භාවනා වැඩසටහන පිළිබඳ විස්තර කරන්න..."
                            rows={4}
                            className="max-w-xl font-sinhala"
                        />
                    </div>

                    {/* Max Seats */}
                    <div className="space-y-2">
                        <Label htmlFor="maxSeats">Maximum Seats</Label>
                        <Input
                            id="maxSeats"
                            name="maxSeats"
                            type="number"
                            min="0"
                            value={formData.maxSeats}
                            onChange={handleInputChange}
                            className="max-w-xs"
                        />
                        <p className="text-sm text-gray-500">
                            Maximum number of participants allowed in this program
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Cover Image</CardTitle>
                    <CardDescription>
                        The main image displayed for this program
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Current or Preview Cover Image */}
                        {(coverImagePreview || existingCoverImage) && (
                            <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={coverImagePreview || existingCoverImage}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                                {coverImagePreview && (
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded">
                                            New
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Upload Button */}
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleCoverImageChange}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => coverInputRef.current?.click()}
                            disabled={!isCreating && !program}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {existingCoverImage || coverImagePreview ? 'Change Cover Image' : 'Upload Cover Image'}
                        </Button>
                        <p className="text-sm text-gray-500">
                            Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Gallery Images */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Gallery Images</CardTitle>
                    <CardDescription>
                        Additional images to showcase the program
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Existing Gallery Images */}
                        {existingGalleryImages.length > 0 && (
                            <div>
                                <Label className="text-sm text-gray-600 mb-2 block">Current Images</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {existingGalleryImages.map((url, index) => (
                                        <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={url}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Gallery Previews */}
                        {galleryPreviews.length > 0 && (
                            <div>
                                <Label className="text-sm text-gray-600 mb-2 block">New Images to Add</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={preview}
                                                alt={`New gallery ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded">
                                                    New
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            multiple
                            onChange={handleGalleryImagesChange}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={!isCreating && !program}
                        >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Add Gallery Images
                        </Button>
                        <p className="text-sm text-gray-500">
                            Supported formats: JPEG, PNG, GIF, WebP (max 5MB each)
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
