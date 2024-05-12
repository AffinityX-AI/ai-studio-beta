'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useViewportSize } from '@mantine/hooks'

export const dynamic = 'force-dynamic'
export default function BlogPostGenerator() {
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
        publicToken: 'pkf1de57a64e69f0f53a6802a099075d67',
        appId: 'b74163bd-c4da-49e5-bd8c-be5f11fca14b',
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
