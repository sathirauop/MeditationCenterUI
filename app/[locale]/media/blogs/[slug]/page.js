'use client';

import { use, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MarkdownRenderer from '@/components/blogs/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Calendar, User, Eye, Globe } from 'lucide-react';
import { usePublicBlogPost } from '@/lib/hooks/use-blog';

export default function BlogDetailPage({ params }) {
    const unwrappedParams = use(params);
    const slug = unwrappedParams.slug;
    const locale = useLocale();
    const lang = locale === 'si' ? 'si' : 'en';

    const [displayLang, setDisplayLang] = useState(lang);
    const { data: post, isLoading, error } = usePublicBlogPost(slug);

    // Get localized content
    const getContent = (field) => {
        if (!post) return '';
        const siField = `${field}_si`;
        if (displayLang === 'si' && post[siField]) {
            return post[siField];
        }
        return post[field] || '';
    };

    const title = getContent('title');
    const content = getContent('content');
    const excerpt = getContent('excerpt');

    const hasSinhalaContent = post?.title_si || post?.content_si;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(displayLang === 'si' ? 'si-LK' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50/50 to-white">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Back Button */}
                    <Link href={`/${locale}/media/blogs`}>
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {displayLang === 'si' ? 'ආපසු යන්න' : 'Back to Blog'}
                        </Button>
                    </Link>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="text-center py-20">
                            <span className="text-6xl mb-4 block">😢</span>
                            <h2 className="text-2xl font-bold mb-2">
                                {displayLang === 'si' ? 'ලිපිය හමු වුණේ නැත' : 'Post Not Found'}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {error.message || 'This article may have been removed or does not exist.'}
                            </p>
                            <Link href={`/${locale}/media/blogs`}>
                                <Button>
                                    {displayLang === 'si' ? 'බ්ලොග් එකට යන්න' : 'Go to Blog'}
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Post Content */}
                    {!isLoading && !error && post && (
                        <article>
                            {/* Language Toggle */}
                            {hasSinhalaContent && (
                                <div className="flex justify-end mb-4">
                                    <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
                                        <Button
                                            size="sm"
                                            variant={displayLang === 'en' ? 'default' : 'ghost'}
                                            onClick={() => setDisplayLang('en')}
                                        >
                                            <Globe className="mr-1 h-3 w-3" />
                                            English
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={displayLang === 'si' ? 'default' : 'ghost'}
                                            onClick={() => setDisplayLang('si')}
                                        >
                                            <Globe className="mr-1 h-3 w-3" />
                                            සිංහල
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Cover Image */}
                            {post.cover_image_url && (
                                <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.cover_image_url}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Tags */}
                            {post.tag_names?.length > 0 && (
                                <div className="flex gap-2 flex-wrap mb-4">
                                    {post.tag_names.map((tag, i) => (
                                        <Badge key={i} className="bg-teal-100 text-teal-700 hover:bg-teal-200">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {title}
                            </h1>

                            {/* Excerpt */}
                            {excerpt && (
                                <p className="text-xl text-gray-600 mb-6 border-l-4 border-teal-500 pl-4">
                                    {excerpt}
                                </p>
                            )}

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {post.author_name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(post.published_at)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {post.view_count} {displayLang === 'si' ? 'බැලීම්' : 'views'}
                                </span>
                            </div>

                            {/* Content */}
                            <MarkdownRenderer content={content} />

                            {/* Gallery */}
                            {post.gallery_image_urls?.length > 0 && (
                                <div className="mt-12 pt-8 border-t">
                                    <h3 className="text-xl font-semibold mb-4">
                                        {displayLang === 'si' ? 'පින්තූර ගැලරිය' : 'Photo Gallery'}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {post.gallery_image_urls.map((url, i) => (
                                            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={url}
                                                    alt={`Gallery ${i + 1}`}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                                    onClick={() => window.open(url, '_blank')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
