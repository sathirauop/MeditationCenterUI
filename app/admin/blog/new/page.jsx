'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import BlogPostForm from '@/components/admin/blog/BlogPostForm';
import { useCreateBlogPost, useAdminBlogTags } from '@/lib/hooks/use-blog';
import { useToast } from '@/components/ui/use-toast';

export default function NewBlogPostPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [uploadProgress, setUploadProgress] = useState(0);

    const createPostMutation = useCreateBlogPost();
    const { data: tags = [] } = useAdminBlogTags();

    const handleSubmit = async (request, coverImage, galleryImages) => {
        try {
            await createPostMutation.mutateAsync({
                request,
                coverImage,
                galleryImages,
                onUploadProgress: setUploadProgress,
            });

            toast({
                title: 'Success',
                description: 'Blog post created successfully!',
            });

            // Navigate back to blog list
            router.push('/admin/blog');
        } catch (error) {
            console.error('Error creating post:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to create blog post',
            });
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <Link href="/admin/blog">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Blog
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <FileText className="h-10 w-10 text-teal-600" />
                        Create New Blog Post
                    </h1>
                    <p className="text-muted-foreground">
                        Write a new blog post. Posts are saved as drafts by default.
                    </p>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Post Details</CardTitle>
                        <CardDescription>
                            Fill in the details below. Use the language tabs to add Sinhala content.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BlogPostForm
                            onSubmit={handleSubmit}
                            isLoading={createPostMutation.isPending}
                            uploadProgress={uploadProgress}
                            availableTags={tags}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
