import { useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function PlaceholderPage() {
  const { pathname } = useLocation()
  return (
    <Card>
      <CardHeader>
        <CardTitle>功能占位</CardTitle>
        <CardDescription>该页面将在后续迭代中实现（M0 路由壳）</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          当前路径：<code className="rounded bg-muted px-1.5 py-0.5">{pathname}</code>
        </p>
      </CardContent>
    </Card>
  )
}
