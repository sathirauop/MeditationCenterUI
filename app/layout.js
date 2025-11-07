import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata = {
  title: 'Isipathana International Meditation Center',
  description: 'Welcome to Isipathana International Meditation Center - Your journey to inner peace',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
