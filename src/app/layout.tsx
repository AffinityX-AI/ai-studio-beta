import React from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ProfileCircle } from 'iconoir-react'
import clsx from 'clsx'

import './globals.css'

import logo from '../../public/affinityx-logo.png'
import { MainNav } from './components/shared/main-nav'
// import { ErrorBoundary } from './components/shared/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AffinityX AI Studio',
  description: 'AffinityX AI Studio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={clsx('bg-white text-black antialiased', inter.className)}
      >
        <Analytics />
        <SpeedInsights />
        <AntdRegistry>
          <div className='flex flex-col w-screen h-full'>
            <header className='flex justify-between items-center h-[47px] px-4 pt-3 bg-white border-b border-slate-200'>
              <div className='w-1/4 pb-3'>
                <Image
                  src={logo}
                  alt='Logo'
                  className='min-w-[100px] max-w-[100px] w-full'
                />
              </div>
              <div className='flex items-center justify-center w-full min-w-[1200px] max-w-[1300px]'>
                <MainNav />
              </div>
              <div className='flex items-center justify-end w-1/4 pb-3'>
                <ProfileCircle />
              </div>
            </header>
          </div>
          {children}
        </AntdRegistry>
      </body>
    </html>
  )
}
