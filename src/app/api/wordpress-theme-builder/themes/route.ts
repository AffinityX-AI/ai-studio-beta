import axios from 'axios'

import { sql } from '@/utils/wordpress-theme-builder-db'

export const revalidate = 0

function ensureHttpOrHttps(website: string) {
  if (!website.startsWith('http://') && !website.startsWith('https://')) {
    website = 'https://' + website
  }
  return website
}

function toSnakeCase(str: string): string {
  return str
    .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscores
    .replace(/([A-Z])/g, '_$1') // Prepend underscores to uppercase letters
    .toLowerCase() // Convert the entire string to lowercase
    .replace(/^_/, '') // Remove leading underscore if present
}

export async function GET(request: Request) {
  const themes = await sql`
    SELECT * FROM themes ORDER BY created_at DESC
  `

  return Response.json({ themes: themes })
}

export async function POST(request: Request) {
  const params = await request.json()
  const formattedWebsite = ensureHttpOrHttps(params.website)

  let themes = await sql`
    insert into themes (name, website, address, theme_name, status, updated_at)
    values (${params.name}, ${formattedWebsite}, ${
    params.address ?? null
  }, ${toSnakeCase(params.name)}, 'building_company_profile', ${new Date()})
    returning *
  `

  if (!themes || themes.length === 0) {
    return Response.json({ status: 500, error: 'Failed to create theme' })
  }

  let theme = themes[0]
  let themeId = typeof theme.id === 'number' ? theme.id : parseInt(theme.id)

  const response = await axios.post(
    'https://tfsaes42gd.execute-api.us-east-2.amazonaws.com/Prod/',
    {
      name: params.name,
      website: formattedWebsite,
      address: params.address ?? '',
      themeId: theme.id,
      destinationType: 'displayReport',
      stateMachine: 'websiteGenerator',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'ax-api-key': 'ax.1HuYEeiv49gwMZQIAKlU5n',
      },
    }
  )

  const workflowId = response.data?.workflowId || null

  if (!workflowId) {
    return Response.json({
      status: 500,
      error: 'Failed to run workflow for theme',
    })
  }

  themes = await sql`
    update themes set workflow_id = ${workflowId} where id = ${themeId}
    returning *
  `
  theme = themes[0]

  return Response.json(theme)
}
