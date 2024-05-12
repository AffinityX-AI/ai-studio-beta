import clsx from 'clsx'
import React, { useEffect } from 'react'
import type { CollapseProps } from 'antd'
import { Collapse } from 'antd'
import { highlight } from 'sugar-high'
import { useScrollIntoView } from '@mantine/hooks'

interface ChatMessageProps {
  sender: string
  message: string
  status?: string
  aiResponseComplete: boolean
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  message,
  status,
  aiResponseComplete,
}) => {
  const codeBlock = React.createRef<HTMLDivElement>()
  const { scrollIntoView, scrollableRef, targetRef } =
    useScrollIntoView<HTMLDivElement>({
      offset: 60,
    })

  useEffect(() => {
    scrollIntoView()
  }, [message])

  const cleanMessage = (message: string) => {
    if (sender !== 'user') {
      return message
    }

    message = message.replace(
      `
    ### Task:
    `,
      ''
    )
    message = message.replace(
      `\n\n    ### Instructions:\n    - Return the full contents of each file that was updated.\n    - Ensure to wrap each file contents in [filename]FILE CONTENTS[/filename]\n      - Within each wrapper, the file contents should then be wrapped within the proper markers (for example: php files should be wrapped in \`\`\`php markers)\n\n    ### Examples:\n    - If the styles.css file was updated, return the response like this:\n      [style.css]\n      \`\`\`css\n      ...\n      \`\`\`\n      [/style.css]\n\n    - If more than one file was updated, return the response like this:\n      [style.css]\n      \`\`\`css\n      ...\n      \`\`\`\n      [/style.css]\n      [index.php]\n      \`\`\`php\n      ...\n      \`\`\`\n      [/index.php]\n    `,
      ''
    )
    return message.trim()
  }

  // useEffect(() => {
  //   if (codeBlock.current) {
  //     // hljs.highlightElement(codeBlock.current)
  //     const html =
  //   }
  // }, [message])

  useEffect(() => {
    if (
      codeBlock.current &&
      aiResponseComplete &&
      codeBlock.current.dataset.highlighted !== 'yes'
    ) {
      codeBlock.current.innerHTML = highlight(cleanMessage(message))
    }
  }, [aiResponseComplete])

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <div>AI Response</div>,
      children: (
        <div
          className='flex flex-col gap-2 w-full max-h-[300px] overflow-auto'
          ref={scrollableRef}
        >
          <pre className='flex max-w-full bg-white p-4 rounded-lg'>
            <code
              className='flex flex-col text-sm text-gray-800'
              dangerouslySetInnerHTML={{
                __html: cleanMessage(message),
              }}
            />
          </pre>
          <div ref={targetRef} />
        </div>
      ),
    },
  ]

  return (
    <div
      className={clsx(
        'flex flex-col items-start justify-start gap-2 rounded-lg border border-dotted border-gray-200 p-4 mb-4 w-full overflow-auto',
        {
          'bg-gray-50': sender === 'assistant',
        }
      )}
    >
      {sender === 'assistant' && (
        <div className='flex flex-col gap-2 w-full'>
          <p className='flex uppercase font-medium text-[10px] text-gray-400'>
            Assistant
          </p>
          <Collapse
            ghost
            items={items}
            defaultActiveKey={['1']}
            className='!p-0'
          />
        </div>
      )}
      {sender === 'user' && (
        <div className='flex flex-col gap-2 w-full'>
          <p className='flex uppercase font-medium text-[10px] text-gray-400'>
            You
          </p>
          <p
            className='flex flex-col text-sm text-gray-800'
            dangerouslySetInnerHTML={{
              __html: cleanMessage(message),
            }}
          />
        </div>
      )}
      {sender === 'system' && (
        <div className='flex flex-col'>
          <p className='flex uppercase font-medium text-[10px] text-gray-400'>
            System
          </p>
          {status === 'compiling_company_profile' && (
            <p className='flex text-sm text-gray-800'>
              I want you to build a wordpress template for me.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
