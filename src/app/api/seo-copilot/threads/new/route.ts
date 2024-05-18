import axios from 'axios'

import sql from '@/utils/seo-copilot-db'

function ensureHttpOrHttps(website: string) {
  if (!website.startsWith('http://') && !website.startsWith('https://')) {
    website = 'https://' + website
  }
  return website
}

export async function POST(request: Request) {
  const params = await request.json()
  const formattedWebsite = ensureHttpOrHttps(params.url)
  const response = await axios.post(
    'https://tfsaes42gd.execute-api.us-east-2.amazonaws.com/Prod/',
    {
      url: formattedWebsite,
      stateMachine: 'seoCopilot',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'ax-api-key': process.env.AX_API_KEY,
      },
    }
  )

  const workflowId = response.data?.workflowId || null

  if (!workflowId) {
    return Response.json({ status: 500, error: 'Failed to create thread' })
  }

  const thread = await sql`
    insert into threads (url, execution, status, updated_at)
    values
      (${params.url}, ${workflowId}, 'running', ${new Date()})
    returning *
  `

  return Response.json(thread?.[0])
}
