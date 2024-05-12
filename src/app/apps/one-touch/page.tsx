'use client'

import { useEffect, useState } from 'react'
import { FileSyncOutlined, MenuOutlined } from '@ant-design/icons'
import { useViewportSize } from '@mantine/hooks'
import {
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  notification,
  Progress,
  Segmented,
} from 'antd'
import { highlight } from 'sugar-high'
import axios from 'axios'

import { ThreadsList } from './components/threads-list'
// import logo from '../../public/affinityx-logo.png'
import { MarkdownReport } from './components/markdown-report'

type FieldType = {
  name: string
  website?: string
  address?: string
}

// export const revalidate = 0
export const dynamic = 'force-dynamic'

export default function OneTouch() {
  const { height } = useViewportSize()
  const [contentHeight, setContentHeight] = useState(0)
  // const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [threadsLoading, setThreadsLoading] = useState<boolean>(true)
  const [threads, setThreads] = useState<any[]>([])
  const [currentThread, setCurrentThread] = useState<any | null>(null)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [reportView, setReportView] = useState<string>('Markdown')

  const [form] = Form.useForm()

  useEffect(() => {
    setContentHeight(Math.max(0, height - 47))
  }, [height])

  useEffect(() => {
    setThreadsLoading(true)
    axios({
      method: 'GET',
      url: '/api/one-touch/threads',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }).then((res) => {
      // setNextCursor(data.nextCursor)
      setThreads(res.data.threads)
      setCurrentThread(res.data.threads?.[0])
      setThreadsLoading(false)
    })
  }, [])

  // const loadMore = () => {
  //   if (nextCursor) {
  //     getThreads().then((data) => {
  //       // setNextCursor(data.nextCursor)
  //       setThreads([...threads, ...data.threads])
  //     })
  //   }
  // }

  const showDrawer = () => {
    setDrawerOpen(true)
  }

  const onDrawerClose = () => {
    setDrawerOpen(false)
  }

  const showModal = () => {
    setModalOpen(true)
  }

  const onFinish = (values: any) => {
    setConfirmLoading(true)

    axios
      .post(
        '/api/one-touch/threads/new',
        {
          name: values.name,
          website: values.website,
          address: values.address,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        setThreads([res.data, ...threads])
        setCurrentThread(res.data)
        setModalOpen(false)
        setConfirmLoading(false)
        form.resetFields()
      })
      .catch((error) => {
        console.error('Error:', error)
        setConfirmLoading(false)
      })
  }

  const handleCancel = () => {
    setModalOpen(false)
  }

  const handleDeleteThread = (thread: any) => {
    axios.delete(`/api/one-touch/threads/${thread.id}`).then((res) => {
      if (res.data.status !== 200) return console.error('Error:', res.data)

      const updatedThreads = threads.filter((t) => t.id !== thread.id)
      setThreads(updatedThreads)
      setCurrentThread(updatedThreads?.[0])
    })
  }

  const [api] = notification.useNotification()

  const openNotificationWithIcon = (error: any | string) => {
    api['error']({
      message: 'Something Went Wrong',
      description: error,
    })
  }

  useEffect(() => {
    if (currentThread?.status === 'running') {
      const interval = setInterval(() => {
        axios(`/api/one-touch/threads/${currentThread.id}/status`).then(
          (res: any) => {
            if (res.data.status !== 200) {
              openNotificationWithIcon(res.data.error)
              return console.error('Error:', res.data.error)
            } else {
              const updatedThreads = [...threads]
              const matchingThreadIndex = updatedThreads.findIndex(
                (t) => t.id === res.data.thread.id
              )
              updatedThreads[matchingThreadIndex] = res.data.thread
              setThreads([...updatedThreads])
              setCurrentThread(res.data.thread)

              if (res.data.thread.status.toLowerCase() === 'succeeded') {
                clearInterval(interval)
              }
            }
          }
        )
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [currentThread?.status, currentThread?.id])

  if (contentHeight < 0) return null

  return (
    <main
      className='flex w-screen items-stretch justify-between p-0 bg-white overflow-hidden'
      style={{ height: contentHeight }}
    >
      <div
        className='hidden lg:flex flex-col w-1/4 min-w-[240px] max-w-[320px] overflow-y-auto items-start justify-start p-0 border-r border-dotted border-gray-200 bg-gray-50'
        style={{ height: contentHeight }}
      >
        <div className='flex flex-col items-center justify-center w-full py-4 px-7 pb-4 border-b border-dotted border-gray-200'>
          {/* <Image src={logo} alt='Logo' className='max-w-[150px]' /> */}
          <p className='text-blue-800 opacity-40 uppercase font-bold text-[11px] mt-0 tracking-widest'>
            One-Touch Company Profile
          </p>
        </div>
        <ThreadsList
          // nextCursor={nextCursor}
          threads={threads}
          currentThread={currentThread}
          threadsLoading={threadsLoading}
          onDeleteThread={handleDeleteThread}
          onSetCurrentThread={(thread: any) => setCurrentThread(thread)}
          onShowModal={showModal}
          // onLoadMore={loadMore}
        />
      </div>
      <Button
        onClick={showDrawer}
        className='lg:!hidden absolute top-4 left-4 z-50'
        type='primary'
        shape='circle'
        size='large'
        icon={<MenuOutlined />}
      />
      <Drawer
        placement='left'
        closable={false}
        onClose={onDrawerClose}
        open={drawerOpen}
        key='left'
        className='lg:hidden'
        classNames={{ body: '!p-0' }}
      >
        <div
          className='flex flex-col w-full overflow-y-auto items-start justify-start p-0 border-r border-dotted border-gray-200 bg-gray-50'
          style={{ height: contentHeight }}
        >
          <div className='flex flex-col items-center justify-center w-full py-4 px-7 pb-4 border-b border-dotted border-gray-200'>
            {/* <Image src={logo} alt='Logo' className='max-w-[150px]' /> */}
            <p className='text-blue-800 opacity-40 uppercase font-bold text-[11px] mt-0 tracking-widest'>
              One-Touch Company Profile
            </p>
          </div>
          <ThreadsList
            // nextCursor={nextCursor}
            threads={threads}
            currentThread={currentThread}
            threadsLoading={threadsLoading}
            onDeleteThread={handleDeleteThread}
            onSetCurrentThread={(thread: any) => setCurrentThread(thread)}
            onShowModal={showModal}
            // onLoadMore={loadMore}
          />
        </div>
      </Drawer>

      <div
        className='flex flex-col w-full items-stretch justify-stretch pt-8 px-3 lg:px-8 overflow-hidden'
        style={{ height: contentHeight }}
      >
        <div
          className='flex flex-col items-start justify-between w-full overflow-hidden'
          style={{ height: contentHeight }}
        >
          <div className='flex flex-col items-stretch justify-stretch overflow-auto h-full w-full text-black'>
            {currentThread && currentThread.report && (
              <div className='flex items-center justify-center pb-4'>
                <Segmented
                  options={['Markdown', 'JSON']}
                  size='large'
                  value={reportView}
                  onChange={setReportView}
                />
              </div>
            )}
            {currentThread ? (
              <div className='flex w-full h-full overflow-x-auto items-start justify-start pb-8'>
                {currentThread.status?.toLowerCase() === 'succeeded' ? (
                  <>
                    {reportView === 'Markdown' && (
                      <div className='markdown-report flex flex-col w-full'>
                        <MarkdownReport report={currentThread.report} />
                      </div>
                    )}
                    {reportView === 'JSON' && (
                      <div className='json-report flex flex-col w-full'>
                        <pre
                          className='flex flex-col text-black'
                          dangerouslySetInnerHTML={{
                            __html: highlight(
                              JSON.stringify(currentThread.report, null, 2)
                            ),
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className='flex flex-col w-full items-center justify-center text-2xl text-gray-300 h-full'>
                    <FileSyncOutlined className='text-gray-100 text-[120px] mb-3' />
                    Generating Report
                  </p>
                )}
              </div>
            ) : (
              <>
                {!threadsLoading ? (
                  <p className='flex w-full items-center justify-center text-2xl text-gray-300'>
                    Select a Thread
                  </p>
                ) : (
                  <p className='flex w-full items-center justify-center text-2xl text-gray-300'>
                    Latest Thread Loading...
                  </p>
                )}
              </>
            )}

            <Modal
              title='New Thread'
              open={modalOpen}
              onOk={() => form.submit()}
              okText='Create Thread'
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Form
                name='new-thread-form'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                form={form}
                onFinish={onFinish}
              >
                <Form.Item<FieldType>
                  label='Company Name'
                  name='name'
                  rules={[
                    { required: true, message: 'Company name is required' },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label='Website'
                  name='website'
                  rules={[{ required: true, message: 'Website is required' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType> label='Address / Location' name='address'>
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </div>

          {currentThread && currentThread.status === 'running' && (
            <div className='flex items-center justify-center w-full py-8'>
              <Progress percent={currentThread.progress} steps={16} />
              {currentThread.running_steps?.length > 0 && (
                <span className='pl-2 text-sm text-blue-600 font-medium'>
                  {currentThread.running_steps?.reverse()?.[0]}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
