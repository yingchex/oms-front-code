import { http, HttpResponse } from 'msw'
import {
  enrichDetail,
  filterInboundList,
  INBOUND_SEED,
  paginate,
  WAREHOUSES,
} from '../data/inbound-seed'
import { permissionsForRole, type RoleKey } from '@/features/auth/permissions'

export const handlers = [
  http.get('/api/user/me', () => {
    return HttpResponse.json({
      code: 0,
      message: 'ok',
      data: {
        name: 'Mock 用户',
        department: '仓储运营部',
        role: 'warehouse_supervisor' satisfies RoleKey,
        permissions: permissionsForRole('warehouse_supervisor'),
      },
    })
  }),

  http.get('/api/common/options/warehouses', () => {
    return HttpResponse.json({ code: 0, message: 'ok', data: WAREHOUSES })
  }),

  http.get('/api/manager-order/inbound/page', ({ request }) => {
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.max(1, Number(url.searchParams.get('pageSize') ?? 20))
    const filtered = filterInboundList(
      [...INBOUND_SEED].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
      url.searchParams,
    )
    const list = paginate(filtered, page, pageSize)
    return HttpResponse.json({
      code: 0,
      message: 'ok',
      data: { list, total: filtered.length, page, pageSize },
    })
  }),

  http.get('/api/manager-order/inbound/:id', ({ params }) => {
    const id = String(params.id)
    const row = INBOUND_SEED.find((r) => r.id === id)
    if (!row) {
      return HttpResponse.json({ code: 404, message: '入库单不存在', data: null }, { status: 404 })
    }
    return HttpResponse.json({ code: 0, message: 'ok', data: enrichDetail(row) })
  }),
]
