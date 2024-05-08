import React from 'react'

import { ThemeGeneratingContainer } from './theme-generating-container'
import { ChatContainer } from './chat/container'

interface ThemeContainerProps {
  currentTheme?: any
  onRegenerateTheme: () => void
}

export const ThemeContainer: React.FC<ThemeContainerProps> = ({
  currentTheme,
  onRegenerateTheme,
}) => {
  return (
    <>
      {currentTheme && currentTheme.status === 'completed' ? (
        <ChatContainer
          currentTheme={currentTheme}
          onRegenerateTheme={onRegenerateTheme}
        />
      ) : (
        <div className='flex flex-col items-stretch justify-stretch overflow-auto h-full w-full py-8 px-8 text-black'>
          <ThemeGeneratingContainer currentTheme={currentTheme} />
        </div>
      )}
    </>
  )
}
