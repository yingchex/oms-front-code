import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">OMS 工作台</h1>
        <p className="text-sm text-muted-foreground">小米 ISC 订单管理系统 — Mock 演示环境</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>待处理入库单</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/managerOrder/inbound/list">
              <Button variant="outline" size="sm">
                进入入库列表
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>异常单据</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/monitorOrder/query/abnormalOrderMonitor">
              <Button variant="outline" size="sm">
                异常监控
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>今日对账任务</CardDescription>
            <CardTitle className="text-3xl">1</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/audit/stock/wms">
              <Button variant="outline" size="sm">
                对账中心
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
