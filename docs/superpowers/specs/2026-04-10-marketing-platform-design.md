# 营销平台原型设计文档

> 创建日期：2026-04-10
> 目标：搭建演示原型，用于向领导展示完整功能流程并确认需求

## 一、项目概述

### 背景
粤通卡ETC营销平台，通过会员机制实现收入多元化，支持多种付费模式，整合权益服务。

### 目标
- 演示完整业务闭环（用户端 + 后台端）
- 支持真实的增删改查操作
- 现代SaaS风格界面，适合领导演示

### 范围
- 用户端：会员购买、权益查看、扣费记录、取消退款
- 后台端：仪表盘、权益管理、订单管理、会员管理、结算对账、系统配置

## 二、技术架构

### 技术栈
- **前端框架**：Next.js 16 + React 19
- **UI组件**：Tailwind CSS + shadcn/ui
- **数据库**：Prisma ORM + SQLite
- **状态管理**：React Query + Zustand

### 架构图
```
┌─────────────────────────────────────────────────────────────┐
│                      用户端 (H5风格)                          │
│  首页 → 会员购买 → 权益中心 → 扣费记录 → 我的会员              │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      后台管理端                               │
│  仪表盘 → 权益管理 → 订单管理 → 会员管理 → 结算对账 → 系统配置  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Prisma ORM + SQLite                       │
└─────────────────────────────────────────────────────────────┘
```

## 三、数据模型

### 核心实体

#### 用户 (User)
```prisma
model User {
  id          String   @id @default(cuid())
  phone       String   @unique
  name        String?
  plateNumber String?  // 车牌号
  createdAt   DateTime @default(now())
  members     Member[]
  orders      Order[]
}
```

#### 会员产品 (MemberProduct)
```prisma
model MemberProduct {
  id          String   @id @default(cuid())
  name        String   // 年卡/月卡/次卡
  type        MemberType // YEARLY/MONTHLY/PER_USE
  price       Decimal
  description String?
  duration    Int?     // 有效期天数，次卡为null
  isActive    Boolean  @default(true)
  orders      Order[]
  members     Member[]
}
```

#### 权益 (Right)
```prisma
model Right {
  id          String   @id @default(cuid())
  name        String   // 粤运拯救/只换不修/保险
  description String?
  type        String   // 自营/代销
  isActive    Boolean  @default(true)
  products    MemberProduct[]
}
```

#### 订单 (Order)
```prisma
model Order {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId])
  productId   String
  product     MemberProduct @relation(fields: [productId])
  amount      Decimal
  status      OrderStatus // PENDING/PAID/CANCELLED/REFUNDED
  payMethod   String?  // WECHAT/ALIPAY
  createdAt   DateTime @default(now())
  paidAt      DateTime?
}
```

#### 会员记录 (Member)
```prisma
model Member {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId])
  productId   String
  product     MemberProduct @relation(fields: [productId])
  status      MemberStatus // ACTIVE/EXPIRED/CANCELLED
  startDate   DateTime
  endDate     DateTime
  isTrial     Boolean  @default(false) // 是否试用期
  createdAt   DateTime @default(now())
}
```

#### 扣费记录 (BillingRecord)
```prisma
model BillingRecord {
  id          String   @id @default(cuid())
  memberId    String
  member      Member   @relation(fields: [memberId])
  amount      Decimal
  type        BillingType // MEMBERSHIP_FEE/TOLL_FEE
  status      BillingStatus // SUCCESS/FAILED/PENDING
  createdAt   DateTime @default(now())
}
```

## 四、功能模块

### 用户端功能

| 模块 | 功能 | 页面 |
|------|------|------|
| 首页 | 会员产品展示、开通入口 | `/` |
| 会员购买 | 选择产品、模拟支付 | `/purchase` |
| 权益中心 | 查看已购权益、使用记录 | `/rights` |
| 扣费记录 | 查看扣费明细 | `/billing` |
| 我的会员 | 会员状态、续费、取消 | `/member` |

### 后台端功能

| 模块 | 功能 | 页面 |
|------|------|------|
| 仪表盘 | 核心数据展示、图表 | `/admin` |
| 权益管理 | 权益CRUD、关联产品 | `/admin/rights` |
| 订单管理 | 订单列表、退款处理 | `/admin/orders` |
| 会员管理 | 会员列表、状态管理 | `/admin/members` |
| 结算对账 | 收支报表、对账单 | `/admin/settlement` |
| 系统配置 | 产品配置、参数设置 | `/admin/settings` |

## 五、核心业务流程

### 1. 购买流程
```
用户选择产品 → 确认订单 → 模拟支付 → 支付成功 → 创建会员记录
```

### 2. 扣费流程（演示）
```
后台手动触发 → 创建扣费记录 → 展示扣费明细
```

### 3. 退款流程
```
用户申请/后台操作 → 订单状态变更为退款 → 展示退款记录
```

## 六、界面风格

- **风格**：现代SaaS风格
- **配色**：主色调蓝色系，辅助灰色
- **布局**：用户端移动端优先，后台端响应式
- **组件**：shadcn/ui组件库

## 七、演示场景

1. **用户开通年卡**：首页 → 选择年卡 → 支付成功 → 查看权益
2. **查看扣费记录**：扣费记录页面 → 筛选查看
3. **后台配置权益**：权益管理 → 新增权益 → 关联产品
4. **后台处理退款**：订单管理 → 选择订单 → 退款
5. **数据看板展示**：仪表盘 → 展示会员数、收入等

## 八、项目结构

```
marketing-platform/
├── src/
│   ├── app/
│   │   ├── (user)/           # 用户端页面
│   │   ├── admin/            # 后台页面
│   │   ├── api/              # API路由
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/               # shadcn组件
│   │   ├── user/             # 用户端组件
│   │   └── admin/            # 后台组件
│   ├── lib/
│   │   ├── prisma.ts         # 数据库连接
│   │   └── utils.ts
│   └── types/
├── prisma/
│   └── schema.prisma
├── docs/
└── package.json
```

## 九、开发计划

1. 项目初始化 + 数据库模型
2. 用户端页面开发
3. 后台端页面开发
4. 业务流程串联
5. 数据填充 + 演示测试
