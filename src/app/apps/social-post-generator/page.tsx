'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { useViewportSize } from '@mantine/hooks'

export const dynamic = 'force-dynamic'
export default function SocialPostGenerator() {
  const { height } = useViewportSize()
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    setContentHeight(Math.max(0, height - 47))
  }, [height])

  const window = globalThis as any
  window.MindStudioSettings = {
    publicToken: 'pkc3fa41300f6f3f65d9d4fb1809d0f7e9',
    appId: 'e2147ef5-7386-4192-9a58-85714d44ab0c',
  }

  return (
    <>
      <Script
        src='https://api.youai.ai/v1/embed.js'
        onLoad={() => {
          const window = globalThis as any
          window.MindStudioSettings = {
            publicToken: 'pkc3fa41300f6f3f65d9d4fb1809d0f7e9',
            appId: 'e2147ef5-7386-4192-9a58-85714d44ab0c',
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
