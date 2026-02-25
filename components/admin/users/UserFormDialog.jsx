'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useCreateAdminUser, useUpdateAdminUser } from '@/lib/hooks/use-admin-users';

// Validation schema — password required on create, optional on edit
const createSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(255),
    mobile_number: z
        .string()
        .regex(/^\+[1-9]\d{1,14}$/, 'Must be E.164 format, e.g. +94771234567')
        .optional()
        .or(z.literal('')),
    role: z.enum(['USER', 'ADMIN'], { required_error: 'Role is required' }),
    is_active: z.boolean().optional(),
    email_verified: z.boolean().optional(),
});

const editSchema = z.object({
    email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .optional()
        .or(z.literal('')),
    name: z.string().min(2, 'Name must be at least 2 characters').max(255).optional().or(z.literal('')),
    mobile_number: z
        .string()
        .regex(/^\+[1-9]\d{1,14}$/, 'Must be E.164 format, e.g. +94771234567')
        .optional()
        .or(z.literal('')),
});

export default function UserFormDialog({ user, open, onOpenChange, onSuccess }) {
    const isEditing = !!user;
    const { toast } = useToast();

    const createMutation = useCreateAdminUser();
    const updateMutation = useUpdateAdminUser();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(isEditing ? editSchema : createSchema),
        defaultValues: {
            email: user?.email || '',
            password: '',
            name: user?.name || '',
            mobile_number: user?.mobile_number || '',
            role: user?.role || 'USER',
            is_active: user?.is_active ?? true,
            email_verified: user?.email_verified ?? false,
        },
    });

    // Reset form when dialog opens / user changes
    useEffect(() => {
        if (open) {
            reset({
                email: user?.email || '',
                password: '',
                name: user?.name || '',
                mobile_number: user?.mobile_number || '',
                role: user?.role || 'USER',
                is_active: user?.is_active ?? true,
                email_verified: user?.email_verified ?? false,
            });
        }
    }, [open, user, reset]);

    const onFormSubmit = async (data) => {
        if (isEditing) {
            // Only send fields that changed
            const updates = {};
            if (data.email && data.email !== user.email) updates.email = data.email.trim();
            if (data.password) updates.password = data.password;
            if (data.name && data.name !== user.name) updates.name = data.name.trim();
            if (data.mobile_number !== (user.mobile_number || '')) {
                updates.mobile_number = data.mobile_number?.trim() || null;
            }

            if (Object.keys(updates).length === 0) {
                toast({ title: 'No changes', description: 'No fields were modified.' });
                return;
            }

            updateMutation.mutate(
                { userId: user.user_id, updates },
                {
                    onSuccess: () => {
                        toast({ title: 'Success', description: 'User updated successfully!' });
                        onOpenChange(false);
                        onSuccess?.();
                    },
                    onError: (error) => {
                        toast({
                            variant: 'destructive',
                            title: 'Error',
                            description: error.message || 'Failed to update user.',
                        });
                    },
                }
            );
        } else {
            // Create - clean up payload
            const payload = {
                email: data.email.trim(),
                password: data.password,
                name: data.name.trim(),
                role: data.role,
                is_active: data.is_active,
                email_verified: data.email_verified,
            };
            if (data.mobile_number) payload.mobile_number = data.mobile_number.trim();

            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast({ title: 'Success', description: 'User created successfully!' });
                    onOpenChange(false);
                    onSuccess?.();
                },
                onError: (error) => {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: error.message || 'Failed to create user.',
                    });
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update user details. Only changed fields will be saved.'
                            : 'Fill in the details to create a new user account.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="user-name">Name *</Label>
                        <Input
                            id="user-name"
                            {...register('name')}
                            placeholder="John Doe"
                            disabled={isPending}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="user-email">Email *</Label>
                        <Input
                            id="user-email"
                            type="email"
                            {...register('email')}
                            placeholder="user@example.com"
                            disabled={isPending}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="user-password">
                            Password {isEditing ? '(leave blank to keep current)' : '*'}
                        </Label>
                        <Input
                            id="user-password"
                            type="password"
                            {...register('password')}
                            placeholder={isEditing ? '••••••••' : 'Min 8 characters'}
                            disabled={isPending}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-2">
                        <Label htmlFor="user-mobile">Mobile Number</Label>
                        <Input
                            id="user-mobile"
                            {...register('mobile_number')}
                            placeholder="+94771234567"
                            disabled={isPending}
                        />
                        {errors.mobile_number && (
                            <p className="text-sm text-destructive">{errors.mobile_number.message}</p>
                        )}
                    </div>

                    {/* Role — only on create */}
                    {!isEditing && (
                        <div className="space-y-2">
                            <Label htmlFor="user-role">Role *</Label>
                            <select
                                id="user-role"
                                {...register('role')}
                                disabled={isPending}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            {errors.role && (
                                <p className="text-sm text-destructive">{errors.role.message}</p>
                            )}
                        </div>
                    )}

                    {/* Checkboxes — only on create */}
                    {!isEditing && (
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('is_active')}
                                    disabled={isPending}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                Active
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('email_verified')}
                                    disabled={isPending}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                Email Verified
                            </label>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending
                                ? isEditing ? 'Saving...' : 'Creating...'
                                : isEditing ? 'Save Changes' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
