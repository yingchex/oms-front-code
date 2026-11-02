import { useAuth } from '@/features/auth/auth-context'

export function usePermission(perm: string) {
  const { can } = useAuth()
  return can(perm)
}
