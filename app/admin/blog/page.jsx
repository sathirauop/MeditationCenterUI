'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    FileText,
    Loader2,
    Eye,
    EyeOff,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Tags,
    Search,
    Calendar,
    User
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';
import TagManager from '@/components/admin/blog/TagManager';
import {
    useAdminBlogPosts,
    usePublishBlogPost,
    useUnpublishBlogPost,
    useDeleteBlogPost
} from '@/lib/hooks/use-blog';

const ITEMS_PER_PAGE = 10;

export default function BlogManagementPage() {
    const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [deletePostId, setDeletePostId] = useState(null);
    const { toast } = useToast();

    // Build query params
    const queryParams = {
        limit: ITEMS_PER_PAGE,
        offset: currentOffset,
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
    };

    const { data, isLoading, error, refetch } = useAdminBlogPosts(queryParams);
    const posts = data?.data || [];
    const maxOffset = data?.maxOffset || 0;

    const publishMutation = usePublishBlogPost();
    const unpublishMutation = useUnpublishBlogPost();
    const deleteMutation = useDeleteBlogPost();

    // Pagination
    const totalPages = Math.ceil(maxOffset / ITEMS_PER_PAGE);
    const currentPage = currentOffset + 1;

    const handlePreviousPage = () => {
        if (currentOffset > 0) {
            setCurrentOffset(currentOffset - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentOffset(currentOffset + 1);
        }
    };

    const handlePublish = async (postId) => {
        publishMutation.mutate(postId, {
            onSuccess: () => {
                toast({ title: 'Success', description: 'Post published successfully' });
                refetch();
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Error', description: err.message });
            },
        });
    };

    const handleUnpublish = async (postId) => {
        unpublishMutation.mutate(postId, {
            onSuccess: () => {
                toast({ title: 'Success', description: 'Post unpublished (reverted to draft)' });
                refetch();
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Error', description: err.message });
            },
        });
    };

    const handleDelete = async () => {
        if (!deletePostId) return;
        deleteMutation.mutate(deletePostId, {
            onSuccess: () => {
                toast({ title: 'Success', description: 'Post deleted successfully' });
                setDeletePostId(null);
                refetch();
            },
            onError: (err) => {
                toast({ variant: 'destructive', title: 'Error', description: err.message });
                setDeletePostId(null);
            },
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentOffset(0);
        refetch();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const isPending = publishMutation.isPending || unpublishMutation.isPending || deleteMutation.isPending;

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
                        <p className="text-muted-foreground">
                            Create and manage blog posts for the meditation center
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsTagManagerOpen(true)}>
                            <Tags className="mr-2 h-4 w-4" />
                            Manage Tags
                        </Button>
                        <Link href="/admin/blog/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Post
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="py-4">
                        <form onSubmit={handleSearch} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search posts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentOffset(0); }}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" variant="secondary">
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Posts List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Blog Posts ({maxOffset})
                            </CardTitle>
                            <CardDescription>
                                Manage your blog posts. Posts must be published to appear on the public site.
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
                                <AlertDescription>{error.message || 'Failed to load posts'}</AlertDescription>
                            </Alert>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && posts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Create your first blog post to share insights and teachings with your community.
                                </p>
                                <Link href="/admin/blog/new">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Post
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Posts Table */}
                        {!isLoading && !error && posts.length > 0 && (
                            <>
                                <div className="space-y-4">
                                    {posts.map((post) => (
                                        <div
                                            key={post.post_id}
                                            className={`border border-border rounded-lg p-4 transition-colors ${post.status === 'PUBLISHED'
                                                ? 'hover:bg-muted/50'
                                                : 'bg-amber-50/50 border-amber-200'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h3 className="text-lg font-semibold">{post.title}</h3>
                                                        <Badge
                                                            variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}
                                                            className={
                                                                post.status === 'PUBLISHED'
                                                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                                    : 'bg-amber-100 text-amber-800'
                                                            }
                                                        >
                                                            {post.status}
                                                        </Badge>
                                                        {post.title_si && (
                                                            <Badge variant="outline">SI</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                        <span className="flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            {post.author_name}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {post.status === 'PUBLISHED'
                                                                ? formatDate(post.published_at)
                                                                : `Created ${formatDate(post.created_at)}`}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3" />
                                                            {post.view_count} views
                                                        </span>
                                                    </div>
                                                    {post.tag_names?.length > 0 && (
                                                        <div className="flex gap-1 flex-wrap">
                                                            {post.tag_names.map((tag, i) => (
                                                                <Badge key={i} variant="outline" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {post.status === 'DRAFT' ? (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handlePublish(post.post_id)}
                                                            disabled={isPending}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            {publishMutation.isPending ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    Publish
                                                                </>
                                                            )}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleUnpublish(post.post_id)}
                                                            disabled={isPending}
                                                            className="border-amber-500 text-amber-600 hover:bg-amber-50"
                                                        >
                                                            {unpublishMutation.isPending ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <EyeOff className="h-4 w-4 mr-1" />
                                                                    Unpublish
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeletePostId(post.post_id)}
                                                        disabled={isPending}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
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
                                            disabled={currentPage >= totalPages}
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



                {/* Tag Manager Dialog */}
                <TagManager
                    open={isTagManagerOpen}
                    onOpenChange={setIsTagManagerOpen}
                />

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The post will be permanently removed.
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
