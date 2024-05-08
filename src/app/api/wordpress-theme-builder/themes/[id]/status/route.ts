import axios from 'axios'

import { sql } from '@/utils/wordpress-theme-builder-db'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  let themes = await sql`
    SELECT * FROM themes WHERE id = ${id} LIMIT 1
  `

  if (!themes || themes.length === 0) {
    return Response.json({ status: 404, error: 'Theme not found' })
  }

  let currentTheme: any | null = themes?.[0]
  const url = 'https://xob2keokel.execute-api.us-east-2.amazonaws.com/Prod/'
  const res = await axios.post(
    url,
    {
      id: currentTheme.workflow_id,
      stateMachine: 'websiteGenerator',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'ax-api-key': process.env.AX_API_KEY ?? '',
      },
    }
  )
  const data = res.data
  let status: string
  const runningStep = data.runningSteps?.[0]
  switch (runningStep) {
    case 'Building Company Profile':
      status = 'building_company_profile'
      break
    case 'Generating Theme':
      status = 'generating_theme'
      break
    default:
      status = 'pending'
      break
  }
  if (currentTheme.status === 'completed') {
    status = 'completed'
  }

  try {
    themes = await sql`
      UPDATE themes
      SET
        status = ${status?.toLowerCase()},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    currentTheme = themes?.[0]
  } catch (error: any) {
    if (error.message.toLowerCase().includes('json')) {
      const response = await axios.post(
        'https://tfsaes42gd.execute-api.us-east-2.amazonaws.com/Prod/',
        {
          name: currentTheme.name,
          website: currentTheme.website,
          address: currentTheme.address,
          themeId: currentTheme.id,
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
        await sql`
          DELETE FROM themes WHERE id = ${id}
        `
        currentTheme = null
        return Response.json({
          status: 500,
          error: 'Theme corrupted, please try again',
        })
      }

      themes = await sql`
        UPDATE themes
        SET
          workflow_id = ${workflowId},
          status = 'building_company_profile',
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      currentTheme = themes?.[0]
    } else {
      return Response.json({ status: 500, error: error.message })
    }
  }

  if (currentTheme) {
    return Response.json({
      status: 200,
      theme: {
        id: currentTheme.id,
        name: currentTheme.name,
        website: currentTheme.website,
        address: currentTheme.address,
        status: currentTheme.status,
        theme_s3_key: currentTheme.theme_s3_key,
        created_at: currentTheme.created_at,
        updated_at: currentTheme.updated_at,
      },
    })
  } else {
    return Response.json({
      status: 500,
      error: 'Theme corrupted, please try again',
    })
  }
}
