import { Inter } from 'next/font/google'
import Link from 'next/link'
import urls from '@/config/urls'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <title>Nostr relay explorer</title>
        <link rel="icon" href="/favicon.ico" />
          {/* load google fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Arimo:wght@700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
          />
      </Head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-100`}>
        <header className="fixed w-full bg-white shadow z-10">
          <nav className="container mx-auto px-6 py-3">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex justify-between items-center">
                <div>
                  <Link href="/" className="text-gray-800 text-xl font-bold md:text-2xl hover:text-gray-700">
                      Nostr Relay Explorer
                  </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                  <button type="button" className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600" aria-label="toggle menu">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                      <path fillRule="evenodd" d="M4 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm1 6a1 1 0 100 2h14a1 1 0 100-2H5zm0 6a1 1 0 100 2h14a1 1 0 100-2H5z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navbar links */}
              <div className="md:flex items-center">
                <div className="flex flex-col mt-2 md:flex-row md:mt-0 md:mx-1 text-gray-500">
                  <Link href={urls.pages.home} className={`my-1 md:mx-4 md:my-0 hover:text-blue-500`}>
                      Inspector
                  </Link>
                  <Link href={urls.pages.relays} className={`my-1 md:mx-4 md:my-0 hover:text-blue-500`}>
                      Relays
                  </Link>
                  {/* Add more navigation links as needed */}
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-grow pt-16">
          {children}
        </main>

        <footer className="bg-white shadow w-full py-4">
          <div className="container mx-auto px-6">
            <p className="text-gray-500 text-sm text-center">
              © 2023 Nostr Relay Explorer. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
