import sql from '@/utils/seo-copilot-db'

export const revalidate = 0

export async function GET() {
  const threads = await sql`
    SELECT * FROM threads ORDER BY id DESC
  `

  return Response.json({
    threads: threads.map((thread: any) => ({
      id: thread.id,
      url: thread.url,
      execution: thread.execution,
      status: thread.status,
      progress: thread.progress,
      running_steps: thread.running_steps,
      completed_steps: thread.completed_steps,
      report: thread.report,
      updated_at: thread.updated_at,
    })),
  })
}
