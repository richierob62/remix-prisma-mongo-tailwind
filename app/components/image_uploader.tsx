import React, { useState } from 'react'

interface ImageUploaderProps {
  onChange: (file: File) => any
  imageUrl?: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onChange,
  imageUrl
}) => {
  const [draggingOver, setDraggingOver] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const dropRef = React.useRef<HTMLDivElement | null>(null)

  const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(e)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onChange(e.dataTransfer.files[0])
      e.dataTransfer.clearData()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      onChange(file)
    }
  }

  const backgroundImageStyling = {
    backgroundSize: 'cover',
    ...(imageUrl
      ? { backgroundImage: `url(${imageUrl})` }
      : { backgroundColor: 'white' })
  }

  return (
    <div
      ref={dropRef}
      className={`${
        draggingOver
          ? 'border-4 border-dashed border-yellow-300 border-rounded'
          : ''
      } group rounded-full relative w-36 h-36 flex justify-center`}
      style={backgroundImageStyling}
      onDragEnter={(e) => {
        preventDefaults(e)
        setDraggingOver(true)
      }}
      onDragLeave={(e) => {
        preventDefaults(e)
        setDraggingOver(false)
      }}
      onDrag={() => preventDefaults}
      onDragStart={() => preventDefaults}
      onDragEnd={() => preventDefaults}
      onDragOver={(e) => {
        preventDefaults(e)
        setDraggingOver(true)
      }}
      onDrop={(e) => {
        setDraggingOver(false)
        handleDrop(e)
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      {imageUrl && (
        <div className="absolute w-full h-full bg-blue-400 opacity-50 rounded-full transition duration-300 ease-in-out group-hover:opacity-0" />
      )}
      <p className="font-extrabold text-4xl text-gray-200 cursor-pointer select-none transition duration-300 ease-in-out group-hover:opacity-0 flex justify-center items-center">
        +
      </p>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        className={'hidden'}
      />
    </div>
  )
}
