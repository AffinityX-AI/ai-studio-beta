import { uploadObject } from '@/app/apps/wordpress-theme-builder/lib/s3'
import { sql } from '@/utils/wordpress-theme-builder-db'
import { processMessage } from '@/app/apps/wordpress-theme-builder/lib/anthropic'
import {
  getContentType,
  getFooterFileContents,
  getFunctionsFileContents,
  getHeaderFileContents,
  getIndexFileContents,
  // getJsonContents,
  getScriptFileContents,
  getStyleFileContents,
} from '@/app/apps/wordpress-theme-builder/lib/utils'

export const revalidate = 0

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const themeId = parseInt(params.id)
  const messages = await sql`
    SELECT * FROM chat_messages WHERE theme_id = ${themeId} AND public = true ORDER BY created_at ASC
  `

  return Response.json({
    messages: messages.map((message: any) => ({
      id: message.id,
      sender: message.sender,
      message: message.message,
      input_tokens: message.input_tokens,
      output_tokens: message.output_tokens,
      created_at: message.created_at,
    })),
  })
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const messageParams = await request.json()
  const themeId = parseInt(params.id)

  let llmReponse
  llmReponse = await processMessage(themeId, {
    role: 'user',
    content: `
    ### Task:
    ${messageParams.message}

    ### Instructions:
    - Return the full contents of each file that was updated.
    - Ensure to wrap each file contents in [filename]FILE CONTENTS[/filename]
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
    `,
  })

  console.log(llmReponse)
  const llmResponseText = llmReponse.content[0]?.text ?? ''

  const mapping: any = {
    'style.css': `${themeId}/style.css`,
    'script.js': `${themeId}/js/script.js`,
    'functions.php': `${themeId}/functions.php`,
    'index.php': `${themeId}/index.php`,
    'header.php': `${themeId}/header.php`,
    'footer.php': `${themeId}/footer.php`,
  }

  let uploadsComplete = false
  Object.keys(mapping).forEach(async (item: string, index: number) => {
    console.log(item, index)
    let fileContents

    switch (item) {
      case 'style.css':
        fileContents = getStyleFileContents(llmResponseText)
        break
      case 'script.js':
        fileContents = getScriptFileContents(llmResponseText)
        break
      case 'functions.php':
        fileContents = getFunctionsFileContents(llmResponseText)
        break
      case 'index.php':
        fileContents = getIndexFileContents(llmResponseText)
        break
      case 'header.php':
        fileContents = getHeaderFileContents(llmResponseText)
        break
      case 'footer.php':
        fileContents = getFooterFileContents(llmResponseText)
        break

      default:
        fileContents = null
        break
    }

    console.log(fileContents)
    if (fileContents) {
      const resp = await uploadObject(
        mapping[item],
        fileContents,
        getContentType(String(item.split('.').pop()))
      )

      console.log(resp)

      if (resp && index === Object.keys(mapping).length - 1) {
        uploadsComplete = true
      }
    }
  })

  if (uploadsComplete) {
    const chatMessages = await sql`
    SELECT *
    FROM chat_messages
    WHERE theme_id = ${themeId}
    AND public = true
    ORDER BY created_at DESC
    LIMIT 1
  `

    return Response.json({ status: 200, message: chatMessages?.[0] })
  } else {
    return Response.json({ status: 500, message: 'Error uploading files' })
  }
}
