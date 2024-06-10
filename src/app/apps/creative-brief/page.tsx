'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { useViewportSize } from '@mantine/hooks'

export const dynamic = 'force-dynamic'
export default function CreativeBrief() {
  const { height } = useViewportSize()
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    setContentHeight(Math.max(0, height - 47))
  }, [height])

  const window = globalThis as any
  window.MindStudioSettings = {
    publicToken: 'pk9548ad0e33c6353ca0b9794523c96ef1',
    appId: '7af07b66-c528-45e2-9d9f-fca63396f0a8',
  }

  return (
    <>
      <Script
        src='https://api.youai.ai/v1/embed.js'
        onLoad={() => {
          const window = globalThis as any
          window.MindStudioSettings = {
            publicToken: 'pk9548ad0e33c6353ca0b9794523c96ef1',
            appId: '7af07b66-c528-45e2-9d9f-fca63396f0a8',
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
