import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkImages from 'remark-images'
import parser from 'remark-parse'
import pdf from 'remark-pdf'
import { saveAs } from 'file-saver'
import { unified } from 'unified'
import rehypeExternalLinks from 'rehype-external-links'
import remarkRehype from 'remark-rehype'
import { Button } from 'antd'
import { ExportOutlined } from '@ant-design/icons'

interface MarkdownReportProps {
  report: any | null
}

export const MarkdownReport: React.FC<MarkdownReportProps> = ({ report }) => {
  const [markdown, setMarkdown] = React.useState('')

  React.useEffect(() => {
    if (report) {
      setMarkdown(objectToMarkdown(report))
    }
  }, [report])

  function objectToMarkdown(obj: any, depth = 0) {
    let markdownStr = ``
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (depth === 0) {
          markdownStr += `# ${key}\n${objectToMarkdown(obj[key], depth + 1)}\n`
        } else {
          markdownStr += `${'  '.repeat(
            depth
          )}- **${key}**:\n${objectToMarkdown(obj[key], depth + 1)}\n`
        }
      } else {
        if (Array.isArray(obj[key])) {
          if (key.match(/[0-9]/)) {
            markdownStr += `${'  '.repeat(depth)}- ${obj[key]}\n`
          } else {
            markdownStr += `${'  '.repeat(
              depth
            )}- **${key}**:\n${objectToMarkdown(obj[key], depth + 1)}\n`
          }
        } else {
          if (key.match(/[0-9]/)) {
            markdownStr += `${'  '.repeat(depth)}- ${obj[key]}\n`
          } else {
            markdownStr += `${'  '.repeat(depth)}- **${key}**: ${obj[key]}\n`
          }
        }
      }
    }

    return markdownStr
  }

  return (
    <>
      {markdown && (
        <div className='flex w-full items-center justify-center gap-4 pb-4 mb-2 border-b border-dotted border-gray-200'>
          <Button
            className='!border-gray-200 !py-0 !px-3'
            onClick={() => {
              const blob = new Blob([markdown], { type: 'text/markdown' })
              saveAs(blob, 'report.md')
            }}
            icon={<ExportOutlined />}
          >
            Download Markdown
          </Button>
          <Button
            className='!border-gray-200 !py-0 !px-3'
            onClick={async () => {
              const processor = unified()
                .use(parser)
                .use(pdf, { output: 'blob' })
              processor.process(markdown).then((doc: any) => {
                doc.result.then((blob: any) => {
                  saveAs(blob, 'report.pdf')
                })
              })
            }}
            icon={<ExportOutlined />}
          >
            Download PDF
          </Button>
        </div>
      )}
      <Markdown
        remarkPlugins={[remarkGfm, remarkImages, pdf]}
        rehypePlugins={[
          [remarkRehype],
          [rehypeExternalLinks, { target: '_blank' }],
        ]}
        className='py-6 px-2'
      >
        {markdown}
      </Markdown>
    </>
  )
}
