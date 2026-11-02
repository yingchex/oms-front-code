export type InboundOrderType = 'PURCHASE' | 'PRODUCTION' | 'RETURN' | 'TRANSFER_IN'

export type InboundOrderStatus =
  | 'PENDING_CONFIRM'
  | 'CONFIRMED'
  | 'EXECUTING'
  | 'PARTIAL_DONE'
  | 'ALL_DONE'
  | 'CANCELLED'
  | 'CLOSED'

export type SourceSystem = 'SAP' | 'MES' | 'OTHER'

export interface InboundListItem {
  id: string
  inboundNo: string
  sourceDocNo: string
  orderType: InboundOrderType
  status: InboundOrderStatus
  sourceSystem: SourceSystem
  sourceEntity: string
  warehouseName: string
  warehouseCode: string
  ownerCode: string
  ownerName: string
  companyCode: string
  companyName: string
  bizLine: string
  materialCode: string
  etaWarehouseAt: string | null
  createdAt: string
  createdBy: string
}

export interface InboundListQuery {
  page: number
  pageSize: number
  inboundNo?: string
  sourceDocNo?: string
  orderType?: InboundOrderType | 'ALL'
  statuses?: InboundOrderStatus[]
  sourceSystem?: SourceSystem | 'ALL'
  warehouseCode?: string
  ownerCode?: string
  companyCode?: string
  bizLine?: string
  materialCode?: string
  etaFrom?: string
  etaTo?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface InboundOrderItem {
  lineNo: number
  materialCode: string
  materialName: string
  expectedQty: number
  receivedQty: number
  unit: string
  lotNo: string
  productionDate: string | null
  expiryDate: string | null
  lotAttributes: string
}

export interface InboundQcInfo {
  qcNo: string
  qcStatus: string
  qcResult: string
  sampleQty: number
  passQty: number
  failQty: number
  failReason: string
}

export interface InboundTimelineEntry {
  operatedAt: string
  action: string
  fromStatus: string
  toStatus: string
  operator: string
  remark: string
}

export interface InboundDetail extends InboundListItem {
  destCompanyName: string
  sourceBizLine: string
  destBizLine: string
  sourceWarehouseName: string
  purchaseMode: string
  productionType: string
  enableAsn: boolean
  expectedShipAt: string | null
  forceFullReceipt: boolean
  feedbackPolicy: string
  transitFlag: string
  upstreamCreatedAt: string | null
  items: InboundOrderItem[]
  qc: InboundQcInfo | null
  timeline: InboundTimelineEntry[]
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface WarehouseOption {
  code: string
  name: string
}
