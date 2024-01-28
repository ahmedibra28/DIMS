import Meta from '@/components/Meta'
import './globals.css'
import { Roboto } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Providers from '@/lib/provider'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '500', '700', '900'],
})

export const metadata = {
  ...Meta({}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${roboto.className} bg-gray-100`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <div className='navbar z-50 flex h-[68px] items-center justify-between bg-white px-5'>
            <div>
              <Link href='/' className='w-24 text-xl normal-case'>
                <Image
                  src='/logo.png'
                  width={40}
                  height={40}
                  alt='logo'
                  className='rounded'
                />
              </Link>
            </div>
            <Navigation />
          </div>
          <div className='mx-auto max-w-6xl px-2'>
            <main className='flex min-h-[85.5vh] flex-col'>{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
