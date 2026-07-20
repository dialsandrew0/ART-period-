import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ArtPeriod',
  description: 'Where art meets obsession. Discover, track, and collect fine art.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
