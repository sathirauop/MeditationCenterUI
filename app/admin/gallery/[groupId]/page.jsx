'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    ArrowLeft,
    Upload,
    Loader2,
    Trash2,
    ImageIcon,
    RefreshCw,
    X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
    useAdminGalleryGroup,
    useAddGalleryPhotos,
    useDeleteGalleryPhoto
} from '@/lib/hooks/use-gallery';

export default function GalleryGroupDetailPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.groupId;
    const fileInputRef = useRef(null);
    const { toast } = useToast();

    const [deletePhotoId, setDeletePhotoId] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const { data: group, isLoading, error, refetch } = useAdminGalleryGroup(groupId);
    const addPhotosMutation = useAddGalleryPhotos();
    const deletePhotoMutation = useDeleteGalleryPhoto();

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles(files);
        }
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) return;

        setUploadProgress(0);
        addPhotosMutation.mutate({
            groupId,
            files: selectedFiles,
            onUploadProgress: (percent) => setUploadProgress(percent)
        }, {
            onSuccess: () => {
                toast({ title: 'Success', description: `${selectedFiles.length} photos uploaded` });
                setSelectedFiles([]);
                setUploadProgress(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                refetch();
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Error', description: err.message });
                setUploadProgress(null);
            },
        });
    };

    const handleDeletePhoto = () => {
        if (!deletePhotoId) return;
        deletePhotoMutation.mutate({ groupId, photoId: deletePhotoId }, {
            onSuccess: () => {
                toast({ title: 'Success', description: 'Photo deleted' });
                setDeletePhotoId(null);
                refetch();
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Error', description: err.message });
                setDeletePhotoId(null);
            },
        });
    };

    const isPending = addPhotosMutation.isPending || deletePhotoMutation.isPending;

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                {/* Back Button + Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/gallery')}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Gallery
                    </Button>

                    {group && (
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
                                <div className="flex items-center gap-3">
                                    {group.name_si && (
                                        <span className="text-muted-foreground">{group.name_si}</span>
                                    )}
                                    <Badge
                                        variant={group.active ? 'default' : 'secondary'}
                                        className={group.active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-amber-100 text-amber-800'
                                        }
                                    >
                                        {group.active ? 'Active' : 'Hidden'}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {group.photos?.length || 0} photos
                                    </span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh
                            </Button>
                        </div>
                    )}
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                    </div>
                )}

                {/* Error */}
                {error && !isLoading && (
                    <div className="text-center py-8 text-destructive">
                        {error.message || 'Failed to load gallery group'}
                    </div>
                )}

                {/* Content */}
                {!isLoading && !error && group && (
                    <>
                        {/* Upload Section */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="h-5 w-5" />
                                    Upload Photos
                                </CardTitle>
                                <CardDescription>
                                    Select one or more photos to upload to this group
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="photo-upload"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isPending}
                                    >
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        Select Photos
                                    </Button>

                                    {selectedFiles.length > 0 && (
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="text-sm text-muted-foreground">
                                                {selectedFiles.length} file(s) selected
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedFiles([]);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={handleUpload}
                                                disabled={isPending}
                                            >
                                                {addPhotosMutation.isPending ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Upload className="mr-2 h-4 w-4" />
                                                )}
                                                Upload
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {uploadProgress !== null && (
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-teal-600 h-2 rounded-full transition-all"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Photos Grid */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Photos ({group.photos?.length || 0})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {(!group.photos || group.photos.length === 0) ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
                                        <p className="text-muted-foreground max-w-sm">
                                            Upload some photos to this group using the upload section above.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {group.photos.map((photo) => (
                                            <div
                                                key={photo.photo_id}
                                                className="relative group rounded-lg overflow-hidden border bg-muted aspect-square"
                                            >
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
                                                    <ImageIcon className="h-8 w-8 text-teal-400" />
                                                </div>
                                                {/* Overlay with actions */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => setDeletePhotoId(photo.photo_id)}
                                                        disabled={isPending}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                {/* Sort order badge */}
                                                <div className="absolute bottom-1 right-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        #{photo.sort_order}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Delete Photo Confirmation */}
                <AlertDialog open={!!deletePhotoId} onOpenChange={() => setDeletePhotoId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete this photo. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeletePhoto}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {deletePhotoMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
