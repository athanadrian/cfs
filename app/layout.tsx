import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/app/components/navbar';
import Notification from '@components/Notification';
import AuthSession from './components/AuthSession';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CFS',
  description: 'Common fees calculation app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSession>
      <html lang='en'>
        <body className={inter.className} suppressHydrationWarning={true}>
          <Navbar />
          {children}
          <Notification />
        </body>
      </html>
    </AuthSession>
  );
}
