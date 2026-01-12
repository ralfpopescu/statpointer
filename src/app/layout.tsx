import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stat Pointer - Visualize Your Strengths',
  description: 'Create and share beautiful stat spreads to communicate your strengths and weaknesses using RPG-style stat charts.',
  keywords: ['stats', 'team', 'strengths', 'skills', 'radar chart', 'visualization'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-midnight bg-pattern geometric-bg">
        {children}
      </body>
    </html>
  );
}

