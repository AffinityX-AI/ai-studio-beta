import axios from 'axios'

import { sql } from '@/utils/wordpress-theme-builder-db'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return Response.json({ status: 400, error: 'Theme ID is required' })
  }

  let themes, theme

  const id = parseInt(params.id)
  themes = await sql`
    SELECT * FROM themes WHERE id = ${id} LIMIT 1
  `

  if (!themes || themes.length === 0) {
    return Response.json({ status: 404, error: 'Theme not found' })
  }

  themes = await sql`
    UPDATE themes
    SET status = 'building_company_profile', workflow_id = null, llm_opts = null, theme_s3_key = NULL
    WHERE id = ${id}
    RETURNING *
  `

  if (!themes || themes.length === 0) {
    return Response.json({ status: 500, error: 'Failed to update theme' })
  }

  theme = themes[0]

  const response = await axios.post(
    'https://tfsaes42gd.execute-api.us-east-2.amazonaws.com/Prod/',
    {
      name: theme.name,
      website: theme.website,
      address: theme.address ?? '',
      themeId: id,
      destinationType: 'displayReport',
      stateMachine: 'websiteGenerator',
      companyProfilePresent: !!theme.profile ? 'true' : 'false',
      companyLogoPresent: !!theme.logo_url ? 'true' : 'false',
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
    UPDATE themes
    SET workflow_id = ${workflowId}
    WHERE id = ${id}
    returning *
  `
  theme = themes[0]

  return Response.json(theme)
}
