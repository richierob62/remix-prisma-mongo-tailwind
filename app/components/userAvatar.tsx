import type { Profile } from '@prisma/client'

interface AvatarProps {
  profile: Profile
  classname?: string
  onClick?: (...args: any) => any
}

const UserAvatar = ({ onClick, profile, classname }: AvatarProps) => {
  return (
    <div
      className={`cursor-pointer bg-gray-400 rounded-full flex justify-center items-center ${classname}`}
      onClick={onClick}
    >
      <h2>{profile.firstName.charAt(0).toUpperCase()}</h2>
      <h2>{profile.lastName.charAt(0).toUpperCase()}</h2>
    </div>
  )
}

export default UserAvatar
