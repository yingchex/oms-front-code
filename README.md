# OMS Front (Mock)

React + Vite + Tailwind + shadcn/ui 前端工程，对齐 OMS PRD / Code Wiki 路由结构。

## 开发

```bash
npm install
npm run dev
```

默认启用 MSW（`.env.development` 中 `VITE_USE_MSW=true`）。

## 演示

- 工作台：`/`
- 入库列表：`/managerOrder/inbound/list`（100 条 Mock，可筛选/分页/导出）
- 顶栏可切换角色，验证导出/新建/详情按钮权限

## 构建

```bash
npm run build
```
