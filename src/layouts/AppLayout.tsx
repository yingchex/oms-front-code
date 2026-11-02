import { ChevronDown, Package2 } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'
import type { RoleKey } from '@/features/auth/permissions'
import { MENU_CONFIG, type MenuItem } from '@/routes/menu-config'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

function NavItems({ items, depth = 0 }: { items: MenuItem[]; depth?: number }) {
  return (
    <ul className={cn('space-y-0.5', depth > 0 && 'ml-3 border-l border-border pl-2')}>
      {items.map((item) => {
        if (item.children?.length) {
          return (
            <li key={item.label}>
              <p
                className={cn(
                  'px-2 py-1.5 text-xs font-medium text-muted-foreground',
                  depth === 0 && 'mt-3 first:mt-0',
                )}
              >
                {item.label}
              </p>
              <NavItems items={item.children} depth={depth + 1} />
            </li>
          )
        }
        if (!item.path) return null
        return (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted',
                  isActive && 'bg-primary/10 font-medium text-primary',
                )
              }
            >
              {item.label}
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}

export function AppLayout() {
  const { user, role, setRole, roleLabels } = useAuth()

  return (
    <div className="flex min-h-svh bg-muted/30">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Package2 className="size-5 text-primary" />
          <div>
            <p className="text-sm font-semibold leading-none">OMS</p>
            <p className="text-xs text-muted-foreground">订单管理系统</p>
          </div>
        </div>
        <ScrollArea className="flex-1 px-2 py-3">
          <NavItems items={MENU_CONFIG} />
        </ScrollArea>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
          <p className="text-sm text-muted-foreground">ISC 供应链 · Mock 环境</p>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm sm:inline">
              {user.name} · {user.department}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                角色：{roleLabels[role]}
                <ChevronDown className="size-4 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>切换演示角色</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(roleLabels) as RoleKey[]).map((key) => (
                  <DropdownMenuItem key={key} onClick={() => setRole(key)}>
                    {roleLabels[key]}
                    {key === role ? ' ✓' : ''}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
