'use client'

import React, { useEffect } from 'react'
import { useIsFirstRender } from '@mantine/hooks'

// export const dynamic = 'force-dynamic'
export default function AskEngage() {
  const firstRender = useIsFirstRender()

  useEffect(() => {
    if (firstRender) window.location.reload()

    const handleScriptLoad = () => {
      const window = globalThis as any
      window.MindStudioSettings = {
        publicToken: 'pkc2002b0aede4953df8fdd4da52340723',
        appId: 'ba857857-7041-4445-bc61-bf20c0032282',
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
  }, [])

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
