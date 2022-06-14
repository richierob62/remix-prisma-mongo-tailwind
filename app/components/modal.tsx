import Portal from './portal'
import React from 'react'
import { useNavigate } from '@remix-run/react'

interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  arialLabel?: string
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  arialLabel,
  className
}) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <Portal wrapperId="modal">
      <div
        className="fixed inset-0 overflow-y-auto bg-gray-600 bg-opacity-80"
        aria-labelledby={arialLabel ?? 'modal-title'}
        role="dialog"
        aria-modal="true"
        onClick={() => navigate('/home')}
      ></div>
      <div className="fixed inset-0 pointer-events-none flex justify-center items-center max-h-screen overflow-scroll">
        <div
          className={`p-4 bg-gray-200 pointer-events-auto max-h-screen md:rounded-xl ${className}`}
        >
          {children}
        </div>
      </div>
    </Portal>
  )
}

export default Modal
