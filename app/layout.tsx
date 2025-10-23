// app/layout.tsx

import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/hooks/useTheme';
import { Toaster } from 'react-hot-toast';
import { AlertCountProvider } from '@/components/contexts/AlertCountContext';
import 'leaflet/dist/leaflet.css';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

// font
const inter = Inter({ subsets: ['latin'] });

// ✅ Konfigurasi disesuaikan dengan file yang ada
export const metadata = {
  title: "Floodzy",
  description: "Real-time flood detection and alert system",
  icons: {
    icon: [
        { url: '/web-app-manifest-192x192.png', sizes: '192x192' },
        { url: '/web-app-manifest-512x512.png', sizes: '512x512' },
    ],
    apple: { url: '/apple-icon.png' },
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <ThemeProvider>
            <AlertCountProvider>
              <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </AlertCountProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

