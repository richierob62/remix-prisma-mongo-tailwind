import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { prisma } from '~/services/prisma.server'
import { requireUserId } from '../services/user/auth.server'
import { uploadAvatar } from '../utils/s3.server'

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const imageUrl = await uploadAvatar(request)

  await prisma.user.update({
    data: {
      profile: {
        update: {
          profilePicture: imageUrl
        }
      }
    },
    where: { id: userId }
  })

  return json({ imageUrl })
}
