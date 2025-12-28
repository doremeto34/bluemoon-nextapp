import { Provider } from "@/components/ui/provider"
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning className="inter">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}