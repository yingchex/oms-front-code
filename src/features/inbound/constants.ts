import type { InboundOrderStatus, InboundOrderType, SourceSystem } from './types'

export const INBOUND_TYPE_LABEL: Record<InboundOrderType, string> = {
  PURCHASE: '采购入库',
  PRODUCTION: '生产入库',
  RETURN: '退货入库',
  TRANSFER_IN: '调拨入库',
}

export const INBOUND_STATUS_LABEL: Record<InboundOrderStatus, string> = {
  PENDING_CONFIRM: '待确认',
  CONFIRMED: '已确认',
  EXECUTING: '执行中',
  PARTIAL_DONE: '部分完成',
  ALL_DONE: '全部完成',
  CANCELLED: '已取消',
  CLOSED: '已关闭',
}

export const SOURCE_SYSTEM_LABEL: Record<SourceSystem, string> = {
  SAP: 'SAP',
  MES: 'MES',
  OTHER: '其他',
}

export const INBOUND_TYPE_OPTIONS: { value: InboundOrderType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '全部' },
  ...(
    Object.entries(INBOUND_TYPE_LABEL) as [InboundOrderType, string][]
  ).map(([value, label]) => ({ value, label })),
]

export const INBOUND_STATUS_OPTIONS: { value: InboundOrderStatus; label: string }[] = (
  Object.entries(INBOUND_STATUS_LABEL) as [InboundOrderStatus, string][]
).map(([value, label]) => ({ value, label }))

export const SOURCE_SYSTEM_OPTIONS: { value: SourceSystem | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '全部' },
  ...(
    Object.entries(SOURCE_SYSTEM_LABEL) as [SourceSystem, string][]
  ).map(([value, label]) => ({ value, label })),
]

export const BIZ_LINE_OPTIONS = [
  { value: 'ALL', label: '全部' },
  { value: 'PHONE', label: '手机' },
  { value: 'IOT', label: 'IoT' },
  { value: 'TV', label: '电视' },
]

export const OWNER_OPTIONS = [
  { code: 'ALL', name: '全部' },
  { code: 'MI', name: '小米科技' },
  { code: 'MI_IOT', name: '小米IoT' },
]

export const COMPANY_OPTIONS = [
  { code: 'ALL', name: '全部' },
  { code: '1110', name: '小米通讯技术有限公司' },
  { code: '1120', name: '小米科技有限责任公司' },
]

export function statusBadgeVariant(
  status: InboundOrderStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'ALL_DONE':
    case 'CLOSED':
      return 'default'
    case 'CANCELLED':
      return 'destructive'
    case 'EXECUTING':
    case 'PARTIAL_DONE':
      return 'secondary'
    default:
      return 'outline'
  }
}

export function typeBadgeVariant(
  type: InboundOrderType,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (type) {
    case 'PURCHASE':
      return 'default'
    case 'PRODUCTION':
      return 'secondary'
    case 'RETURN':
      return 'destructive'
    default:
      return 'outline'
  }
}
