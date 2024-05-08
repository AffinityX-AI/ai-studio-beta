import sql from '@/utils/one-touch-db'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const thread = await sql`
    SELECT * FROM threads WHERE id = ${params.id} LIMIT 1
  `

  if (!thread || thread.length === 0) {
    return Response.json({ status: 404, error: 'Thread not found' })
  }

  return Response.json(thread[0])
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return Response.json({ status: 400, error: 'Thread ID is required' })
  }

  const id = parseInt(params.id)
  const threads = await sql`
    SELECT * FROM threads WHERE id = ${id} LIMIT 1
  `

  if (!threads || threads.length === 0) {
    return Response.json({ status: 404, error: 'Thread not found' })
  }

  await sql`
    DELETE FROM threads WHERE id = ${id}
  `

  return Response.json({ status: 200, message: 'Thread deleted' })
}
