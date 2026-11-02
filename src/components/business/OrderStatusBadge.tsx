import { Badge } from '@/components/ui/badge'
import { INBOUND_STATUS_LABEL, statusBadgeVariant } from '@/features/inbound/constants'
import type { InboundOrderStatus } from '@/features/inbound/types'

export function OrderStatusBadge({ status }: { status: InboundOrderStatus }) {
  return (
    <Badge variant={statusBadgeVariant(status)}>{INBOUND_STATUS_LABEL[status]}</Badge>
  )
}
