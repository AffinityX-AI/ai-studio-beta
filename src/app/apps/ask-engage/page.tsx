'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { useViewportSize } from '@mantine/hooks'

export const dynamic = 'force-dynamic'
export default function AskEngage() {
  const { height } = useViewportSize()
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    setContentHeight(Math.max(0, height - 47))
  }, [height])

  const window = globalThis as any
  window.MindStudioSettings = {
    publicToken: 'pkc2002b0aede4953df8fdd4da52340723',
    appId: 'ba857857-7041-4445-bc61-bf20c0032282',
  }

  return (
    <>
      <Script
        src='https://api.youai.ai/v1/embed.js'
        onLoad={() => {
          const window = globalThis as any
          window.MindStudioSettings = {
            publicToken: 'pkc2002b0aede4953df8fdd4da52340723',
            appId: 'ba857857-7041-4445-bc61-bf20c0032282',
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
