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

// ✅ Tambahkan metadata dengan favicon
export const metadata = {
  title: "Floodzy",
  description: "Real-time flood detection and alert system",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: ["/logo.png"],
    apple: [
      { url: "/logo.png" },
    ],
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
