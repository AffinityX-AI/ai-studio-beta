'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useViewportSize } from '@mantine/hooks'

export const dynamic = 'force-dynamic'
export default function SocialPostGenerator() {
  const pathname = usePathname()
  const { height } = useViewportSize()
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    setContentHeight(Math.max(0, height - 47))
  }, [height])

  useEffect(() => {
    const handleScriptLoad = () => {
      const window = globalThis as any
      window.MindStudioSettings = {
        publicToken: 'pkc3fa41300f6f3f65d9d4fb1809d0f7e9',
        appId: 'e2147ef5-7386-4192-9a58-85714d44ab0c',
      }
    }

    const scriptElement = document.createElement('script')
    scriptElement.src = 'https://api.youai.ai/v1/embed.js'
    scriptElement.async = true
    scriptElement.onload = handleScriptLoad

    document.body.appendChild(scriptElement)

    return () => {
      document.body.removeChild(scriptElement)
    }
  }, [pathname])

  return (
    <iframe
      id='mindstudio-frame'
      referrerPolicy='origin'
      style={{
        width: '100%',
        height: contentHeight,
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '8px',
        outline: 'none',
      }}
      title='AI Embed'
      frameBorder='0'
    ></iframe>
  )
}
