'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookCard from '@/components/books/BookCard';
import { Button } from '@/components/ui/button';
import { getPublicBooks } from '@/lib/api/books';
import {
    Loader2,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    AlertTriangle
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [maxOffset, setMaxOffset] = useState(0);
    const [urlsFetchedAt, setUrlsFetchedAt] = useState(null);

    const fetchBooks = useCallback(async (offset = 0) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPublicBooks(ITEMS_PER_PAGE, offset);
            setBooks(response.data || []);
            setCurrentOffset(response.current_offset || 0);
            setMaxOffset(response.max_offset || 0);
            setUrlsFetchedAt(new Date());
        } catch (err) {
            console.error('Error fetching books:', err);
            setError(err.message || 'Failed to load books');
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks(0);
    }, [fetchBooks]);

    // Calculate pagination
    const totalPages = Math.ceil(maxOffset / ITEMS_PER_PAGE);
    const currentPage = currentOffset + 1;

    // Check if URLs might be expired (10+ minutes since fetch)
    const minutesSinceFetch = urlsFetchedAt
        ? Math.floor((Date.now() - urlsFetchedAt.getTime()) / 1000 / 60)
        : 0;
    const showExpiryWarning = minutesSinceFetch >= 10;

    const handlePreviousPage = () => {
        if (currentOffset > 0) {
            fetchBooks(currentOffset - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            fetchBooks(currentOffset + 1);
        }
    };

    const handleRefresh = () => {
        fetchBooks(currentOffset);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-gradient-to-b from-primary/5 to-white pt-20">
                <div className="container mx-auto px-4 py-12">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <BookOpen className="h-10 w-10 text-primary" />
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                                Dhamma Books
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore our collection of meditation guides, Buddhist teachings, and spiritual wisdom.
                            All books are free to download.
                        </p>
                    </div>

                    {/* URL Expiry Warning */}
                    {showExpiryWarning && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-amber-800">
                                <AlertTriangle className="h-5 w-5" />
                                <span>Download links may have expired. Click refresh to get new links.</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleRefresh}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh
                            </Button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-20">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={() => fetchBooks(0)} variant="outline">
                                Try Again
                            </Button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && books.length === 0 && (
                        <div className="text-center py-20">
                            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No books available yet
                            </h3>
                            <p className="text-gray-500">
                                Please check back later for our collection of meditation books.
                            </p>
                        </div>
                    )}

                    {/* Books Grid - Adjusted for horizontal cards */}
                    {!loading && !error && books.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                                {books.map((book) => (
                                    <BookCard key={book.book_id} book={book} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-8">
                                    <Button
                                        variant="outline"
                                        onClick={handlePreviousPage}
                                        disabled={currentOffset === 0}
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        Previous
                                    </Button>

                                    <span className="text-gray-600 font-medium">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <Button
                                        variant="outline"
                                        onClick={handleNextPage}
                                        disabled={currentPage >= totalPages}
                                    >
                                        Next
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Refresh Button */}
                            <div className="text-center mt-6">
                                <Button variant="ghost" size="sm" onClick={handleRefresh}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Refresh Links
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
