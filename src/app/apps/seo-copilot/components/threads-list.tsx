import React from 'react'
import { Button, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import clsx from 'clsx'

interface ThreadListProps {
  // nextCursor: string | null
  threads: any[]
  currentThread: any
  threadsLoading: boolean
  onSetCurrentThread: (thread: any) => void
  onDeleteThread: (thread: any) => void
  onShowModal: () => void
  // onLoadMore: () => void
}

export const ThreadsList: React.FC<ThreadListProps> = ({
  // nextCursor,
  threads,
  currentThread,
  threadsLoading,
  onSetCurrentThread,
  onDeleteThread,
  onShowModal,
  // onLoadMore,
}) => {
  return (
    <>
      {threadsLoading ? (
        <div className='flex items-start justify-center w-full h-full p-4'>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          <p className='text-gray-600 text-sm pl-3'>Loading threads...</p>
        </div>
      ) : (
        <>
          {threads.length > 0 ? (
            <>
              <div className='flex items-center justify-center w-full p-4'>
                <Button
                  onClick={onShowModal}
                  className='w-full py-4 text-sm text-gray-600 font-medium'
                >
                  New Thread
                </Button>
              </div>
              <nav className='flex flex-col w-full'>
                <ul className='flex flex-col w-full gap-0'>
                  {threads?.map((thread) => (
                    <li
                      key={thread.id}
                      className={clsx(
                        'flex flex-col w-full p-4 mb-0 border-b border-dotted border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-normal cursor-pointer',
                        {
                          'bg-blue-50 hover:bg-blue-50 text-blue-600 font-semibold':
                            currentThread?.id === thread.id,
                        }
                      )}
                      onClick={() => onSetCurrentThread(thread)}
                    >
                      <p>{thread.url}</p>
                      <div className='flex items-center justify-between font-medium text-[10px] text-gray-400 uppercase'>
                        {thread.status}
                        <button
                          onClick={() => onDeleteThread(thread)}
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
                    className='w-full py-4 text-sm text-gray-600 font-medium'
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
                  className='w-full py-4 text-sm text-gray-600 font-medium'
                >
                  New Thread
                </Button>
              </div>
              <div className='flex items-center justify-center w-full p-4'>
                <p className='text-gray-600 text-sm'>No threads found</p>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
