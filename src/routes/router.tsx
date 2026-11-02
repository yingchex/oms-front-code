import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlaceholderPage } from '@/routes/PlaceholderPage'
import { InboundListPage } from '@/features/inbound/pages/InboundListPage'
import { InboundDetailPage } from '@/features/inbound/pages/InboundDetailPage'

const placeholder = { element: <PlaceholderPage /> }

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'managerOrder/inbound/list', element: <InboundListPage /> },
      { path: 'managerOrder/inbound/list/:id', element: <InboundDetailPage /> },
      { path: 'managerOrder/outbound/list', ...placeholder },
      { path: 'managerOrder/outbound/truckload-flow', ...placeholder },
      { path: 'managerOrder/outbound/pds', ...placeholder },
      { path: 'managerOrder/shift/scrap', ...placeholder },
      { path: 'managerOrder/shift/lot', ...placeholder },
      { path: 'managerOrder/shift/status', ...placeholder },
      { path: 'managerOrder/shift/adjust', ...placeholder },
      { path: 'managerOrder/shift/frozen', ...placeholder },
      { path: 'managerOrder/shift/consignor-transfer', ...placeholder },
      { path: 'stock/query/logic', ...placeholder },
      { path: 'stock/query/batch', ...placeholder },
      { path: 'stock/flow/logic', ...placeholder },
      { path: 'stock/flow/batch', ...placeholder },
      { path: 'policy/config/issue-goods', ...placeholder },
      { path: 'policy/config/mpq', ...placeholder },
      { path: 'policy/config/owner', ...placeholder },
      { path: 'policy/config/preempt', ...placeholder },
      { path: 'policy/config/receipt-goods', ...placeholder },
      { path: 'policy/config/receive-feedback', ...placeholder },
      { path: 'policy/config/stock-status', ...placeholder },
      { path: 'policy/config/tax', ...placeholder },
      { path: 'audit/stock/wms', ...placeholder },
      { path: 'dictionary/basic-conf/order-status', ...placeholder },
      { path: 'dictionary/basic-conf/order-type', ...placeholder },
      { path: 'dictionary/basic-conf/trade-type', ...placeholder },
      { path: 'dictionary/basic-conf/stock-status-dict', ...placeholder },
      { path: 'dictionary/basic-query/material', ...placeholder },
      { path: 'dictionary/basic-query/warehouse', ...placeholder },
      { path: 'dictionary/basic-query/company', ...placeholder },
      { path: 'dictionary/basic-query/supplier', ...placeholder },
      { path: 'monitorOrder/query/abnormalOrderMonitor', ...placeholder },
      { path: 'log/query/request-hot-log', ...placeholder },
      { path: 'report/insurance/statistics', ...placeholder },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
