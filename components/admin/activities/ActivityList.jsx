'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
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
import ActivityForm from './ActivityForm';
import { useActivities, useDeleteActivity } from '@/lib/hooks/use-schedule';

export default function ActivityList() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const { toast } = useToast();

    const { data, isLoading, refetch } = useActivities();
    const activities = data?.data || [];

    const deleteActivityMutation = useDeleteActivity();

    const handleCreate = () => {
        setSelectedActivity(null);
        setIsFormOpen(true);
    };

    const handleEdit = (activity) => {
        setSelectedActivity(activity);
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        deleteActivityMutation.mutate(deleteId, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Activity deleted successfully",
                });
                setDeleteId(null);
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete activity",
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
                    Create Activity
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Media URL</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No activities found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            activities.map((activity) => (
                                <TableRow key={activity.activity_id}>
                                    <TableCell className="font-medium">{activity.title}</TableCell>
                                    <TableCell className="max-w-xs truncate" title={activity.description}>
                                        {activity.description || '-'}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate" title={activity.media_url}>
                                        {activity.media_url || '-'}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(activity)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteId(activity.activity_id)}
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

            <ActivityForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                activity={selectedActivity}
                onSuccess={handleFormSuccess}
            />

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the activity.
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
