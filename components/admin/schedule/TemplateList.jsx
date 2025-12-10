'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import TemplateEditor from './TemplateEditor';
import { useTemplates, useDeleteTemplate, useActivateTemplate } from '@/lib/hooks/use-schedule';

export default function TemplateList() {
    const [view, setView] = useState('list'); // 'list' or 'editor'
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const { toast } = useToast();

    // React Query Hooks
    const { data: templatesData, isLoading: loading, error } = useTemplates();
    const deleteTemplateMutation = useDeleteTemplate();
    const activateTemplateMutation = useActivateTemplate();

    const templates = templatesData?.data || [];

    const handleCreate = () => {
        setEditingTemplateId(null);
        setView('editor');
    };

    const handleEdit = (template) => {
        setEditingTemplateId(template.template_id);
        setView('editor');
    };

    const handleBack = () => {
        setView('list');
        setEditingTemplateId(null);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        deleteTemplateMutation.mutate(deleteId, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Template deleted successfully",
                });
                setDeleteId(null);
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete template",
                });
            }
        });
    };

    const handleActivate = async (id) => {
        activateTemplateMutation.mutate(id, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Template activated successfully",
                });
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to activate template",
                });
            }
        });
    };

    // Show editor view
    if (view === 'editor') {
        return (
            <TemplateEditor
                templateId={editingTemplateId}
                onBack={handleBack}
            />
        );
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">
                Failed to load templates. Please try again later.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Template
                </Button>
            </div>

            {templates.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-500">
                    No templates found. Create one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div key={template.template_id} className="bg-white rounded-lg border shadow-sm p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{template.name}</h3>
                                {template.is_active ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shrink-0 ml-2">
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-gray-500 shrink-0 ml-2">
                                        Inactive
                                    </Badge>
                                )}
                            </div>

                            <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">
                                {template.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center text-gray-500 text-sm mb-6">
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                        />
                                    </svg>
                                    {template.activity_count} activities
                                </div>
                            </div>

                            <div className="pt-4 border-t flex items-center justify-end space-x-4 text-sm font-medium">
                                <button
                                    onClick={() => handleEdit(template)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    View/Edit
                                </button>
                                {!template.is_active && (
                                    <button
                                        onClick={() => handleActivate(template.template_id)}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        Activate
                                    </button>
                                )}
                                <button
                                    onClick={() => setDeleteId(template.template_id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the schedule template.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            {deleteTemplateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
