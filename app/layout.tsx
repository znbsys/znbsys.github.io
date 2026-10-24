import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZNBSYS',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
