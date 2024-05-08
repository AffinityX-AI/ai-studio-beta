// import {
//   S3Client,
//   GetObjectCommand,
//   PutObjectCommand,
//   type GetObjectRequest,
//   type PutObjectRequest,
// } from '@aws-sdk/client-s3'
import AWS from 'aws-sdk'

import {
  getCssContents,
  getDefaultContents,
  getJsContents,
  getPhpContents,
} from './utils'

// export const getObject = async (key: string) => {
//   const client = new S3Client({
//     region: 'us-east-2',
//   })

//   const input: GetObjectRequest = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: key,
//   }

//   const command = new GetObjectCommand(input)
//   return await client.send(command)
// }

// export const uploadObject = async (
//   key: string,
//   data: any,
//   contentType = 'text/html'
// ) => {
//   const client = new S3Client({
//     region: 'us-east-2',
//   })

//   const input: PutObjectRequest = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: key,
//     Body: data,
//     ContentType: contentType,
//   }

//   const command = new PutObjectCommand(input)
//   return await client.send(command)
// }

export const objectExists = async (key: string) => {
  const s3 = new AWS.S3()
  try {
    await s3
      .headObject({
        Bucket: String(process.env.S3_BUCKET_NAME),
        Key: key,
      })
      .promise()
    return true
  } catch (error: any) {
    if (error.code === 'NotFound') {
      return false
    } else {
      return false
    }
  }
}

export const getObject = async (key: string) => {
  const s3 = new AWS.S3()
  return await s3
    .getObject({ Bucket: String(process.env.S3_BUCKET_NAME), Key: key })
    .promise()
}

export const uploadObject = async (
  key: string,
  data: any,
  contentType: string = 'text/html'
) => {
  const s3 = new AWS.S3()
  return await s3
    .upload({
      Bucket: String(process.env.S3_BUCKET_NAME),
      Key: key,
      Body: data,
      ContentType: contentType,
    })
    .promise()
}

export const cleanDataForS3 = (
  data: string,
  filename: string,
  extension: string
) => {
  let result

  switch (extension) {
    case 'css':
      result = getCssContents(data)
      break
    case 'js':
      result = getJsContents(data)
      break
    case 'php':
      const ensurePhpTags = filename === 'functions.php'
      result = getPhpContents(data, ensurePhpTags)
      break
    default:
      result = data
  }

  if (!result) {
    result = getDefaultContents(data)
  }

  return result
}

export const uploadThemeFile = async (
  themeId: number,
  filename: string,
  data: string
) => {
  const extension = filename.split('.').pop() ?? ''

  let contentType
  switch (extension) {
    case 'css':
      contentType = 'text/css'
      break
    case 'js':
      contentType = 'text/javascript'
      break
    case 'php':
      contentType = 'text/php'
      break
    case 'html':
      contentType = 'text/html'
      break
    default:
      contentType = 'text/html'
  }
  let cleanData
  cleanData = cleanDataForS3(data, filename, extension)
  if (
    extension === 'js' &&
    filename === `${themeId}/js/script.js` &&
    !cleanData
  ) {
    cleanData = '<script></script>'
  }

  return await uploadObject(filename, cleanData, contentType)
}
