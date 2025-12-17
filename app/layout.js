import { AuthProvider } from '@/lib/auth-context';
import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Noto_Sans_Sinhala } from 'next/font/google';
import './globals.css';

// Primary font - Inter for English
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Sinhala font - Noto Sans Sinhala
const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  variable: '--font-sinhala',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'Isipathana International Meditation Center',
  description: 'Welcome to Isipathana International Meditation Center - Your journey to inner peace',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansSinhala.variable}`}>
      <body className="font-sans">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
