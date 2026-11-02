import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  hasPermission,
  permissionsForRole,
  ROLE_LABELS,
  type RoleKey,
} from './permissions'

interface AuthUser {
  name: string
  department: string
}

interface AuthContextValue {
  user: AuthUser
  role: RoleKey
  setRole: (role: RoleKey) => void
  permissions: string[]
  can: (perm: string) => boolean
  roleLabels: typeof ROLE_LABELS
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleKey>('warehouse_supervisor')
  const permissions = useMemo(() => permissionsForRole(role), [role])
  const setRole = useCallback((r: RoleKey) => setRoleState(r), [])
  const can = useCallback((perm: string) => hasPermission(permissions, perm), [permissions])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: { name: 'Mock 用户', department: '仓储运营部' },
      role,
      setRole,
      permissions,
      can,
      roleLabels: ROLE_LABELS,
    }),
    [role, setRole, permissions, can],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
