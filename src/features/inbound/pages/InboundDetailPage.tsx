import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { fetchInboundDetail } from '@/api/inbound'
import { OrderStatusBadge } from '@/components/business/OrderStatusBadge'
import { OrderTypeBadge } from '@/components/business/OrderTypeBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { INBOUND_PERMS } from '@/features/auth/permissions'
import { SOURCE_SYSTEM_LABEL } from '@/features/inbound/constants'
import { usePermission } from '@/hooks/use-permission'

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value ?? '—'}</p>
    </div>
  )
}

export function InboundDetailPage() {
  const { id } = useParams<{ id: string }>()
  const canStatus = usePermission(INBOUND_PERMS.statusChange)
  const canCancel = usePermission(INBOUND_PERMS.cancel)
  const canForceClose = usePermission(INBOUND_PERMS.forceClose)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inbound-detail', id],
    queryFn: () => fetchInboundDetail(id!),
    enabled: Boolean(id),
  })

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">加载详情…</p>
  }

  if (isError || !data) {
    return (
      <div className="space-y-2">
        <p className="text-destructive">入库单不存在或加载失败</p>
        <Link to="/managerOrder/inbound/list">
          <Button variant="outline" size="sm">
            返回列表
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{data.inboundNo}</h1>
            <OrderTypeBadge type={data.orderType} />
            <OrderStatusBadge status={data.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            来源：{SOURCE_SYSTEM_LABEL[data.sourceSystem]} · {data.sourceDocNo}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!canStatus}
            onClick={() => toast.info('状态变更（Mock）')}
          >
            状态变更
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canCancel}
            onClick={() => toast.info('取消订单（Mock）')}
          >
            取消订单
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={!canForceClose || data.status !== 'PARTIAL_DONE'}
            onClick={() => toast.info('强制关闭（Mock）')}
          >
            强制关闭
          </Button>
          <Link to="/managerOrder/inbound/list">
            <Button variant="secondary" size="sm">
              返回
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="items">明细行</TabsTrigger>
          <TabsTrigger value="qc">质检信息</TabsTrigger>
          <TabsTrigger value="timeline">流水记录</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="入库单号" value={data.inboundNo} />
              <Field label="来源单据号" value={data.sourceDocNo} />
              <Field label="来源系统" value={SOURCE_SYSTEM_LABEL[data.sourceSystem]} />
              <Field label="来源主体公司" value={data.sourceEntity} />
              <Field label="目的公司主体" value={data.destCompanyName} />
              <Field label="收货仓库" value={data.warehouseName} />
              <Field label="货主" value={data.ownerName} />
              <Field label="采购模式" value={data.purchaseMode} />
              <Field label="生产类型" value={data.productionType} />
              <Field label="启用 ASN" value={data.enableAsn ? '是' : '否'} />
              <Field
                label="预计发货时间"
                value={
                  data.expectedShipAt
                    ? format(new Date(data.expectedShipAt), 'yyyy-MM-dd HH:mm')
                    : '—'
                }
              />
              <Field
                label="预计到仓时间"
                value={
                  data.etaWarehouseAt
                    ? format(new Date(data.etaWarehouseAt), 'yyyy-MM-dd HH:mm')
                    : '—'
                }
              />
              <Field label="强制全量收货" value={data.forceFullReceipt ? '是' : '否'} />
              <Field label="回传策略" value={data.feedbackPolicy} />
              <Field label="中转标识" value={data.transitFlag} />
              <Field label="创建人" value={data.createdBy} />
              <Field
                label="创建时间"
                value={format(new Date(data.createdAt), 'yyyy-MM-dd HH:mm:ss')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>行号</TableHead>
                    <TableHead>物料编码</TableHead>
                    <TableHead>物料名称</TableHead>
                    <TableHead>预期数量</TableHead>
                    <TableHead>实收数量</TableHead>
                    <TableHead>单位</TableHead>
                    <TableHead>批号</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((line) => (
                    <TableRow key={line.lineNo}>
                      <TableCell>{line.lineNo}</TableCell>
                      <TableCell>{line.materialCode}</TableCell>
                      <TableCell>{line.materialName}</TableCell>
                      <TableCell>{line.expectedQty}</TableCell>
                      <TableCell>{line.receivedQty}</TableCell>
                      <TableCell>{line.unit}</TableCell>
                      <TableCell>{line.lotNo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qc" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {data.qc ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="质检单号" value={data.qc.qcNo} />
                  <Field label="质检状态" value={data.qc.qcStatus} />
                  <Field label="质检结果" value={data.qc.qcResult} />
                  <Field label="抽样数量" value={data.qc.sampleQty} />
                  <Field label="合格数量" value={data.qc.passQty} />
                  <Field label="不合格数量" value={data.qc.failQty} />
                  <Field label="不合格原因" value={data.qc.failReason} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">暂无质检信息</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {data.timeline.map((t, i) => (
                <div key={`${t.operatedAt}-${i}`}>
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span className="font-medium">{t.action}</span>
                    <span className="text-muted-foreground">
                      {format(new Date(t.operatedAt), 'yyyy-MM-dd HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.fromStatus} → {t.toStatus} · {t.operator}
                    {t.remark ? ` · ${t.remark}` : ''}
                  </p>
                  {i < data.timeline.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
