import { Badge } from '@/components/ui/badge'
import { INBOUND_TYPE_LABEL, typeBadgeVariant } from '@/features/inbound/constants'
import type { InboundOrderType } from '@/features/inbound/types'

export function OrderTypeBadge({ type }: { type: InboundOrderType }) {
  return <Badge variant={typeBadgeVariant(type)}>{INBOUND_TYPE_LABEL[type]}</Badge>
}
