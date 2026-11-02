import { useQuery } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  BIZ_LINE_OPTIONS,
  COMPANY_OPTIONS,
  INBOUND_STATUS_OPTIONS,
  INBOUND_TYPE_OPTIONS,
  OWNER_OPTIONS,
  SOURCE_SYSTEM_OPTIONS,
} from '@/features/inbound/constants'
import type { InboundOrderStatus, InboundOrderType, SourceSystem } from '@/features/inbound/types'
import type { ApiResponse, WarehouseOption } from '@/features/inbound/types'

export interface InboundFilterForm {
  inboundNo: string
  sourceDocNo: string
  orderType: InboundOrderType | 'ALL'
  statuses: InboundOrderStatus[]
  sourceSystem: SourceSystem | 'ALL'
  warehouseCode: string
  ownerCode: string
  companyCode: string
  bizLine: string
  materialCode: string
  etaFrom: string
  etaTo: string
}

async function fetchWarehouses() {
  const { data } = await apiClient.get<ApiResponse<WarehouseOption[]>>(
    '/common/options/warehouses',
  )
  return data.data
}

const fieldClass =
  'flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30'

export function InboundFilters({
  value,
  onChange,
}: {
  value: InboundFilterForm
  onChange: (v: InboundFilterForm) => void
}) {
  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: fetchWarehouses,
  })

  const statusLabel =
    value.statuses.length === 0
      ? '全部'
      : value.statuses.length <= 2
        ? value.statuses
            .map((s) => INBOUND_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s)
            .join('、')
        : `已选 ${value.statuses.length} 项`

  const toggleStatus = (status: InboundOrderStatus, checked: boolean) => {
    const next = checked
      ? [...value.statuses, status]
      : value.statuses.filter((s) => s !== status)
    onChange({ ...value, statuses: next })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">查询条件</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="inboundNo">入库单号</Label>
          <Input
            id="inboundNo"
            placeholder="精确匹配"
            value={value.inboundNo}
            onChange={(e) => onChange({ ...value, inboundNo: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sourceDocNo">来源单据号</Label>
          <Input
            id="sourceDocNo"
            placeholder="精确匹配"
            value={value.sourceDocNo}
            onChange={(e) => onChange({ ...value, sourceDocNo: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="orderType">单据类型</Label>
          <select
            id="orderType"
            className={fieldClass}
            value={value.orderType}
            onChange={(e) =>
              onChange({ ...value, orderType: e.target.value as InboundOrderType | 'ALL' })
            }
          >
            {INBOUND_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>单据状态</Label>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" className="w-full justify-between font-normal" />}>
              {statusLabel}
              <ChevronDown className="size-4 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {INBOUND_STATUS_OPTIONS.map((o) => (
                  <label
                    key={o.value}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm hover:bg-muted"
                  >
                    <Checkbox
                      checked={value.statuses.includes(o.value)}
                      onCheckedChange={(c) => toggleStatus(o.value, c === true)}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sourceSystem">来源系统</Label>
          <select
            id="sourceSystem"
            className={fieldClass}
            value={value.sourceSystem}
            onChange={(e) =>
              onChange({ ...value, sourceSystem: e.target.value as SourceSystem | 'ALL' })
            }
          >
            {SOURCE_SYSTEM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="warehouse">收货仓库</Label>
          <select
            id="warehouse"
            className={fieldClass}
            value={value.warehouseCode}
            onChange={(e) => onChange({ ...value, warehouseCode: e.target.value })}
          >
            <option value="ALL">全部</option>
            {(warehouses ?? []).map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="owner">货主</Label>
          <select
            id="owner"
            className={fieldClass}
            value={value.ownerCode}
            onChange={(e) => onChange({ ...value, ownerCode: e.target.value })}
          >
            {OWNER_OPTIONS.map((o) => (
              <option key={o.code} value={o.code}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">公司主体</Label>
          <select
            id="company"
            className={fieldClass}
            value={value.companyCode}
            onChange={(e) => onChange({ ...value, companyCode: e.target.value })}
          >
            {COMPANY_OPTIONS.map((o) => (
              <option key={o.code} value={o.code}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bizLine">业务线</Label>
          <select
            id="bizLine"
            className={fieldClass}
            value={value.bizLine}
            onChange={(e) => onChange({ ...value, bizLine: e.target.value })}
          >
            {BIZ_LINE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="materialCode">物料编码</Label>
          <Input
            id="materialCode"
            placeholder="精确匹配"
            value={value.materialCode}
            onChange={(e) => onChange({ ...value, materialCode: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="etaFrom">预计到仓（起）</Label>
          <Input
            id="etaFrom"
            type="date"
            value={value.etaFrom}
            onChange={(e) => onChange({ ...value, etaFrom: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="etaTo">预计到仓（止）</Label>
          <Input
            id="etaTo"
            type="date"
            value={value.etaTo}
            onChange={(e) => onChange({ ...value, etaTo: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
