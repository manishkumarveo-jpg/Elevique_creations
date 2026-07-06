'use client'

import { useTransition } from 'react'
import { deactivateUser, reactivateUser } from '@/dashboard/lib/actions/auth/deactivate-user'

export function ToggleActiveButton({ userId, isActive }: { userId: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      if (isActive) {
        await deactivateUser({ user_id: userId })
      } else {
        await reactivateUser({ user_id: userId })
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={isActive ? 'p-action-deactivate' : 'p-action-activate'}
    >
      {pending ? '…' : isActive ? 'Deactivate' : 'Activate'}
    </button>
  )
}
