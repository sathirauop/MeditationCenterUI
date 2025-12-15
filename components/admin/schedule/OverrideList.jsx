'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import OverrideForm from './OverrideForm';
import { useOverrides, useDeleteOverride } from '@/lib/hooks/use-schedule';

export default function OverrideList() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedOverride, setSelectedOverride] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const { toast } = useToast();

    const { data, isLoading, refetch } = useOverrides();
    const overrides = data?.data || [];

    const deleteOverrideMutation = useDeleteOverride();

    const handleCreate = () => {
        setSelectedOverride(null);
        setIsFormOpen(true);
    };

    const handleEdit = (override) => {
        setSelectedOverride(override);
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        deleteOverrideMutation.mutate(deleteId, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Override deleted successfully",
                });
                setDeleteId(null);
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete override",
                });
                setDeleteId(null);
            }
        });
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        refetch();
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Override
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Activities</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {overrides.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No overrides found. Create one for special dates.
                                </TableCell>
                            </TableRow>
                        ) : (
                            overrides.map((override) => (
                                <TableRow key={override.override_id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                                        {new Date(override.override_date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell>{override.activity_count}</TableCell>
                                    <TableCell>
                                        {new Date(override.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(override)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteId(override.override_id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <OverrideForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                override={selectedOverride}
                onSuccess={handleFormSuccess}
            />

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the schedule override for this date.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
