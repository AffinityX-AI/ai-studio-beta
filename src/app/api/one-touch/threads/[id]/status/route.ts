import axios from 'axios'

import sql from '@/utils/one-touch-db'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  let threads = await sql`
    SELECT * FROM threads WHERE id = ${id} LIMIT 1
  `

  if (!threads || threads.length === 0) {
    return Response.json({ status: 404, error: 'Thread not found' })
  }

  let currentThread: any | null = threads?.[0]
  const url = 'https://xob2keokel.execute-api.us-east-2.amazonaws.com/Prod/'
  const res = await axios.post(
    url,
    {
      id: currentThread.execution,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'ax-api-key': process.env.AX_API_KEY ?? '',
      },
    }
  )
  const data = res.data

  try {
    threads = await sql`
      UPDATE threads
      SET
        status = ${data.status?.toLowerCase()},
        running_steps = ${data.runningSteps ? data.runningSteps : []},
        completed_steps = ${data.completedSteps ? data.completedSteps : []},
        progress = ${
          data.progress
            ? Math.ceil(parseFloat(data.progress))
            : Math.ceil(parseFloat(currentThread.progress))
        },
        report = ${data.report ? JSON.parse(data.report) : null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    currentThread = threads?.[0]
  } catch (error: any) {
    if (error.message.toLowerCase().includes('json')) {
      const response = await axios.post(
        'https://tfsaes42gd.execute-api.us-east-2.amazonaws.com/Prod/',
        {
          name: currentThread.name,
          website: currentThread.website,
          address: currentThread.address,
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
          DELETE FROM threads WHERE id = ${id}
        `
        currentThread = null
        return Response.json({
          status: 500,
          error: 'Thread corrupted, please try again',
        })
      }

      threads = await sql`
        UPDATE threads
        SET
          execution = ${workflowId},
          status = 'running',
          progress = 0,
          completed_steps = ${[]},
          running_steps = ${[]},
          report = ${null},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      currentThread = threads?.[0]
    } else {
      return Response.json({ status: 500, error: error.message })
    }
  }

  if (currentThread) {
    return Response.json({
      status: 200,
      thread: {
        id: currentThread.id,
        name: currentThread.name,
        website: currentThread.website,
        address: currentThread.address,
        execution: currentThread.execution,
        status: currentThread.status,
        progress: currentThread.progress,
        running_steps: currentThread.running_steps,
        completed_steps: currentThread.completed_steps,
        report: currentThread.report,
        updated_at: currentThread.updated_at,
      },
    })
  } else {
    return Response.json({
      status: 500,
      error: 'Thread corrupted, please try again',
    })
  }
}
