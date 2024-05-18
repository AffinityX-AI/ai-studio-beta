'use client'

import { useEffect, useState } from 'react'
import { Button, Drawer, Form, Input, Modal, notification } from 'antd'
import { useViewportSize } from '@mantine/hooks'
import axios from 'axios'
import clsx from 'clsx'

import { ThemesList } from './components/themes-list'
// import logo from '../../public/affinityx-logo.png'
import { MenuOutlined } from '@ant-design/icons'

import { ThemeContainer } from './components/theme-container'

type FieldType = {
  name: string
  website?: string
  address?: string
}

// export const revalidate = 0
export const dynamic = 'force-dynamic'

export default function WordpressThemeBuilder() {
  const { height } = useViewportSize()
  const [contentHeight, setContentHeight] = useState(0)
  // const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [themesLoading, setThemesLoading] = useState<boolean>(true)
  const [themes, setThemes] = useState<any[]>([])
  const [currentTheme, setCurrentTheme] = useState<any | null>(null)
  const [messages, setMessages] = useState<any[]>([])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    setContentHeight(Math.max(0, height - 47))
  }, [height])

  const [form] = Form.useForm()

  useEffect(() => {
    setThemesLoading(true)
    axios({
      method: 'GET',
      url: '/api/wordpress-theme-builder/themes',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }).then((res) => {
      setThemes(res.data.themes)
      setCurrentTheme(res.data.themes?.[0])
      setThemesLoading(false)
    })
  }, [])

  const showDrawer = () => {
    setDrawerOpen(true)
  }

  const onDrawerClose = () => {
    setDrawerOpen(false)
  }

  const showModal = () => {
    setModalOpen(true)
  }

  const onRegenerateTheme = () => {
    axios
      .post(`/api/wordpress-theme-builder/themes/${currentTheme.id}/regenerate`)
      .then((res) => {
        if (res.data.status !== 200) {
          return console.error('Error:', res.data.error)
        }
        const updatedTheme = res.data
        const updatedThemes = [...themes]
        updatedThemes.splice(
          themes.findIndex((t) => t.id === updatedTheme.id),
          1,
          updatedTheme
        )
        setThemes(updatedThemes)
        setCurrentTheme(res.data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const onFinish = (values: any) => {
    setConfirmLoading(true)

    axios
      .post(
        '/api/wordpress-theme-builder/themes',
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
        setThemes([res.data, ...themes])
        setCurrentTheme(res.data)
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

  const handleDeleteTheme = (theme: any) => {
    axios
      .delete(`/api/wordpress-theme-builder/themes/${theme.id}`)
      .then((res) => {
        if (res.data.status !== 200) return console.error('Error:', res.data)
        const updatedThemes = themes.filter((t) => t.id !== theme.id)
        setThemes(updatedThemes)
        setCurrentTheme(updatedThemes?.[0])
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
    if (!currentTheme || currentTheme?.status?.toLowerCase() === 'failed') {
      return
    }

    if (currentTheme?.status !== 'completed') {
      const interval = setInterval(() => {
        axios(
          `/api/wordpress-theme-builder/themes/${currentTheme.id}/status`
        ).then((res: any) => {
          if (res.data.status !== 200) {
            openNotificationWithIcon(res.data.error)
            return console.error('Error:', res.data.error)
          } else {
            const updatedThemes = [...themes]
            const matchingThemeIndex = updatedThemes.findIndex(
              (t) => t.id === res.data.theme.id
            )
            updatedThemes[matchingThemeIndex] = res.data.theme
            setThemes([...updatedThemes])
            setCurrentTheme(res.data.theme)

            if (res.data.theme.status.toLowerCase() === 'completed') {
              clearInterval(interval)
            }
          }
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [currentTheme?.status, currentTheme?.id])

  return (
    <main
      className='flex w-screen items-stretch justify-between p-0 bg-white overflow-hidden'
      style={{ height: contentHeight }}
    >
      <div
        className='hidden lg:flex flex-col w-1/4 min-w-[240px] max-w-[320px] h-screen overflow-y-auto items-start justify-start p-0 border-r border-dotted border-gray-200 bg-gray-50'
        style={{ height: contentHeight }}
      >
        <div className='flex flex-col items-center justify-center w-full py-4 px-7 pb-4 border-b border-dotted border-gray-200'>
          {/* <Image src={logo} alt='Logo' className='max-w-[150px]' /> */}
          <p className='text-sky-800 opacity-40 uppercase font-bold text-[11px] my-0 tracking-widest'>
            Wordpress Theme Generator
          </p>
        </div>
        <ThemesList
          // nextCursor={nextCursor}
          themes={themes}
          currentTheme={currentTheme}
          themesLoading={themesLoading}
          onDeleteTheme={handleDeleteTheme}
          onSetCurrentTheme={(theme: any) => setCurrentTheme(theme)}
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
        <div className='flex flex-col w-full h-screen overflow-y-auto items-start justify-start p-0 border-r border-dotted border-gray-200 bg-gray-50'>
          <div className='flex flex-col items-center justify-center w-full py-4 px-7 pb-4 border-b border-dotted border-gray-200'>
            {/* <Image src={logo} alt='Logo' className='max-w-[150px]' /> */}
            <p className='text-sky-800 opacity-40 uppercase font-bold text-[11px] my-0 tracking-widest'>
              Wordpress Theme Generator
            </p>
          </div>
          <ThemesList
            // nextCursor={nextCursor}
            themes={themes}
            currentTheme={currentTheme}
            themesLoading={themesLoading}
            onDeleteTheme={handleDeleteTheme}
            onSetCurrentTheme={(theme: any) => setCurrentTheme(theme)}
            onShowModal={showModal}
            // onLoadMore={loadMore}
          />
        </div>
      </Drawer>

      <div
        className='flex flex-col w-full items-stretch justify-stretch p-0 overflow-y-scroll'
        style={{ height: contentHeight }}
      >
        <div
          className='flex flex-col items-start justify-between w-full relative'
          style={{ height: contentHeight }}
        >
          <ThemeContainer
            currentTheme={currentTheme}
            onRegenerateTheme={onRegenerateTheme}
          />
        </div>
      </div>
      <Modal
        title='New Theme'
        open={modalOpen}
        onOk={() => form.submit()}
        okText='Create Theme'
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          name='new-theme-form'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item<FieldType>
            label='Company Name'
            name='name'
            rules={[{ required: true, message: 'Company name is required' }]}
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
    </main>
  )
}
