'use client'

import { useEffect } from 'react'
import { useIsFirstRender } from '@mantine/hooks'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
export default function SocialPostGenerator() {
  const firstRender = useIsFirstRender()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    ;(window as any).MindStudioSettings = {
      publicToken: 'pkc3fa41300f6f3f65d9d4fb1809d0f7e9',
      appId: 'e2147ef5-7386-4192-9a58-85714d44ab0c',
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
