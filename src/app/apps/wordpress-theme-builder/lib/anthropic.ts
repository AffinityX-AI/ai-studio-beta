import Anthropic from '@anthropic-ai/sdk'

import {
  getMessages,
  sql,
  storeMessage,
} from '../../../../utils/wordpress-theme-builder-db'
import {
  getObject,
  objectExists,
  uploadThemeFile,
} from '@/app/apps/wordpress-theme-builder/lib/s3'
import {
  generateFooterFilePrompt,
  generateFunctionsFilePrompt,
  generateHeaderFilePrompt,
  generateIndexFilePrompt,
  generateScriptFilePrompt,
  generateStyleFilePrompt,
} from './prompts'

interface LLMMessage {
  role: string
  content: string
}

const getFilenames = (themeId: number) => {
  const filenames: string[] = [
    `${themeId}/functions.php`,
    `${themeId}/index.php`,
    `${themeId}/header.php`,
    `${themeId}/footer.php`,
    `${themeId}/style.css`,
    `${themeId}/js/script.js`,
  ]
  return filenames
}

const getThemeFiles = async (themeId: number) => {
  const filenames = getFilenames(themeId)
  let response: any = {}

  filenames.forEach(async (filename: string) => {
    try {
      const keyExists = await objectExists(filename)
      if (keyExists) {
        const data = await getObject(filename)
        response[String(filename.split('/').pop())] = data
      }
    } catch (e: any) {
      console.log(e)
      response[String(filename.split('/').pop())] = ''
    }
  })

  return response
}

export const generateSystemPrompt = async (themeId: number) => {
  const filesData = await getThemeFiles(themeId)
  const themes = await sql`SELECT * FROM themes WHERE id = ${themeId} LIMIT 1`
  const theme = themes?.[0] ?? {}

  return `
    # Objective
    Generate a modern, responsive, and visually appealing one-page WordPress theme tailored to the provided company profile. The theme should adhere to industry best practices for layout, design, and user experience.

    ## Instructions
    1. Analyze the provided company profile to understand the company's industry, target audience, and specific services or products.
    2. Generate the necessary WordPress theme files, including \`index.php\`, \`functions.php\`, \`header.php\`, \`footer.php\`, and \`style.css\`, with appropriate header comments and PHP tags.
    3. Design a header with a navigation menu, the company's logo (or placeholder), and social media links as specified in the company profile.
    4. Create a visually distinct and engaging hero section with a clear call-to-action.
    5. Develop sections relevant to the company's industry, such as About, Menu, Reviews, Locations, and Recent Blog Posts, ensuring each section maintains a cohesive style and follows UX best practices.
    6. Implement a footer with social media profile links, contact information, and copyright details.
    7. Apply a modern font and color scheme that aligns with the company's branding.
    8. Ensure the content is well-organized, easy to read, and navigate, with appropriate padding and spacing for readability.
    9. Ensure all images are sized appropriately and optimized for web performance.
    10. Develop comprehensive CSS styling in the \`style.css\` file, avoiding inline styles for better performance and maintainability.
    11. Ensure the theme is responsive and performs well across all devices and browsers.
    12. Generate contextually appropriate content for each section.
      - **About Section:** Provide a brief overview of the company's history, mission, and values.
      - **Menu/Products/Services Section:** Include a sample menu or list of services offered by the company.
      - **Reviews Section:** Display customer testimonials or reviews in a visually appealing format.
      - **Locations Section:** Showcase the company's physical locations or service areas. Include contact information and a google map if applicable.
      - **Blog Section:** Display recent blog posts or news updates related to the company.

    ## File Header Formats
    - \`functions.php\` Header Format:
    /**
    * Theme Name: [Theme Name]
    * Theme URI: [Theme URI]
    * Author: [Author Name]
    * Author URI: [Author URI]
    * Description: [Theme Description]
    * Version: 1.0
    * License: GNU General Public License v2 or later
    * License URI: http://www.gnu.org/licenses/gpl-2.0.html
    * Text Domain: [Text Domain]
    */

    - \`style.css\` Header Format:
    /*
    Theme Name: [Theme Name]
    Author: [Author Name]
    Description: [Theme Description]
    Version: 1.0
    */

    ## Company Logo
    ${theme.logo_url}

    ## Company Profile
    ${theme.profile}

    ## Current Theme Files:
    <functions.php>
    ${filesData['functions.php']}
    </functions.php>

    <index.php>
    ${filesData['index.php']}
    </index.php>

    <header.php>
    ${filesData['header.php']}
    </header.php>

    <footer.php>
    ${filesData['footer.php']}
    </footer.php>

    <style.css>
    ${filesData['style.css']}
    </style.css>

    <script.js>
    ${filesData['js/script.js']}
    </script.js>

    ## Outcome
    Develop a WordPress theme that effectively enhances the company's online presence through a professional, well-designed, and accessible interface, ensuring the theme adheres to web standards and industry best practices.
  `
}

export const promptLLM = async (
  themeId: number,
  messages: any[],
  model = 'claude-3-haiku-20240307'
) => {
  const systemPrompt = await generateSystemPrompt(themeId)
  const anthropic = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'],
  })

  const msg = await anthropic.messages.create({
    model: model,
    max_tokens: 4000,
    temperature: 1.0,
    system: systemPrompt,
    messages: messages,
  })

  return msg
}

export const processMessage = async (
  themeId: number,
  newMessage: LLMMessage,
  is_public: boolean = true,
  model = 'claude-3-haiku-20240307'
) => {
  const storedMessages = (await getMessages(themeId)) ?? []
  const messages = storedMessages.map((message) => ({
    role: message.sender,
    content: message.message,
  }))

  await storeMessage(themeId, newMessage.role, newMessage.content, is_public)
  messages.push(newMessage)

  const responseMessage = await promptLLM(themeId, messages, model)

  const lastMessage = Array.isArray(responseMessage)
    ? responseMessage[responseMessage.length - 1]
    : responseMessage
  await storeMessage(
    themeId,
    lastMessage.role,
    lastMessage.content[0]?.text,
    is_public,
    lastMessage.model,
    lastMessage.usage.input_tokens,
    lastMessage.usage.output_tokens
  )

  return lastMessage
}

export const generateThemeFiles = (
  themeId: number,
  updatedFiles: string[] = []
) => {
  const filenames = getFilenames(themeId)

  filenames.map((filename: string) => {
    if (!updatedFiles.includes(filename?.split('/')?.pop() ?? '')) {
      return
    }

    let prompt = ''

    switch (filename.split('/').pop()) {
      case 'functions.php':
        prompt = generateFunctionsFilePrompt()
        break
      case 'index.php':
        prompt = generateIndexFilePrompt()
        break
      case 'header.php':
        prompt = generateHeaderFilePrompt()
        break
      case 'footer.php':
        prompt = generateFooterFilePrompt()
        break
      case 'style.css':
        prompt = generateStyleFilePrompt()
        break
      case 'script.js':
        prompt = generateScriptFilePrompt()
        break

      default:
        break
    }

    processMessage(themeId, { role: 'user', content: prompt }, false).then(
      (lastMessage: any) => {
        uploadThemeFile(themeId, filename, lastMessage.content[0]?.text).then(
          () => {
            console.log(`Processed ${filename}`)
          }
        )
      }
    )
  })
}
