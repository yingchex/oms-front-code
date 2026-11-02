import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { fetchInboundPage } from '@/api/inbound'
import { OrderStatusBadge } from '@/components/business/OrderStatusBadge'
import { OrderTypeBadge } from '@/components/business/OrderTypeBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { INBOUND_PERMS } from '@/features/auth/permissions'
import { SOURCE_SYSTEM_LABEL } from '@/features/inbound/constants'
import { InboundFilters, type InboundFilterForm } from '@/features/inbound/components/InboundFilters'
import type { InboundListQuery } from '@/features/inbound/types'
import { usePermission } from '@/hooks/use-permission'
import { downloadCsv } from '@/lib/utils'

const defaultForm: InboundFilterForm = {
  inboundNo: '',
  sourceDocNo: '',
  orderType: 'ALL',
  statuses: [],
  sourceSystem: 'ALL',
  warehouseCode: 'ALL',
  ownerCode: 'ALL',
  companyCode: 'ALL',
  bizLine: 'ALL',
  materialCode: '',
  etaFrom: '',
  etaTo: '',
}

function formToQuery(form: InboundFilterForm, page: number, pageSize: number): InboundListQuery {
  return {
    page,
    pageSize,
    inboundNo: form.inboundNo.trim() || undefined,
    sourceDocNo: form.sourceDocNo.trim() || undefined,
    orderType: form.orderType,
    statuses: form.statuses.length ? form.statuses : undefined,
    sourceSystem: form.sourceSystem,
    warehouseCode: form.warehouseCode,
    ownerCode: form.ownerCode,
    companyCode: form.companyCode,
    bizLine: form.bizLine,
    materialCode: form.materialCode.trim() || undefined,
    etaFrom: form.etaFrom || undefined,
    etaTo: form.etaTo || undefined,
  }
}

export function InboundListPage() {
  const canExport = usePermission(INBOUND_PERMS.export)
  const canCreate = usePermission(INBOUND_PERMS.create)

  const [draft, setDraft] = useState<InboundFilterForm>(defaultForm)
  const [applied, setApplied] = useState<InboundFilterForm>(defaultForm)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const queryParams = useMemo(
    () => formToQuery(applied, page, pageSize),
    [applied, page, pageSize],
  )

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['inbound-list', queryParams],
    queryFn: () => fetchInboundPage(queryParams),
    placeholderData: keepPreviousData,
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

  const onSearch = () => {
    setPage(1)
    setApplied({ ...draft })
  }

  const onReset = () => {
    setDraft(defaultForm)
    setApplied(defaultForm)
    setPage(1)
  }

  const onExport = () => {
    if (!canExport) {
      toast.error('当前角色无导出权限')
      return
    }
    const rows = data?.list ?? []
    if (!rows.length) {
      toast.error('暂无数据可导出')
      return
    }
    downloadCsv(
      `inbound-list-${format(new Date(), 'yyyyMMdd-HHmm')}.csv`,
      rows.map((r) => ({
        入库单号: r.inboundNo,
        来源单据号: r.sourceDocNo,
        单据类型: r.orderType,
        单据状态: r.status,
        来源系统: r.sourceSystem,
        收货仓库: r.warehouseName,
        创建时间: r.createdAt,
        创建人: r.createdBy,
      })),
    )
    toast.success(`已导出 ${rows.length} 条（当前页）`)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">入库单据管理</h1>
        <p className="text-sm text-muted-foreground">支持查询、筛选、导出（Mock 数据）</p>
      </div>

      <InboundFilters value={draft} onChange={setDraft} />

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-4">
          <CardTitle className="text-base font-medium">
            查询结果
            {data != null && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                共 {data.total} 条
              </span>
            )}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onReset}>
              重置
            </Button>
            <Button size="sm" onClick={onSearch} disabled={isFetching}>
              查询
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onExport}
              disabled={!canExport || isFetching}
            >
              导出
            </Button>
            <Button
              size="sm"
              onClick={() => toast.info('手动创建入库单将在后续版本提供')}
              disabled={!canCreate}
            >
              新建入库单
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {isFetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/60 text-sm">
              加载中…
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>入库单号</TableHead>
                <TableHead>来源单据号</TableHead>
                <TableHead>单据类型</TableHead>
                <TableHead>单据状态</TableHead>
                <TableHead>来源系统</TableHead>
                <TableHead>来源主体</TableHead>
                <TableHead>收货仓库</TableHead>
                <TableHead>预计到仓</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>创建人</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.list.length ? (
                data.list.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Link
                        to={`/managerOrder/inbound/list/${row.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {row.inboundNo}
                      </Link>
                    </TableCell>
                    <TableCell>{row.sourceDocNo}</TableCell>
                    <TableCell>
                      <OrderTypeBadge type={row.orderType} />
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>{SOURCE_SYSTEM_LABEL[row.sourceSystem]}</TableCell>
                    <TableCell className="max-w-[140px] truncate">{row.sourceEntity}</TableCell>
                    <TableCell>{row.warehouseName}</TableCell>
                    <TableCell>
                      {row.etaWarehouseAt
                        ? format(new Date(row.etaWarehouseAt), 'yyyy-MM-dd HH:mm')
                        : '—'}
                    </TableCell>
                    <TableCell>{format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                    <TableCell>{row.createdBy}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                    暂无数据，请调整查询条件
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">每页</span>
              <select
                className="h-8 rounded-md border border-input bg-background px-2"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                  void refetch()
                }}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                上一页
              </Button>
              <span>
                第 {page} / {totalPages} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
