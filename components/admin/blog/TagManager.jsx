'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';
import {
    useAdminBlogTags,
    useCreateBlogTag,
    useUpdateBlogTag,
    useDeleteBlogTag
} from '@/lib/hooks/use-blog';
import { useToast } from '@/components/ui/use-toast';
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

export default function TagManager({ open, onOpenChange }) {
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [deleteTagId, setDeleteTagId] = useState(null);
    const [formData, setFormData] = useState({ name: '', nameSi: '', slug: '' });

    const { data: tags = [], isLoading } = useAdminBlogTags();
    const createMutation = useCreateBlogTag();
    const updateMutation = useUpdateBlogTag();
    const deleteMutation = useDeleteBlogTag();

    const resetForm = () => {
        setFormData({ name: '', nameSi: '', slug: '' });
        setIsCreateOpen(false);
        setEditingTag(null);
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Tag name is required' });
            return;
        }

        try {
            await createMutation.mutateAsync({
                name: formData.name.trim(),
                nameSi: formData.nameSi.trim() || null,
                slug: formData.slug.trim() || null,
            });
            toast({ title: 'Success', description: 'Tag created successfully' });
            resetForm();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    const handleUpdate = async () => {
        if (!formData.name.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Tag name is required' });
            return;
        }

        try {
            await updateMutation.mutateAsync({
                tagId: editingTag.tag_id,
                data: {
                    name: formData.name.trim(),
                    nameSi: formData.nameSi.trim() || null,
                    slug: formData.slug.trim() || null,
                },
            });
            toast({ title: 'Success', description: 'Tag updated successfully' });
            resetForm();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(deleteTagId);
            toast({ title: 'Success', description: 'Tag deleted successfully' });
            setDeleteTagId(null);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    const openEdit = (tag) => {
        setEditingTag(tag);
        setFormData({
            name: tag.name,
            nameSi: tag.name_si || '',
            slug: tag.slug,
        });
    };

    const isFormOpen = isCreateOpen || editingTag;
    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Manage Tags</DialogTitle>
                        <DialogDescription>
                            Create, edit, and delete blog tags.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Tags List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : tags.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No tags yet</p>
                        ) : (
                            tags.map(tag => (
                                <div
                                    key={tag.tag_id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{tag.name}</span>
                                            {tag.name_si && (
                                                <span className="text-muted-foreground">({tag.name_si})</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>/{tag.slug}</span>
                                            <Badge variant="secondary">{tag.post_count} posts</Badge>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEdit(tag)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteTagId(tag.tag_id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Create/Edit Form */}
                    {isFormOpen && (
                        <div className="border-t pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">
                                    {editingTag ? 'Edit Tag' : 'Create Tag'}
                                </h4>
                                <Button variant="ghost" size="icon" onClick={resetForm}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="tagName">Name (English) *</Label>
                                    <Input
                                        id="tagName"
                                        value={formData.name}
                                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                        placeholder="Meditation"
                                        maxLength={50}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tagNameSi">Name (Sinhala)</Label>
                                    <Input
                                        id="tagNameSi"
                                        value={formData.nameSi}
                                        onChange={e => setFormData(p => ({ ...p, nameSi: e.target.value }))}
                                        placeholder="භාවනාව"
                                        maxLength={50}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="tagSlug">Slug (optional)</Label>
                                <Input
                                    id="tagSlug"
                                    value={formData.slug}
                                    onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))}
                                    placeholder="auto-generated"
                                    maxLength={50}
                                />
                            </div>
                            <Button
                                onClick={editingTag ? handleUpdate : handleCreate}
                                disabled={isPending}
                                className="w-full"
                            >
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingTag ? 'Update Tag' : 'Create Tag'}
                            </Button>
                        </div>
                    )}

                    {/* Add Tag Button */}
                    {!isFormOpen && (
                        <DialogFooter>
                            <Button onClick={() => setIsCreateOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Tag
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTagId} onOpenChange={() => setDeleteTagId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this tag. Posts using this tag will no longer have it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
