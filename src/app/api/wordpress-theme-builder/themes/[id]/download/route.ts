import AWS from 'aws-sdk'

import { zipTheme } from '@/app/apps/wordpress-theme-builder/lib/zip'
import { sql } from '@/utils/wordpress-theme-builder-db'

export async function generatePresignedUrl(s3Key: string) {
  const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: process.env.AWS_REGION ?? 'us-east-2',
  })
  const params = {
    Bucket: process.env.S3_BUCKET_NAME ?? 'wordpress-theme-generator',
    Key: s3Key,
    Expires: 60 * 60, // 1 hour
  }

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err)
      } else {
        resolve(url)
      }
    })
  })
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
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

  // Generate a public S3 URL for the theme using the theme s3 key
  const theme = themes[0]
  const s3Key = theme.id + '/' + theme.theme_s3_key
  await zipTheme(typeof theme.id === 'number' ? theme.id : parseInt(theme.id))
  const url = await generatePresignedUrl(s3Key)

  // Use a content-disposition header to force the browser to download the file
  return Response.redirect(url as string)
}
