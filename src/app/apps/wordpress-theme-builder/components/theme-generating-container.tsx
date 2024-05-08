'use client'

import React from 'react'
import { Carousel } from 'antd'
import { ExperimentOutlined, FileSyncOutlined } from '@ant-design/icons'
import 'animate.css'

interface ThemeGeneratingContainerProps {
  currentTheme?: any
}

export const ThemeGeneratingContainer: React.FC<
  ThemeGeneratingContainerProps
> = ({ currentTheme }) => {
  const stateSlider = React.useRef<any>(null)

  React.useEffect(() => {
    switch (currentTheme?.status) {
      case 'building_company_profile':
        stateSlider.current.goTo(0)
        break
      case 'generating_theme':
        stateSlider.current.goTo(1)
        break
      default:
        break
    }
  }, [currentTheme?.id, currentTheme?.status])

  return (
    <div className='block w-full my-auto'>
      <div className='block animate__animated animate__flash animate__infinite animate__slower animate__delay-1s'>
        <Carousel
          dots={false}
          ref={stateSlider}
          initialSlide={
            currentTheme?.status === 'building_company_profile' ? 0 : 1
          }
        >
          <div className='flex items-center justify-center w-full h-full'>
            <h3 className='flex flex-col items-center justify-center text-[60px] text-sky-800 text-opacity-25'>
              <FileSyncOutlined className='text-[180px] text-sky-800 opacity-50' />
              Building Company Profile...
            </h3>
          </div>
          <div className='flex items-center justify-center w-full h-full'>
            <h3 className='flex flex-col items-center justify-center text-[60px] text-sky-800 text-opacity-25'>
              <ExperimentOutlined className='text-[180px] text-sky-800 opacity-50' />
              Generating Theme...
            </h3>
          </div>
        </Carousel>
      </div>
    </div>
  )
}
