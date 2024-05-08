import Anthropic from '@anthropic-ai/sdk'
import { AnthropicStream, StreamingTextResponse } from 'ai'

import { getMessages, storeMessage } from '@/utils/wordpress-theme-builder-db'
import { generateSystemPrompt } from '@/app/apps/wordpress-theme-builder/lib/anthropic'
import { uploadObject } from '@/app/apps/wordpress-theme-builder/lib/s3'
import {
  getContentType,
  getFooterFileContents,
  getFunctionsFileContents,
  getHeaderFileContents,
  getIndexFileContents,
  getScriptFileContents,
  getStyleFileContents,
} from '@/app/apps/wordpress-theme-builder/lib/utils'

// IMPORTANT! Set the runtime to edge
export const runtime = process.env.NODE_ENV === 'production' ? 'edge' : 'node'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const themeId = parseInt(params.id)
  const messageParams = await req.json()
  // console.log('Message Params:', messageParams)
  const newMessage = messageParams.messages?.reverse()?.[0]?.content
  // console.log('newMessage', newMessage)
  const messagePrompt = `
    ### Task:
    ${newMessage}

    ### Instructions:
    - Return the full contents of each file that was updated.
    - You must wrap each updated file's contents in [filename]FILE CONTENTS[/filename]
      - Ensure an opening ([filename]) and closing tag ([/filename]) for each file
      - Within each wrapper, the file contents should then be wrapped within the proper markers (for example: php files should be wrapped in \`\`\`php markers)

    ### Examples:
    - If the styles.css file was updated, return the response like this:
      [style.css]
      \`\`\`css
      ...
      \`\`\`
      [/style.css]

    - If more than one file was updated, return the response like this:
      [style.css]
      \`\`\`css
      ...
      \`\`\`
      [/style.css]
      [index.php]
      \`\`\`php
      ...
      \`\`\`
      [/index.php]
    `

  const db_messages: any[] = (await getMessages(themeId)) ?? []
  const messages: any[] = db_messages.map((message) => ({
    role: message.sender,
    content: message.message,
  }))
  messages.push({
    role: 'user',
    content: messagePrompt,
  })

  const systemPrompt = await generateSystemPrompt(themeId)
  const anthropic = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'],
  })

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4000,
    temperature: 1.0,
    system: systemPrompt,
    messages: messages,
    stream: true,
  })

  let usage = {
    model: 'claude-3-haiku-20240307',
    input_tokens: 0,
    output_tokens: 0,
  }

  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response, {
    onStart: async () => {
      await storeMessage(themeId, 'user', newMessage, true)
    },
    onFinal: async (completion: string) => {
      await saveCompletionToDatabase(themeId, completion)
    },
  })

  return new StreamingTextResponse(stream)
}

async function saveCompletionToDatabase(themeId: number, completion: string) {
  await storeMessage(
    themeId,
    'assistant',
    completion,
    true,
    'claude-3-haiku-20240307'
  )

  const mapping: any = {
    'style.css': `${themeId}/style.css`,
    'script.js': `${themeId}/js/script.js`,
    'functions.php': `${themeId}/functions.php`,
    'index.php': `${themeId}/index.php`,
    'header.php': `${themeId}/header.php`,
    'footer.php': `${themeId}/footer.php`,
  }

  Object.keys(mapping).forEach(async (item: string, index: number) => {
    let fileContents

    switch (item) {
      case 'style.css':
        fileContents = getStyleFileContents(completion)
        break
      case 'script.js':
        fileContents = getScriptFileContents(completion)
        break
      case 'functions.php':
        fileContents = getFunctionsFileContents(completion)
        break
      case 'index.php':
        fileContents = getIndexFileContents(completion)
        break
      case 'header.php':
        fileContents = getHeaderFileContents(completion)
        break
      case 'footer.php':
        fileContents = getFooterFileContents(completion)
        break

      default:
        fileContents = null
        break
    }

    if (fileContents) {
      await uploadObject(
        mapping[item],
        fileContents,
        getContentType(String(item.split('.').pop()))
      )
    }
  })
}
