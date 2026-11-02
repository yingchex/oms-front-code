export const INBOUND_PERMS = {
  view: 'inbound.view',
  export: 'inbound.list.export',
  create: 'inbound.list.create',
  statusChange: 'inbound.detail.statusChange',
  cancel: 'inbound.detail.cancel',
  forceClose: 'inbound.detail.forceClose',
} as const

export type RoleKey =
  | 'admin'
  | 'warehouse_supervisor'
  | 'warehouse_operator'
  | 'purchaser'
  | 'finance'
  | 'readonly'

export const ROLE_LABELS: Record<RoleKey, string> = {
  admin: '系统管理员',
  warehouse_supervisor: '仓储运营主管',
  warehouse_operator: '仓储操作员',
  purchaser: '采购员',
  finance: '财务对账员',
  readonly: '只读用户',
}

const ALL_INBOUND = Object.values(INBOUND_PERMS)

export const ROLE_PERMISSIONS: Record<RoleKey, string[]> = {
  admin: ['*'],
  warehouse_supervisor: [
    INBOUND_PERMS.view,
    INBOUND_PERMS.export,
    INBOUND_PERMS.create,
    INBOUND_PERMS.statusChange,
    INBOUND_PERMS.cancel,
    INBOUND_PERMS.forceClose,
  ],
  warehouse_operator: [
    INBOUND_PERMS.view,
    INBOUND_PERMS.create,
    INBOUND_PERMS.statusChange,
  ],
  purchaser: [INBOUND_PERMS.view, INBOUND_PERMS.cancel],
  finance: [INBOUND_PERMS.view, INBOUND_PERMS.export],
  readonly: [INBOUND_PERMS.view],
}

export function permissionsForRole(role: RoleKey): string[] {
  return ROLE_PERMISSIONS[role] ?? ALL_INBOUND
}

export function hasPermission(grants: string[], perm: string): boolean {
  return grants.includes('*') || grants.includes(perm)
}
