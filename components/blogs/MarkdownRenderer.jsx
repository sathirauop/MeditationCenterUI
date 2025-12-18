'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for react-markdown to avoid SSR issues
const ReactMarkdown = dynamic(
    () => import('react-markdown').then(mod => mod.default),
    {
        ssr: false,
        loading: () => <div className="animate-pulse bg-muted h-40 rounded-lg" />
    }
);

export default function MarkdownRenderer({ content, className = '' }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="animate-pulse bg-muted h-40 rounded-lg" />;
    }

    return (
        <div className={`prose prose-lg prose-teal max-w-none ${className}`}>
            <style jsx global>{`
                .prose h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: #0d9488;
                }
                .prose h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    color: #115e59;
                }
                .prose h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                }
                .prose p {
                    margin-bottom: 1rem;
                    line-height: 1.75;
                }
                .prose ul, .prose ol {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                .prose li {
                    margin-bottom: 0.25rem;
                }
                .prose blockquote {
                    border-left: 4px solid #0d9488;
                    padding-left: 1rem;
                    font-style: italic;
                    color: #6b7280;
                    margin: 1.5rem 0;
                }
                .prose code {
                    background: #f3f4f6;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                }
                .prose pre {
                    background: #1f2937;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                }
                .prose pre code {
                    background: transparent;
                    color: #e5e7eb;
                    padding: 0;
                }
                .prose a {
                    color: #0d9488;
                    text-decoration: underline;
                }
                .prose a:hover {
                    color: #115e59;
                }
                .prose img {
                    border-radius: 0.5rem;
                    margin: 1.5rem 0;
                }
                .prose hr {
                    border-color: #e5e7eb;
                    margin: 2rem 0;
                }
            `}</style>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
