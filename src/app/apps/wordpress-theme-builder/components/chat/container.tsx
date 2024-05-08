'use client'

import axios from 'axios'
import React from 'react'
import { Button, Input, Tooltip } from 'antd'
import { Spin } from 'antd'
import {
  DownloadOutlined,
  LoadingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useChat } from 'ai/react'
import { useScrollIntoView } from '@mantine/hooks'

import { ChatList } from './list'

const { TextArea } = Input

interface ChatContainerProps {
  currentTheme?: any
  onRegenerateTheme: () => void
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  currentTheme,
  onRegenerateTheme,
}) => {
  const {
    messages,
    setMessages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: `/api/wordpress-theme-builder/themes/${currentTheme?.id}/chat`,
    onFinish: () => setAiResponseComplete(true),
  })

  const [dbMessages, setDbMessages] = React.useState<any[]>([])
  const [messagesLoading, setMessagesLoading] = React.useState<boolean>(true)
  const [aiResponseComplete, setAiResponseComplete] =
    React.useState<boolean>(false)

  const { scrollIntoView, scrollableRef, targetRef } =
    useScrollIntoView<HTMLDivElement>({
      offset: 60,
    })

  React.useEffect(() => {
    if (!currentTheme) return

    setMessagesLoading(true)
    axios({
      method: 'GET',
      url: `/api/wordpress-theme-builder/themes/${currentTheme.id}/messages`,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }).then((res) => {
      setDbMessages(res.data.messages)
      setMessages(
        res.data.messages?.map((message: any) => ({
          id: message.id,
          role: message.sender,
          content: message.message,
        })) ?? []
      )
      setMessagesLoading(false)
    })
  }, [currentTheme?.id])

  // const messagesEndRef = React.useRef(null)

  // const scrollToBottom = () => {
  //   if (messagesEndRef.current) {
  //     ;(messagesEndRef.current as any).scrollIntoView({ behavior: 'smooth' })
  //   }
  // }

  React.useEffect(() => {
    scrollIntoView()
  }, [messages])

  React.useEffect(() => {
    scrollIntoView()
  }, [])

  // const sendMessage = () => {
  //   setMessagesLoading(true)
  //   const lastMessageId = messages?.reverse()?.[0]?.id ?? 0
  //   // setTempMessage({
  //   //   id: lastMessageId + 1,
  //   //   sender: 'user',
  //   //   message: newMessage,
  //   // })
  //   axios
  //     .post(`/api/themes/${currentTheme.id}/messages`, {
  //       message: input,
  //     })
  //     .then((res) => {
  //       if (res.data.status !== 200) {
  //         openNotificationWithIcon(res.data.error)
  //         return console.error('Error:', res.data.error)
  //       }
  //       setDbMessages([...messages, res.data.message])
  //       setMessagesLoading(false)
  //     })
  //     .catch((error) => {
  //       openNotificationWithIcon(error)
  //       console.error('Error:', error)
  //       setMessagesLoading(false)
  //     })
  // }

  return (
    <>
      <div
        ref={scrollableRef}
        className='flex flex-col items-stretch justify-stretch overflow-auto h-full w-full py-8 px-8 text-black'
      >
        {messagesLoading ? (
          <div className='flex items-start justify-center w-full h-full p-4'>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
            <p className='text-gray-600 text-sm pl-3'>Loading messages...</p>
          </div>
        ) : (
          <ChatList
            messages={messages}
            aiResponseComplete={aiResponseComplete}
          />
        )}
        {isLoading && (
          <div className='fixed top-10 left-[50%] right-[50%] flex items-start justify-start w-[160px] h-auto p-4 bg-sky-50 border border-sky-800 border-opacity-25 rounded-lg shadow-lg'>
            <Spin
              indicator={
                <LoadingOutlined className='text-[24px] !text-sky-500' spin />
              }
            />
            <p className='text-gray-600 text-sm font-medium pl-3 loading'>
              AI Thinking
            </p>
          </div>
        )}
        <div ref={targetRef} />
      </div>

      <div className='absolute bottom-0 right-0 flex items-center justify-between w-full py-8 px-3 backdrop-blur-sm bg-white/30'>
        <div className='flex items-center justify-between w-3/4 px-4 gap-8 mx-auto rounded-lg shadow-lg border border-dotted border-opacity-35 border-sky-800 bg-sky-50'>
          <div className='flex items-center justify-start w-full gap-2 py-4'>
            <form
              className='flex items-center justify-stretch gap-2 w-full'
              onSubmit={handleSubmit}
            >
              <TextArea
                autoSize
                placeholder='Start typing...'
                className='!border-sky-800 !border-opacity-35 hover:!border-sky-800 hover:!border-opacity-45 active:!border-sky-800 active:!border-opacity-100 focus:!border-sky-800 focus:!border-opacity-100'
                // onChange={(e: any) => setNewMessage(e.target.value)}
                value={input}
                onChange={handleInputChange}
              />
              <Button
                className='!bg-white !text-sky-800 disabled:!opacity-25 disabled:!bg-sky-50 disabled:!border-sky-800 disabled:!text-sky-800 hover:!text-sky-800 hover:!border-sky-800'
                disabled={!input}
                htmlType='submit'
              >
                Send
              </Button>
            </form>
          </div>
          <div className='flex items-center justify-center w-auto gap-4 py-4 border-l border-dotted border-opacity-35 border-sky-800 pl-8 pr-4'>
            <Tooltip title='Regenerate Theme'>
              <Button
                type='default'
                className='!shadow !bg-white !text-black !border-black !border-dotted border-opacity-35 hover:!bg-black hover:!text-white hover:!border-black'
                icon={<ThunderboltOutlined />}
                onClick={onRegenerateTheme}
              />
            </Tooltip>
            {currentTheme?.theme_s3_key && (
              <Tooltip title='Download Theme'>
                <Button
                  type='default'
                  className='!shadow !bg-white !text-sky-800 !border-sky-600 !border-dotted border-opacity-35 hover:!bg-sky-800 hover:!text-white hover:!border-sky-800'
                  icon={<DownloadOutlined />}
                  onClick={() =>
                    window.open(
                      `/api/themes/${currentTheme.id}/download`,
                      '_blank'
                    )
                  }
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
