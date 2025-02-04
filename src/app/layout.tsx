import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Providers from '@/components/Providers'
import "react-loading-skeleton/dist/skeleton.css"
import { Toaster } from '@/components/ui/toaster'
import { constructMetadata, cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode

}) {
  return (
    <html lang="en">
      <Providers>
          <body className={cn(
            'min-h-screen font-sans antialiased grainy', inter.className
          )}>
                <Navbar/>
                {children}
                <Toaster/>
          </body>
      </Providers>
    </html>
  )
}
