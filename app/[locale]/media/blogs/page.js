'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlogCard from '@/components/blogs/BlogCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { usePublicBlogPosts, usePublicBlogTags } from '@/lib/hooks/use-blog';

const ITEMS_PER_PAGE = 9;

export default function BlogsPage() {
    const locale = useLocale();
    const lang = locale === 'si' ? 'si' : 'en';

    const [currentOffset, setCurrentOffset] = useState(0);
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [sortBy, setSortBy] = useState('NEWEST');

    // Build query params
    const queryParams = {
        limit: ITEMS_PER_PAGE,
        offset: currentOffset,
        sortBy,
        ...(selectedTagIds.length > 0 && { tagIds: selectedTagIds }),
        ...(searchQuery && { search: searchQuery }),
    };

    const { data, isLoading, error } = usePublicBlogPosts(queryParams);
    const { data: tags = [] } = usePublicBlogTags();

    const posts = data?.data || [];
    const maxOffset = data?.maxOffset || 0;
    const totalPages = Math.ceil(maxOffset / ITEMS_PER_PAGE);
    const currentPage = currentOffset + 1;

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setCurrentOffset(0);
    };

    const toggleTag = (tagId) => {
        setSelectedTagIds(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
        setCurrentOffset(0);
    };

    const clearFilters = () => {
        setSelectedTagIds([]);
        setSearchQuery('');
        setSearchInput('');
        setSortBy('NEWEST');
        setCurrentOffset(0);
    };

    const hasFilters = selectedTagIds.length > 0 || searchQuery || sortBy !== 'NEWEST';

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50/50 to-white">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {lang === 'si' ? 'බ්ලොග් ලිපි' : 'Blog'}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {lang === 'si'
                                ? 'ධ්‍යාන මධ්‍යස්ථානයෙන් තීක්ෂ්ණ බුද්ධිය සහ ඉගෙනීම්'
                                : 'Insights and teachings from our meditation center'}
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={lang === 'si' ? 'ලිපි සොයන්න...' : 'Search articles...'}
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </form>

                            {/* Sort */}
                            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setCurrentOffset(0); }}>
                                <SelectTrigger className="w-full lg:w-44">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NEWEST">{lang === 'si' ? 'අලුත්ම' : 'Newest'}</SelectItem>
                                    <SelectItem value="OLDEST">{lang === 'si' ? 'පරණම' : 'Oldest'}</SelectItem>
                                    <SelectItem value="MOST_VIEWED">{lang === 'si' ? 'වැඩිම බැලීම්' : 'Most Viewed'}</SelectItem>
                                </SelectContent>
                            </Select>

                            {hasFilters && (
                                <Button variant="ghost" onClick={clearFilters} className="shrink-0">
                                    <X className="h-4 w-4 mr-1" />
                                    {lang === 'si' ? 'ඉවත් කරන්න' : 'Clear'}
                                </Button>
                            )}
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t">
                                {tags.map(tag => (
                                    <Badge
                                        key={tag.tag_id}
                                        variant={selectedTagIds.includes(tag.tag_id) ? 'default' : 'outline'}
                                        className="cursor-pointer"
                                        onClick={() => toggleTag(tag.tag_id)}
                                    >
                                        {lang === 'si' && tag.name_si ? tag.name_si : tag.name}
                                        <span className="ml-1 text-xs opacity-70">({tag.post_count})</span>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="text-center py-20">
                            <p className="text-red-600 mb-4">{error.message || 'Failed to load posts'}</p>
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                {lang === 'si' ? 'නැවත උත්සාහ කරන්න' : 'Try Again'}
                            </Button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && posts.length === 0 && (
                        <div className="text-center py-20">
                            <span className="text-6xl mb-4 block">📝</span>
                            <h3 className="text-xl font-semibold mb-2">
                                {lang === 'si' ? 'ලිපි හමුවී නැත' : 'No posts found'}
                            </h3>
                            <p className="text-gray-600">
                                {hasFilters
                                    ? (lang === 'si' ? 'වෙනත් පෙරහන් උත්සාහ කරන්න' : 'Try different filters')
                                    : (lang === 'si' ? 'ඉක්මනින් නව ලිපි පැමිණේ' : 'New posts coming soon')}
                            </p>
                        </div>
                    )}

                    {/* Posts Grid */}
                    {!isLoading && !error && posts.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.map(post => (
                                    <BlogCard key={post.post_id} post={post} lang={lang} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-12">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentOffset(currentOffset - 1)}
                                        disabled={currentOffset === 0}
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        {lang === 'si' ? 'පෙර' : 'Previous'}
                                    </Button>
                                    <span className="text-sm text-gray-600">
                                        {lang === 'si'
                                            ? `පිටු ${currentPage} / ${totalPages}`
                                            : `Page ${currentPage} of ${totalPages}`}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentOffset(currentOffset + 1)}
                                        disabled={currentPage >= totalPages}
                                    >
                                        {lang === 'si' ? 'ඊළඟ' : 'Next'}
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
