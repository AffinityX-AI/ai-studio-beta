import { sql } from '@/utils/wordpress-theme-builder-db'

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return Response.json({ status: 400, error: 'Theme ID is required' })
  }

  const id = parseInt(params.id)
  const themes = await sql`
    SELECT * FROM themes WHERE id = ${id} LIMIT 1
  `

  if (!themes || themes.length === 0) {
    return Response.json({ status: 404, error: 'Theme not found' })
  }

  await sql`
    DELETE FROM themes WHERE id = ${id}
  `

  return Response.json({ status: 200, message: 'Theme deleted' })
}
