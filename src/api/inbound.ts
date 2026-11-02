import { apiClient } from './client'
import type {
  ApiResponse,
  InboundDetail,
  InboundListItem,
  InboundListQuery,
  PageResult,
} from '@/features/inbound/types'

function toParams(query: InboundListQuery): Record<string, string> {
  const p: Record<string, string> = {
    page: String(query.page),
    pageSize: String(query.pageSize),
  }
  if (query.inboundNo) p.inboundNo = query.inboundNo
  if (query.sourceDocNo) p.sourceDocNo = query.sourceDocNo
  if (query.orderType && query.orderType !== 'ALL') p.orderType = query.orderType
  if (query.statuses?.length) p.statuses = query.statuses.join(',')
  if (query.sourceSystem && query.sourceSystem !== 'ALL') p.sourceSystem = query.sourceSystem
  if (query.warehouseCode && query.warehouseCode !== 'ALL') p.warehouseCode = query.warehouseCode
  if (query.ownerCode && query.ownerCode !== 'ALL') p.ownerCode = query.ownerCode
  if (query.companyCode && query.companyCode !== 'ALL') p.companyCode = query.companyCode
  if (query.bizLine && query.bizLine !== 'ALL') p.bizLine = query.bizLine
  if (query.materialCode) p.materialCode = query.materialCode
  if (query.etaFrom) p.etaFrom = query.etaFrom
  if (query.etaTo) p.etaTo = query.etaTo
  return p
}

export async function fetchInboundPage(query: InboundListQuery) {
  const { data } = await apiClient.get<ApiResponse<PageResult<InboundListItem>>>(
    '/manager-order/inbound/page',
    { params: toParams(query) },
  )
  return data.data
}

export async function fetchInboundDetail(id: string) {
  const { data } = await apiClient.get<ApiResponse<InboundDetail>>(
    `/manager-order/inbound/${id}`,
  )
  return data.data
}
