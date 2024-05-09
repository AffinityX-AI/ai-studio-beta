'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/apps/one-touch')
  }, [])

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      Loading AffinityX AI Studio...
    </main>
  )
}
