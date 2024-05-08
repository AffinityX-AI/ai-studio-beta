import React from 'react'
import { Button, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import clsx from 'clsx'

interface ThemeListProps {
  // nextCursor: string | null
  themes: any[]
  currentTheme: any
  themesLoading: boolean
  onSetCurrentTheme: (theme: any) => void
  onDeleteTheme: (theme: any) => void
  onShowModal: () => void
  // onLoadMore: () => void
}

export const ThemesList: React.FC<ThemeListProps> = ({
  // nextCursor,
  themes,
  currentTheme,
  themesLoading,
  onSetCurrentTheme,
  onDeleteTheme,
  onShowModal,
  // onLoadMore,
}) => {
  return (
    <>
      {themesLoading ? (
        <div className='flex items-start justify-center w-full h-full p-4'>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          <p className='text-gray-600 text-sm pl-3'>Loading themes...</p>
        </div>
      ) : (
        <>
          {themes.length > 0 ? (
            <>
              <div className='flex items-center justify-center w-full p-4'>
                <Button
                  onClick={onShowModal}
                  className='w-full py-4 text-sm text-gray-600 font-medium hover:!text-sky-800 hover:!border-sky-800'
                >
                  New Theme
                </Button>
              </div>
              <nav className='flex flex-col w-full'>
                <ul className='flex flex-col w-full gap-0'>
                  {themes?.map((theme) => (
                    <li
                      key={theme.id}
                      className={clsx(
                        'flex flex-col w-full p-4 mb-0 border-b border-dotted border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-normal cursor-pointer',
                        {
                          'bg-blue-50 hover:bg-blue-50 text-blue-600 font-semibold':
                            currentTheme?.id === theme.id,
                        }
                      )}
                      onClick={() => onSetCurrentTheme(theme)}
                    >
                      <p>{theme.name}</p>
                      <div className='flex items-center justify-between font-medium text-[10px] text-gray-400 uppercase'>
                        {theme.status.replace(/_/g, ' ')}
                        <button
                          onClick={() => onDeleteTheme(theme)}
                          className='flex w-auto text-[10px] text-red-500 hover:text-red-700 font-medium py-0 px-2'
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
              {/* {nextCursor && (
                <div className='flex items-center justify-center w-full p-4'>
                  <Button
                    onClick={onLoadMore}
                    className='w-full py-4 text-sm text-gray-600 font-medium hover:!text-sky-800 hover:!border-sky-800'
                  >
                    Load More
                  </Button>
                </div>
              )} */}
            </>
          ) : (
            <>
              <div className='flex items-center justify-center w-full p-4'>
                <Button
                  onClick={onShowModal}
                  className='w-full py-4 text-sm text-gray-600 font-medium hover:!text-sky-800 hover:!border-sky-800'
                >
                  New Theme
                </Button>
              </div>
              <div className='flex items-center justify-center w-full p-4'>
                <p className='text-gray-600 text-sm'>No themes found</p>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
