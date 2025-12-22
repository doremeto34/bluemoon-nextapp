import { Providers } from './providers'
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="inter">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}