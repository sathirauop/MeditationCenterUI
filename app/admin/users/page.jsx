'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Users,
    Loader2,
    Pencil,
    Eye,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Search,
    Shield,
    UserX,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAdminUsers } from '@/lib/hooks/use-admin-users';
import UserFormDialog from '@/components/admin/users/UserFormDialog';
import UserDetailDialog from '@/components/admin/users/UserDetailDialog';

const ITEMS_PER_PAGE = 20;

export default function UsersManagementPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUserId, setViewingUserId] = useState(null);
    const [currentOffset, setCurrentOffset] = useState(0);

    // Filters
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState('');

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
            setCurrentOffset(0); // reset pagination on new search
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Build filters object
    const filters = {
        limit: ITEMS_PER_PAGE,
        offset: currentOffset,
    };
    if (searchQuery) filters.search = searchQuery;
    if (roleFilter) filters.role = roleFilter;
    if (activeFilter !== '') filters.isActive = activeFilter;

    const { data, isLoading, error, refetch } = useAdminUsers(filters);
    const users = data?.data || [];
    const total = data?.total || 0;
    const maxOffset = data?.max_offset || 0;

    // Pagination
    const totalPages = maxOffset > 0 ? Math.floor(maxOffset / ITEMS_PER_PAGE) + 1 : (total > 0 ? 1 : 0);
    const currentPage = Math.floor(currentOffset / ITEMS_PER_PAGE) + 1;

    const handlePreviousPage = () => {
        if (currentOffset >= ITEMS_PER_PAGE) {
            setCurrentOffset(currentOffset - ITEMS_PER_PAGE);
        }
    };

    const handleNextPage = () => {
        if (currentOffset + ITEMS_PER_PAGE <= maxOffset) {
            setCurrentOffset(currentOffset + ITEMS_PER_PAGE);
        }
    };

    const handleSuccess = useCallback(() => {
        refetch();
    }, [refetch]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Users Management</h1>
                        <p className="text-muted-foreground">
                            Manage user accounts, roles, and access
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Role Filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setCurrentOffset(0);
                                }}
                                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-[140px]"
                            >
                                <option value="">All Roles</option>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>

                            {/* Active Filter */}
                            <select
                                value={activeFilter}
                                onChange={(e) => {
                                    setActiveFilter(e.target.value);
                                    setCurrentOffset(0);
                                }}
                                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-[140px]"
                            >
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Users ({total})
                            </CardTitle>
                            <CardDescription>
                                View and manage all registered user accounts.
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error.message || 'Failed to load users'}</AlertDescription>
                            </Alert>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && users.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <UserX className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    {searchQuery || roleFilter || activeFilter
                                        ? 'No users match your filters'
                                        : 'No users found'}
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    {searchQuery || roleFilter || activeFilter
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Create your first user to get started.'}
                                </p>
                                {!searchQuery && !roleFilter && !activeFilter && (
                                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create First User
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Users Table */}
                        {!isLoading && !error && users.length > 0 && (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="pb-3 font-semibold text-muted-foreground">User</th>
                                                <th className="pb-3 font-semibold text-muted-foreground">Role</th>
                                                <th className="pb-3 font-semibold text-muted-foreground">Status</th>
                                                <th className="pb-3 font-semibold text-muted-foreground">Joined</th>
                                                <th className="pb-3 font-semibold text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {users.map((user) => (
                                                <tr key={user.user_id} className="hover:bg-muted/50 transition-colors">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                                                                <span className="text-sm font-bold text-teal-700">
                                                                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                                </span>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-medium truncate">{user.name}</p>
                                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <Badge
                                                            variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                                                            className={user.role === 'ADMIN'
                                                                ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                                                                : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                                            }
                                                        >
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4">
                                                        <Badge
                                                            variant={user.is_active ? 'default' : 'secondary'}
                                                            className={user.is_active
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                                : 'bg-gray-200 text-gray-600'
                                                            }
                                                        >
                                                            {user.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 text-muted-foreground">
                                                        {formatDate(user.created_at)}
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setViewingUserId(user.user_id)}
                                                                title="View details"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setEditingUser(user)}
                                                                title="Edit user"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden space-y-3">
                                    {users.map((user) => (
                                        <div
                                            key={user.user_id}
                                            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                                                        <span className="text-sm font-bold text-teal-700">
                                                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setViewingUserId(user.user_id)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setEditingUser(user)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <Badge
                                                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                                                    className={user.role === 'ADMIN'
                                                        ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                                    }
                                                >
                                                    <Shield className="h-3 w-3 mr-1" />
                                                    {user.role}
                                                </Badge>
                                                <Badge
                                                    variant={user.is_active ? 'default' : 'secondary'}
                                                    className={user.is_active
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                        : 'bg-gray-200 text-gray-600'
                                                    }
                                                >
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground ml-auto">
                                                    {formatDate(user.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePreviousPage}
                                            disabled={currentOffset === 0}
                                        >
                                            <ChevronLeft className="mr-1 h-4 w-4" />
                                            Previous
                                        </Button>

                                        <span className="text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages}
                                        </span>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleNextPage}
                                            disabled={currentOffset + ITEMS_PER_PAGE > maxOffset}
                                        >
                                            Next
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Create User Dialog */}
                <UserFormDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    onSuccess={handleSuccess}
                />

                {/* Edit User Dialog */}
                <UserFormDialog
                    user={editingUser}
                    open={!!editingUser}
                    onOpenChange={(open) => !open && setEditingUser(null)}
                    onSuccess={handleSuccess}
                />

                {/* View User Detail Dialog */}
                <UserDetailDialog
                    userId={viewingUserId}
                    open={!!viewingUserId}
                    onOpenChange={(open) => !open && setViewingUserId(null)}
                />
            </div>
        </div>
    );
}
