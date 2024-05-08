import archiver from 'archiver'
import AWS from 'aws-sdk'
import stream, { Readable } from 'node:stream'

import { sql } from '@/utils/wordpress-theme-builder-db'
import { objectExists } from './s3'

export const zipTheme = async (themeId: number) => {
  const archiveStream = archiver('zip')

  archiveStream.on('error', (error: any) => {
    console.error('Archival encountered an error:', error)
    throw new Error(error)
  })

  const objectKeys = [
    `${themeId}/style.css`,
    `${themeId}/js/script.js`,
    `${themeId}/header.php`,
    `${themeId}/footer.php`,
    `${themeId}/functions.php`,
    `${themeId}/index.php`,
  ]

  const themes = await sql`
    SELECT * FROM themes WHERE id = ${themeId}
  `
  if (!themes || themes.length === 0) {
    return null
  }
  const theme = themes[0]
  const themeName = theme.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  const archiveKey = `${themeId}/${themeName}-theme.zip`
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
  const bucket = String(process.env.S3_BUCKET_NAME)

  const passthrough = new stream.PassThrough()
  const uploadTask = new Promise((resolve) => {
    s3.upload(
      {
        Bucket: bucket,
        Key: archiveKey,
        Body: passthrough,
        ContentType: 'application/zip',
      },
      () => {
        console.log('Zip uploaded.')
        resolve([bucket, archiveKey])
      }
    )
  })

  archiveStream.pipe(passthrough)

  for (const key of objectKeys) {
    const params = { Bucket: bucket, Key: key }
    const keyExists = await objectExists(key)
    if (keyExists) {
      const response = await s3.getObject(params).promise()
      archiveStream.append(response.Body as string | Buffer | Readable, {
        name: key.replace(`${themeId}/`, ''),
      })
    }
  }

  archiveStream.finalize()
  await uploadTask

  const themeZipFilename = `${themeName}-theme.zip`
  await sql`
    UPDATE themes SET theme_s3_key = ${themeZipFilename}, status = 'completed' WHERE id = ${themeId}
  `

  return themeZipFilename
}
