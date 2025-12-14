'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    BookOpen,
    FileText,
    Loader2,
    Pencil,
    Power,
    PowerOff,
    Download,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import BookDialog from '@/components/admin/books/BookDialog';
import EditBookDialog from '@/components/admin/books/EditBookDialog';
import { getAdminBooks, toggleBookStatus } from '@/lib/api/books';

const ITEMS_PER_PAGE = 10;

export default function BooksManagementPage() {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [maxOffset, setMaxOffset] = useState(0);
    const [togglingBookId, setTogglingBookId] = useState(null);
    const { toast } = useToast();

    const fetchBooks = useCallback(async (offset = 0) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAdminBooks(ITEMS_PER_PAGE, offset);
            setBooks(response.data || []);
            setCurrentOffset(response.current_offset || 0);
            setMaxOffset(response.max_offset || 0);
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

    // Pagination
    const totalPages = Math.ceil(maxOffset / ITEMS_PER_PAGE);
    const currentPage = currentOffset + 1;

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

    const handleUploadClick = () => {
        setIsUploadDialogOpen(true);
    };

    const handleUploadSuccess = () => {
        fetchBooks(currentOffset);
    };

    const handleEditClick = (book) => {
        setEditingBook(book);
    };

    const handleEditSuccess = () => {
        fetchBooks(currentOffset);
    };

    const handleToggleStatus = async (book) => {
        setTogglingBookId(book.book_id);
        try {
            await toggleBookStatus(book.book_id, book.is_active);
            toast({
                title: 'Success',
                description: book.is_active ? 'Book deactivated' : 'Book activated',
            });
            fetchBooks(currentOffset);
        } catch (err) {
            console.error('Error toggling status:', err);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: err.message || 'Failed to update book status',
            });
        } finally {
            setTogglingBookId(null);
        }
    };

    const handleDownload = (pdfUrl) => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Books Management</h1>
                        <p className="text-muted-foreground">
                            Upload and manage meditation books and PDFs
                        </p>
                    </div>
                    <Button onClick={handleUploadClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Book
                    </Button>
                </div>

                {/* Books List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Books Library ({maxOffset})
                            </CardTitle>
                            <CardDescription>
                                Manage your meditation books and PDFs. Toggle visibility to show/hide books from the public.
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => fetchBooks(currentOffset)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Empty State */}
                        {!loading && !error && books.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No books uploaded yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Start by uploading your first book. All authenticated users will be able to view and download books for free.
                                </p>
                                <Button onClick={handleUploadClick}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Upload Your First Book
                                </Button>
                            </div>
                        )}

                        {/* Books Table */}
                        {!loading && !error && books.length > 0 && (
                            <>
                                <div className="space-y-4">
                                    {books.map((book) => (
                                        <div
                                            key={book.book_id}
                                            className={`border border-border rounded-lg p-4 transition-colors ${book.is_active
                                                ? 'hover:bg-muted/50'
                                                : 'bg-gray-50 opacity-75'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Cover Image */}
                                                {book.cover_image_url ? (
                                                    <div className="flex-shrink-0 w-16 h-20 rounded overflow-hidden">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={book.cover_image_url}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex-shrink-0 w-16 h-20 bg-teal-100 rounded flex items-center justify-center">
                                                        <FileText className="h-8 w-8 text-teal-600" />
                                                    </div>
                                                )}

                                                {/* Book Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="text-lg font-semibold">{book.title}</h3>
                                                                <Badge
                                                                    variant={book.is_active ? 'default' : 'secondary'}
                                                                    className={book.is_active
                                                                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                                        : 'bg-gray-200 text-gray-600'
                                                                    }
                                                                >
                                                                    {book.is_active ? 'Active' : 'Inactive'}
                                                                </Badge>
                                                            </div>
                                                            {book.author && (
                                                                <p className="text-sm text-muted-foreground mb-1">
                                                                    by {book.author}
                                                                </p>
                                                            )}
                                                            {book.description && (
                                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                                    {book.description}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                ID: {book.book_id}
                                                            </p>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            {/* Download */}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDownload(book.pdf_url)}
                                                                disabled={!book.pdf_url}
                                                                title="Download PDF"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>

                                                            {/* Edit */}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditClick(book)}
                                                                title="Edit book"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>

                                                            {/* Toggle Status */}
                                                            <Button
                                                                variant={book.is_active ? 'outline' : 'default'}
                                                                size="sm"
                                                                onClick={() => handleToggleStatus(book)}
                                                                disabled={togglingBookId === book.book_id}
                                                                className={book.is_active
                                                                    ? 'border-amber-500 text-amber-600 hover:bg-amber-50'
                                                                    : 'bg-green-600 hover:bg-green-700'
                                                                }
                                                                title={book.is_active ? 'Deactivate book' : 'Activate book'}
                                                            >
                                                                {togglingBookId === book.book_id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : book.is_active ? (
                                                                    <>
                                                                        <PowerOff className="h-4 w-4 mr-1" />
                                                                        Deactivate
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Power className="h-4 w-4 mr-1" />
                                                                        Activate
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
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

                {/* Upload Book Dialog */}
                <BookDialog
                    open={isUploadDialogOpen}
                    onOpenChange={setIsUploadDialogOpen}
                    onSuccess={handleUploadSuccess}
                />

                {/* Edit Book Dialog */}
                <EditBookDialog
                    book={editingBook}
                    open={!!editingBook}
                    onOpenChange={(open) => !open && setEditingBook(null)}
                    onSuccess={handleEditSuccess}
                />
            </div>
        </div>
    );
}
