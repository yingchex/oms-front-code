import { addDays, subDays } from 'date-fns'
import type {
  InboundDetail,
  InboundListItem,
  InboundOrderStatus,
  InboundOrderType,
  SourceSystem,
  WarehouseOption,
} from '@/features/inbound/types'
import { INBOUND_STATUS_LABEL } from '@/features/inbound/constants'

export const WAREHOUSES: WarehouseOption[] = [
  { code: 'WH-BJ-001', name: '北京中央仓' },
  { code: 'WH-SH-002', name: '上海区域仓' },
  { code: 'WH-WH-003', name: '武汉前置仓' },
  { code: 'WH-DG-004', name: '东莞工厂仓' },
]

const TYPES: InboundOrderType[] = ['PURCHASE', 'PRODUCTION', 'RETURN', 'TRANSFER_IN']
const STATUSES: InboundOrderStatus[] = [
  'PENDING_CONFIRM',
  'CONFIRMED',
  'EXECUTING',
  'PARTIAL_DONE',
  'ALL_DONE',
  'CANCELLED',
  'CLOSED',
]
const SYSTEMS: SourceSystem[] = ['SAP', 'MES', 'OTHER']
const OWNERS = [
  { code: 'MI', name: '小米科技' },
  { code: 'MI_IOT', name: '小米IoT' },
]
const COMPANIES = [
  { code: '1110', name: '小米通讯技术有限公司' },
  { code: '1120', name: '小米科技有限责任公司' },
]
const BIZ = ['PHONE', 'IOT', 'TV']
const MATERIALS = ['M1008601', 'M2003302', 'M3001108', 'M4009921', 'M5007788']

function iso(d: Date) {
  return d.toISOString()
}

function pad(n: number, len: number) {
  return String(n).padStart(len, '0')
}

export function buildInboundSeed(count = 100): InboundListItem[] {
  const now = new Date()
  const list: InboundListItem[] = []

  for (let i = 1; i <= count; i++) {
    const wh = WAREHOUSES[i % WAREHOUSES.length]!
    const owner = OWNERS[i % OWNERS.length]!
    const company = COMPANIES[i % COMPANIES.length]!
    const orderType = TYPES[i % TYPES.length]!
    const status = STATUSES[i % STATUSES.length]!
    const sourceSystem = SYSTEMS[i % SYSTEMS.length]!
    const materialCode = MATERIALS[i % MATERIALS.length]!
    const inboundNo = `IN${now.getFullYear()}${pad(i, 6)}`
    const eta = addDays(now, (i % 14) - 3)

    list.push({
      id: `inb-${i}`,
      inboundNo,
      sourceDocNo: sourceSystem === 'SAP' ? `PO${4500000000 + i}` : `MES-${10000 + i}`,
      orderType,
      status,
      sourceSystem,
      sourceEntity: company.name,
      warehouseName: wh.name,
      warehouseCode: wh.code,
      ownerCode: owner.code,
      ownerName: owner.name,
      companyCode: company.code,
      companyName: company.name,
      bizLine: BIZ[i % BIZ.length]!,
      materialCode,
      etaWarehouseAt: iso(eta),
      createdAt: iso(subDays(now, i % 30)),
      createdBy: i % 3 === 0 ? 'system' : `user${(i % 5) + 1}`,
    })
  }

  return list
}

export const INBOUND_SEED = buildInboundSeed(100)

