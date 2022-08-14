import S3 from 'aws-sdk/clients/s3'
import type { UploadHandler } from '@remix-run/node'
import cuid from 'cuid'
import { unstable_parseMultipartFormData } from '@remix-run/node'

const s3 = new S3({
  accessKeyId: process.env.REMIX_BOILERPLATE_ACCESS_KEY,
  secretAccessKey: process.env.REMIX_BOILERPLATE_SECRET_KEY,
  region: process.env.REMIX_BOILERPLATE_REGION
})

const uploadHandler: UploadHandler = async ({ name, filename, stream }) => {
  if (name !== 'profile-pic') {
    stream.resume()
    return
  }
  const { Location } = await s3
    .upload({
      Bucket: process.env.REMIX_BOILERPLATE_BUCKET_NAME || '',
      Key: `${cuid()}.${filename.split('.').slice(-1)}`,
      Body: stream
    })
    .promise()

  return Location
}

export async function uploadAvatar(request: Request) {
  const formData = await unstable_parseMultipartFormData(request, uploadHandler)

  const file = formData.get('profile-pic')?.toString() || ''

  return file
}
