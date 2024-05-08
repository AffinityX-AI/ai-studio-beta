import { neon } from '@neondatabase/serverless'
export const sql = neon(process.env.WORDPRESS_THEME_BUILDER_DATABASE_URL ?? '')

export const getMessages = async (themeId: number) => {
  return await sql`
    SELECT * FROM chat_messages WHERE theme_id = ${themeId} ORDER BY created_at ASC
  `
}

export const storeMessage = async (
  themeId: number,
  sender: string,
  message: string,
  is_public: boolean = false,
  model: string | null = null,
  input_tokens: number | null = null,
  output_tokens: number | null = null
) => {
  return await sql`
    INSERT INTO chat_messages (theme_id, sender, message, public, model, input_tokens, output_tokens, updated_at)
    VALUES (${themeId}, ${sender}, ${message}, ${is_public}, ${model}, ${input_tokens}, ${output_tokens}, NOW())
  `
}
