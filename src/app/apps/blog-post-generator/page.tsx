'use client'

import { useEffect } from 'react'
import { useIsFirstRender } from '@mantine/hooks'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
export default function BlogPostGenerator() {
  const firstRender = useIsFirstRender()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    ;(window as any).MindStudioSettings = {
      publicToken: 'pkf1de57a64e69f0f53a6802a099075d67',
      appId: 'b74163bd-c4da-49e5-bd8c-be5f11fca14b',
    }
    if (firstRender) router.refresh()
  }, [pathname])

  return (
    <>
      <iframe
        id='mindstudio-frame'
        referrerPolicy='origin'
        style={{
          width: '100%',
          height: 'calc(100vh - 47px)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px',
          outline: 'none',
        }}
        title='AI Embed'
        frameBorder='0'
      ></iframe>
    </>
  )
}
