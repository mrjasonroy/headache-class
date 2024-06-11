import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Headache Journal for Jason',
};

export default function Layout({
  children,
  header,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className={inter.className}>
        <div className="min-h-svh bg-white">
          {header}
          <div className="mx-auto max-w-5xl px-4">{children}</div>
        </div>
      </body>
    </html>
  );
}
