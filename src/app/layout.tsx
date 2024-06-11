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
    <html
      lang='en'
      className='bg-white'
    >
      <body className={inter.className}>
        <div className='bg-white min-h-svh'>
          {header}
          <div className='max-w-5xl mx-auto px-4'>{children}</div>
        </div>
      </body>
    </html>
  );
}
