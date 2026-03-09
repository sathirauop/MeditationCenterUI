'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    Plus,
    ImageIcon,
    Loader2,
    Trash2,
    Pencil,
    Eye,
    EyeOff,
    RefreshCw,
    FolderOpen
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
    useAdminGalleryGroups,
    useCreateGalleryGroup,
    useUpdateGalleryGroup,
    useDeleteGalleryGroup
} from '@/lib/hooks/use-gallery';
import { Label } from '@/components/ui/label';

export default function GalleryManagementPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editGroup, setEditGroup] = useState(null);
    const [deleteGroupId, setDeleteGroupId] = useState(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formNameSi, setFormNameSi] = useState('');
    const [formSortOrder, setFormSortOrder] = useState('0');

    const { toast } = useToast();

    const { data: groups, isLoading, error, refetch } = useAdminGalleryGroups();
    const createMutation = useCreateGalleryGroup();
    const updateMutation = useUpdateGalleryGroup();
    const deleteMutation = useDeleteGalleryGroup();

    const resetForm = () => {
        setFormName('');
        setFormNameSi('');
        setFormSortOrder('0');
    };

    const openCreateDialog = () => {
        resetForm();
        setIsCreateOpen(true);
    };

    const openEditDialog = (group) => {
        setFormName(group.name);
        setFormNameSi(group.name_si || '');
        setFormSortOrder(String(group.sort_order));
        setEditGroup(group);
    };

    const handleCreate = () => {
        createMutation.mutate({
            name: formName,
            nameSi: formNameSi || null,
            sortOrder: parseInt(formSortOrder) || 0
        }, {
            onSuccess: () => {
                toast({ title: 'Success', description: 'Gallery group created' });
                setIsCreateOpen(false);
                resetForm();
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Error', description: err.message });
            },
        });
    };

    const handleUpdate = () => {
        if (!editGroup) return;
        updateMutation.mutate({
            groupId: editGroup.group_id,
            data: {
                name: formName,
                nameSi: formNameSi || null,
                sortOrder: parseInt(formSortOrder) || 0
            }
        }, {
            onSuccess: () => {
                toast({ title: 'Success', description: 'Gallery group updated' });
                setEditGroup(null);
                resetForm();
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Error', description: err.message });
            },
        });
    };

    const handleToggleActive = (group) => {
        updateMutation.mutate({
            groupId: group.group_id,
            data: { active: !group.active }
        }, {
            onSuccess: () => {
                toast({ title: 'Success', description: `Group ${group.active ? 'hidden' : 'visible'} on public site` });
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Error', description: err.message });
            },
        });
    };

    const handleDelete = () => {
        if (!deleteGroupId) return;
        deleteMutation.mutate(deleteGroupId, {
            onSuccess: () => {
                toast({ title: 'Success', description: 'Gallery group deleted' });
                setDeleteGroupId(null);
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Error', description: err.message });
                setDeleteGroupId(null);
            },
        });
    };

    const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Gallery Management</h1>
                        <p className="text-muted-foreground">
                            Create and manage photo gallery groups
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Group
                    </Button>
                </div>

                {/* Groups List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Gallery Groups ({groups?.length || 0})
                            </CardTitle>
                            <CardDescription>
                                Click on a group to manage its photos. Groups marked as active appear on the public site.
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {/* Loading */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                            </div>
                        )}

                        {/* Error */}
                        {error && !isLoading && (
                            <div className="text-center py-8 text-destructive">
                                {error.message || 'Failed to load gallery groups'}
                            </div>
                        )}

                        {/* Empty */}
                        {!isLoading && !error && (!groups || groups.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No gallery groups yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Create your first gallery group to start organizing photos.
                                </p>
                                <Button onClick={openCreateDialog}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create First Group
                                </Button>
                            </div>
                        )}

                        {/* Groups */}
                        {!isLoading && !error && groups?.length > 0 && (
                            <div className="space-y-3">
                                {groups.map((group) => (
                                    <div
                                        key={group.group_id}
                                        className={`border rounded-lg p-4 transition-colors ${group.active
                                                ? 'hover:bg-muted/50 border-border'
                                                : 'bg-amber-50/50 border-amber-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <Link
                                                href={`/admin/gallery/${group.group_id}`}
                                                className="flex-1 min-w-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-100 text-teal-700">
                                                        <ImageIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold">{group.name}</h3>
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                            <span>{group.photo_count} photos</span>
                                                            <span>Order: {group.sort_order}</span>
                                                            {group.name_si && (
                                                                <Badge variant="outline" className="text-xs">SI</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Badge
                                                    variant={group.active ? 'default' : 'secondary'}
                                                    className={group.active
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                        : 'bg-amber-100 text-amber-800'
                                                    }
                                                >
                                                    {group.active ? 'Active' : 'Hidden'}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleActive(group)}
                                                    disabled={isPending}
                                                    title={group.active ? 'Hide from public' : 'Show on public site'}
                                                >
                                                    {group.active ? (
                                                        <EyeOff className="h-4 w-4 text-amber-600" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-green-600" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(group)}
                                                    disabled={isPending}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteGroupId(group.group_id)}
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Create / Edit Dialog */}
                <Dialog
                    open={isCreateOpen || !!editGroup}
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsCreateOpen(false);
                            setEditGroup(null);
                            resetForm();
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editGroup ? 'Edit Gallery Group' : 'Create Gallery Group'}
                            </DialogTitle>
                            <DialogDescription>
                                {editGroup
                                    ? 'Update the gallery group details.'
                                    : 'Create a new gallery group to organize photos.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Group Name *</Label>
                                <Input
                                    id="name"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g. Meditation Retreat 2026"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameSi">Group Name (Sinhala)</Label>
                                <Input
                                    id="nameSi"
                                    value={formNameSi}
                                    onChange={(e) => setFormNameSi(e.target.value)}
                                    placeholder="සිංහල නම"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sortOrder">Sort Order</Label>
                                <Input
                                    id="sortOrder"
                                    type="number"
                                    value={formSortOrder}
                                    onChange={(e) => setFormSortOrder(e.target.value)}
                                    placeholder="0"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lower numbers appear first
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => { setIsCreateOpen(false); setEditGroup(null); resetForm(); }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={editGroup ? handleUpdate : handleCreate}
                                disabled={!formName.trim() || isPending}
                            >
                                {(createMutation.isPending || updateMutation.isPending) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editGroup ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deleteGroupId} onOpenChange={() => setDeleteGroupId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Gallery Group?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the group and all its photos. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {deleteMutation.isPending && (
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