export function enrichDetail(row: InboundListItem): InboundDetail {
  const items = [
    {
      lineNo: 1,
      materialCode: row.materialCode,
      materialName: `物料-${row.materialCode}`,
      expectedQty: 100 + (Number(row.id.replace(/\D/g, '')) % 50),
      receivedQty:
        row.status === 'PENDING_CONFIRM' || row.status === 'CONFIRMED'
          ? 0
          : 80 + (Number(row.id.replace(/\D/g, '')) % 20),
      unit: 'PCS',
      lotNo: `LOT${row.inboundNo.slice(-6)}`,
      productionDate: row.etaWarehouseAt,
      expiryDate: row.etaWarehouseAt ? iso(addDays(new Date(row.etaWarehouseAt), 365)) : null,
      lotAttributes: '{"grade":"A"}',
    },
  ]

  const timeline = [
    {
      operatedAt: row.createdAt,
      action: '创建',
      fromStatus: '—',
      toStatus: INBOUND_STATUS_LABEL.PENDING_CONFIRM,
      operator: row.createdBy,
      remark: '上游系统下发',
    },
    {
      operatedAt: iso(addDays(new Date(row.createdAt), 1)),
      action: '确认',
      fromStatus: INBOUND_STATUS_LABEL.PENDING_CONFIRM,
      toStatus: INBOUND_STATUS_LABEL[row.status] ?? row.status,
      operator: 'system',
      remark: '自动校验通过',
    },
  ]

  return {
    ...row,
    destCompanyName: row.companyName,
    sourceBizLine: row.bizLine,
    destBizLine: row.bizLine,
    sourceWarehouseName: '—',
    purchaseMode: row.orderType === 'PURCHASE' ? (row.inboundNo.endsWith('3') ? 'VMI' : '普通') : '—',
    productionType: row.orderType === 'PRODUCTION' ? '自有工厂' : '—',
    enableAsn: row.inboundNo.endsWith('5'),
    expectedShipAt: row.etaWarehouseAt ? iso(subDays(new Date(row.etaWarehouseAt), 2)) : null,
    forceFullReceipt: row.inboundNo.endsWith('7'),
    feedbackPolicy: '整单一次回传',
    transitFlag: row.orderType === 'TRANSFER_IN' ? '是' : '否',
    upstreamCreatedAt: row.createdAt,
    items,
    qc:
      row.status === 'EXECUTING' || row.status === 'PARTIAL_DONE' || row.status === 'ALL_DONE'
        ? {
            qcNo: `QC-${row.inboundNo}`,
            qcStatus: '已完成',
            qcResult: '合格',
            sampleQty: 10,
            passQty: 10,
            failQty: 0,
            failReason: '—',
          }
        : null,
    timeline,
  }
}

export function filterInboundList(
  rows: InboundListItem[],
  params: URLSearchParams,
): InboundListItem[] {
  const inboundNo = params.get('inboundNo')?.trim()
  const sourceDocNo = params.get('sourceDocNo')?.trim()
  const materialCode = params.get('materialCode')?.trim()
  const orderType = params.get('orderType')
  const statuses = params.get('statuses')?.split(',').filter(Boolean) ?? []
  const sourceSystem = params.get('sourceSystem')
  const warehouseCode = params.get('warehouseCode')
  const ownerCode = params.get('ownerCode')
  const companyCode = params.get('companyCode')
  const bizLine = params.get('bizLine')
  const etaFrom = params.get('etaFrom')
  const etaTo = params.get('etaTo')

  return rows.filter((row) => {
    if (inboundNo && row.inboundNo !== inboundNo) return false
    if (sourceDocNo && row.sourceDocNo !== sourceDocNo) return false
    if (materialCode && row.materialCode !== materialCode) return false
    if (orderType && row.orderType !== orderType) return false
    if (statuses.length && !statuses.includes(row.status)) return false
    if (sourceSystem && row.sourceSystem !== sourceSystem) return false
    if (warehouseCode && row.warehouseCode !== warehouseCode) return false
    if (ownerCode && row.ownerCode !== ownerCode) return false
    if (companyCode && row.companyCode !== companyCode) return false
    if (bizLine && row.bizLine !== bizLine) return false
    if (row.etaWarehouseAt) {
      const day = row.etaWarehouseAt.slice(0, 10)
      if (etaFrom && day < etaFrom) return false
      if (etaTo && day > etaTo) return false
    } else if (etaFrom || etaTo) {
      return false
    }
    return true
  })
}

export function paginate<T>(rows: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}
