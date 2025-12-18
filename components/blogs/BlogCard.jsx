'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Eye } from 'lucide-react';

export default function BlogCard({ post, lang = 'en' }) {
    const locale = useLocale();

    // Get localized content
    const title = (lang === 'si' && post.title_si) ? post.title_si : post.title;
    const excerpt = (lang === 'si' && post.excerpt_si) ? post.excerpt_si : post.excerpt;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(lang === 'si' ? 'si-LK' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Link
            href={`/${locale}/media/blogs/${post.slug}`}
            className="group block"
        >
            <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                {/* Cover Image */}
                <div className="relative aspect-video bg-gradient-to-br from-teal-100 to-amber-50 overflow-hidden">
                    {post.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={post.cover_image_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl text-teal-300">📝</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    {/* Tags */}
                    {post.tag_names?.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-3">
                            {post.tag_names.slice(0, 3).map((tag, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs bg-teal-50 text-teal-700 hover:bg-teal-100"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {post.tag_names.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{post.tag_names.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {title}
                    </h2>

                    {/* Excerpt */}
                    {excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                            {excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author_name}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                            <Eye className="h-3 w-3" />
                            {post.view_count}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
