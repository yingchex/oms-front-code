export interface MenuItem {
  label: string
  path?: string
  children?: MenuItem[]
}

export const MENU_CONFIG: MenuItem[] = [
  { label: '工作台', path: '/' },
  {
    label: '仓库单据管理',
    children: [
      { label: '入库单据', path: '/managerOrder/inbound/list' },
      { label: '出库单据', path: '/managerOrder/outbound/list' },
      { label: '装车单管理', path: '/managerOrder/outbound/truckload-flow' },
      { label: 'PDS信息', path: '/managerOrder/outbound/pds' },
      {
        label: '在库单据',
        children: [
          { label: '报废管理', path: '/managerOrder/shift/scrap' },
          { label: '批属性变更', path: '/managerOrder/shift/lot' },
          { label: '库存状态变更', path: '/managerOrder/shift/status' },
          { label: '盘盈亏', path: '/managerOrder/shift/adjust' },
          { label: '冻结/解冻', path: '/managerOrder/shift/frozen' },
          { label: '货主转移', path: '/managerOrder/shift/consignor-transfer' },
        ],
      },
    ],
  },
  {
    label: '仓库库存管理',
    children: [
      { label: '逻辑库存查询', path: '/stock/query/logic' },
      { label: '批次库存查询', path: '/stock/query/batch' },
      { label: '逻辑库存流水', path: '/stock/flow/logic' },
      { label: '批次库存流水', path: '/stock/flow/batch' },
    ],
  },
  {
    label: '策略中心',
    children: [
      { label: '发货策略', path: '/policy/config/issue-goods' },
      { label: 'MPQ策略', path: '/policy/config/mpq' },
      { label: '货主策略', path: '/policy/config/owner' },
      { label: '预占策略', path: '/policy/config/preempt' },
      { label: '收货策略', path: '/policy/config/receipt-goods' },
      { label: '回传策略', path: '/policy/config/receive-feedback' },
      { label: '库存状态策略', path: '/policy/config/stock-status' },
      { label: '保费策略', path: '/policy/config/tax' },
    ],
  },
  { label: '对账中心', path: '/audit/stock/wms' },
  {
    label: '数据字典',
    children: [
      { label: '单据状态', path: '/dictionary/basic-conf/order-status' },
      { label: '单据类型', path: '/dictionary/basic-conf/order-type' },
      { label: '交易类型', path: '/dictionary/basic-conf/trade-type' },
      { label: '库存状态', path: '/dictionary/basic-conf/stock-status-dict' },
      { label: '物料查询', path: '/dictionary/basic-query/material' },
      { label: '仓库查询', path: '/dictionary/basic-query/warehouse' },
      { label: '公司主体', path: '/dictionary/basic-query/company' },
      { label: '供应商查询', path: '/dictionary/basic-query/supplier' },
    ],
  },
  { label: '异常监控', path: '/monitorOrder/query/abnormalOrderMonitor' },
  { label: '日志中心', path: '/log/query/request-hot-log' },
  { label: '报表管理', path: '/report/insurance/statistics' },
]
