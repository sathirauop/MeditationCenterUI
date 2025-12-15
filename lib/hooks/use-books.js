import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPublicBooks,
    getAdminBooks,
    createBook,
    updateBook,
    toggleBookStatus
} from '@/lib/api/books';

// Query Keys
export const booksKeys = {
    all: ['books'],
    public: () => [...booksKeys.all, 'public'],
    publicList: (limit, offset) => [...booksKeys.public(), { limit, offset }],
    admin: () => [...booksKeys.all, 'admin'],
    adminList: (limit, offset) => [...booksKeys.admin(), { limit, offset }],
};

// --- Public Books ---

export function usePublicBooks(limit = 20, offset = 0) {
    return useQuery({
        queryKey: booksKeys.publicList(limit, offset),
        queryFn: () => getPublicBooks(limit, offset),
    });
}

// --- Admin Books ---

export function useAdminBooks(limit = 20, offset = 0) {
    return useQuery({
        queryKey: booksKeys.adminList(limit, offset),
        queryFn: () => getAdminBooks(limit, offset),
    });
}

export function useCreateBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookData, pdfFile, coverImage, onUploadProgress }) =>
            createBook(bookData, pdfFile, coverImage, onUploadProgress),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: booksKeys.all });
        },
    });
}

export function useUpdateBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, updates }) => updateBook(bookId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: booksKeys.all });
        },
    });
}

export function useToggleBookStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, currentStatus }) => toggleBookStatus(bookId, currentStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: booksKeys.all });
        },
    });
}
