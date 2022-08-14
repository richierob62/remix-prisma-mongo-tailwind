import type { Profile } from '@prisma/client'

interface AvatarProps {
  profile: Profile
  classname?: string
  onClick?: (...args: any) => any
}

export const UserAvatar = ({ onClick, profile, classname }: AvatarProps) => {
  return (
    <div
      className={`cursor-pointer bg-gray-400 rounded-full flex justify-center items-center ${classname}`}
      onClick={onClick}
      style={{
        backgroundSize: 'cover',
        ...(profile.profilePicture
          ? { backgroundImage: `url(${profile.profilePicture})` }
          : {})
      }}
    >
      {!profile.profilePicture && (
        <>
          <h2 className="text-white text-2xl">
            {profile.firstName.charAt(0).toUpperCase()}
          </h2>
          <h2 className="text-white text-2xl">
            {profile.lastName.charAt(0).toUpperCase()}
          </h2>
        </>
      )}
    </div>
  )
}
