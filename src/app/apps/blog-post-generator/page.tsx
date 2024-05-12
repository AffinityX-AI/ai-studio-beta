'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { useViewportSize } from '@mantine/hooks'

export const dynamic = 'force-dynamic'
export default function BlogPostGenerator() {
  const { height } = useViewportSize()
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    setContentHeight(Math.max(0, height - 47))
  }, [height])

  return (
    <>
      <Script
        src='https://api.youai.ai/v1/embed.js'
        onLoad={() => {
          const window = globalThis as any
          window.MindStudioSettings = {
            publicToken: 'pkf1de57a64e69f0f53a6802a099075d67',
            appId: 'b74163bd-c4da-49e5-bd8c-be5f11fca14b',
          }
        }}
      />
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
      />
    </>
  )
}
