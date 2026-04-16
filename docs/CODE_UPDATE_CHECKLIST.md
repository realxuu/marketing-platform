# 代码更新检查报告

> 基于核心业务流程文档，检查现有代码实现差距
> 检查日期：2026-04-16

---

## 一、总体评估

| 类别 | 已实现 | 部分实现 | 未实现 |
|------|--------|----------|--------|
| 订单/签约流程 | 60% | 30% | 10% |
| 激活流程 | 80% | 15% | 5% |
| 扣费引擎 | 50% | 30% | 20% |
| 会员取消 | 60% | 25% | 15% |
| 定时任务 | 0% | 0% | 100% |
| 外部系统接口 | 10% | 0% | 90% |

---

## 二、详细检查清单

### 2.1 订单/签约流程

| 功能点 | 业务要求 | 当前实现 | 差距 | 优先级 |
|--------|---------|----------|------|--------|
| 创建订单 | 签约后创建，状态 PENDING_ACTIVATION | ✅ 已实现 | - | - |
| 订单状态标识签约 | 需标识是否已签约 | ⚠️ 部分 | 缺少 `isSigned` 字段 | P1 |
| 二次签约流程 | 通行费签约后，购买会员时再签约 | ❌ 未实现 | 当前直接创建订单 | P0 |
| 审核流程 | 签约成功后审核 | ❌ 未实现 | 无审核环节 | P1 |
| 审核失败处理 | 订单取消，通知用户 | ❌ 未实现 | - | P1 |

**需要修改的文件：**
- `prisma/schema.prisma` - 添加 `isSigned` 字段
- `src/app/api/orders/route.ts` - 添加签约、审核逻辑
- 新增 `src/app/api/orders/sign/route.ts` - 签约接口
- 新增 `src/app/api/orders/audit/route.ts` - 审核接口

---

### 2.2 激活流程

| 功能点 | 业务要求 | 当前实现 | 差距 | 优先级 |
|--------|---------|----------|------|--------|
| 校验订单状态 | 订单未激活 | ✅ 已实现 | - | - |
| 校验车牌唯一性 | 一车一会员 | ✅ 已实现 | - | - |
| 创建会员 | TRIAL状态，61天体验期 | ✅ 已实现 | - | - |
| 分配权益 | 检查总量限制 | ✅ 已实现 | - | - |
| 更新订单状态 | PAID，已激活 | ✅ 已实现 | - | - |
| 通知粤运系统 | MEMBER_ACTIVATED | ✅ 已实现 | - | - |
| 通知ETC记账系统 | 会员信息 | ❌ 未实现 | 缺少接口 | P0 |
| 通知综合服务系统 | 只换不修权益开通 | ❌ 未实现 | 缺少接口 | P1 |

**需要修改的文件：**
- `src/app/api/activate/route.ts` - 添加通知逻辑
- 新增 `src/app/api/notify/etc-billing/route.ts` - ETC记账系统通知
- 新增 `src/app/api/notify/comprehensive-service/route.ts` - 综合服务系统通知

---

### 2.3 扣费引擎

| 功能点 | 业务要求 | 当前实现 | 差距 | 优先级 |
|--------|---------|----------|------|--------|
| 次卡扣费计算 | ¥1/次，月封顶¥20 | ✅ 已实现 | - | - |
| 校验会员状态 | TRIAL/ACTIVE | ✅ 已实现 | - | - |
| 校验产品状态 | 产品上架 + 权益启用 | ✅ 已实现 | - | - |
| 执行扣费 | 创建扣费记录 | ✅ 已实现 | - | - |
| 连续失败检查 | 3天失败自动取消 | ✅ 已实现 | - | - |
| **接收扣费指令** | ETC记账系统发起 | ❌ 未实现 | 当前是被动调用 | P0 |
| 扣费失败重试 | 每日轮扣 | ❌ 未实现 | 需定时任务 | P0 |
| 免费期到期扣费 | 61天后自动扣费 | ❌ 未实现 | 需定时任务 | P0 |
| 到期提醒 | 前3天/前1天提醒 | ❌ 未实现 | 需定时任务 | P1 |

**需要修改的文件：**
- 新增 `src/app/api/billing/instruction/route.ts` - 接收ETC记账系统扣费指令
- 新增 `src/app/api/cron/trial-expire/route.ts` - 体验期到期扣费
- 新增 `src/app/api/cron/billing-retry/route.ts` - 扣费重试
- 新增 `src/app/api/cron/expiry-reminder/route.ts` - 到期提醒
- 配置 Vercel Cron Jobs

---

### 2.4 会员取消流程

| 功能点 | 业务要求 | 当前实现 | 差距 | 优先级 |
|--------|---------|----------|------|--------|
| 取消原因校验 | USER/ADMIN/BILLING/ETC | ✅ 已实现 | - | - |
| 状态更新 | PENDING_CANCEL | ✅ 已实现 | - | - |
| 创建通知 | 取消确认 | ✅ 已实现 | - | - |
| 通知粤运系统 | MEMBER_CANCELLED | ✅ 已实现 | - | - |
| 通知ETC记账系统 | 会员取消 | ❌ 未实现 | 缺少接口 | P0 |
| 通知综合服务系统 | 取消只换不修 | ❌ 未实现 | 缺少接口 | P1 |
| **通知互联网系统** | 解约请求 | ❌ 未实现 | 缺少接口 | P0 |
| 到期执行取消 | 解约+取消权益 | ❌ 未实现 | 需定时任务 | P0 |
| ETC注销处理 | 立即取消（无过渡） | ⚠️ 部分 | 需单独接口 | P1 |

**需要修改的文件：**
- `src/app/api/members/cancel/route.ts` - 添加通知逻辑
- 新增 `src/app/api/members/cancel/execute/route.ts` - 执行取消（到期日）
- 新增 `src/app/api/notify/internet-system/route.ts` - 互联网系统通知
- 新增 `src/app/api/etc/cancelled/route.ts` - ETC注销回调

---

### 2.5 定时任务

| 任务 | 频率 | 业务要求 | 当前实现 | 优先级 |
|------|------|---------|----------|--------|
| 到期提醒 | 每日 | 体验期前3天/1天提醒 | ❌ 未实现 | P1 |
| 体验期到期扣费 | 每日 | 61天后自动扣费转正 | ❌ 未实现 | P0 |
| 扣费重试 | 每日 | 失败后轮扣重试 | ❌ 未实现 | P0 |
| PENDING_CANCEL转正式取消 | 每日 | 到期日执行取消 | ❌ 未实现 | P0 |
| 会员状态检查 | 每日 | 到期未续费→EXPIRED | ❌ 未实现 | P1 |

**需要新建：**
- `src/app/api/cron/daily-tasks/route.ts` - 统一调度入口
- 配置 `vercel.json` 的 crons 字段

---

### 2.6 外部系统接口

| 系统 | 接口 | 方向 | 当前实现 | 优先级 |
|------|------|------|----------|--------|
| **粤运系统** | 开通免费期通知 | 营销→粤运 | ✅ 模拟实现 | P1 |
| | 免费期结束通知 | 营销→粤运 | ❌ 未实现 | P1 |
| | 会员取消通知 | 营销→粤运 | ✅ 模拟实现 | - |
| | **权益核销通知** | 粤运→营销 | ❌ 未实现 | P0 |
| **ETC记账系统** | 会员信息通知 | 营销→记账 | ❌ 未实现 | P0 |
| | **扣费指令接收** | 记账→营销 | ❌ 未实现 | P0 |
| | 扣费结果回调 | 记账→营销 | ❌ 未实现 | P0 |
| **综合服务系统** | 只换不修开通 | 营销→综合 | ❌ 未实现 | P1 |
| | 只换不修取消 | 营销→综合 | ❌ 未实现 | P1 |
| **互联网系统** | **ETC激活通知** | 互联网→营销 | ❌ 未实现 | P0 |
| | **ETC注销通知** | 互联网→营销 | ❌ 未实现 | P1 |
| | 解约请求 | 营销→互联网 | ❌ 未实现 | P0 |

**需要新建：**
- `src/app/api/external/yueyun/webhook/route.ts` - 粤运核销回调
- `src/app/api/external/etc-billing/instruction/route.ts` - ETC记账系统扣费指令
- `src/app/api/external/etc-billing/callback/route.ts` - 扣费结果回调
- `src/app/api/external/internet-system/activate/route.ts` - ETC激活通知
- `src/app/api/external/internet-system/cancelled/route.ts` - ETC注销通知
- `src/app/api/notify/internet-system/unbind/route.ts` - 解约请求

---

### 2.7 数据模型调整

| 模型 | 字段 | 业务要求 | 当前实现 | 优先级 |
|------|------|---------|----------|--------|
| **Order** | `isSigned` | 是否已签约 | ❌ 缺少 | P1 |
| | `auditStatus` | 审核状态 | ❌ 缺少 | P1 |
| | `auditAt` | 审核时间 | ❌ 缺少 | P1 |
| | `auditBy` | 审核人 | ❌ 缺少 | P1 |
| **MemberProduct** | `effectiveEndTime` | 生效结束时间 | ❌ 缺少 | P2 |
| **BillingRecord** | `status` 默认值 | 应为 PENDING | ❌ 当前是 SUCCESS | P0 |
| **Member** | 无需调整 | - | - | - |

**需要修改：**
- `prisma/schema.prisma`

---

## 三、优先级排序

### P0 - 必须实现（业务闭环）

1. **定时任务框架** - 体验期到期扣费、扣费重试
2. **ETC记账系统接口** - 接收扣费指令
3. **互联网系统接口** - ETC激活/注销通知、解约
4. **BillingRecord默认状态修正**
5. **会员取消完整流程** - 通知所有相关系统

### P1 - 重要功能

1. **审核流程** - 订单审核
2. **到期提醒** - 前3天/1天通知
3. **粤运核销回调** - 权益核销
4. **综合服务系统接口** - 只换不修
5. **签约状态标识**

### P2 - 优化改进

1. 产品生效结束时间
2. 扣费记录与日志表合并/区分
3. 会员表与用户表合并评估

---

## 四、实施建议

### 阶段一：核心闭环（预计 2-3 天）

```
1. 修正 BillingRecord 默认状态
2. 实现定时任务框架（Vercel Cron）
3. 实现体验期到期扣费
4. 实现扣费重试
5. 实现 PENDING_CANCEL 执行取消
```

### 阶段二：外部系统接口（预计 2-3 天）

```
1. ETC记账系统接口
   - 接收扣费指令
   - 会员信息同步
2. 互联网系统接口
   - ETC激活通知
   - ETC注销通知
   - 解约请求
3. 粤运系统接口
   - 权益核销回调
```

### 阶段三：完善功能（预计 1-2 天）

```
1. 审核流程
2. 到期提醒
3. 综合服务系统接口
4. 数据模型完善
```

---

## 五、代码修改清单

### 需要修改的文件

| 文件 | 修改内容 |
|------|---------|
| `prisma/schema.prisma` | 添加 Order 签约/审核字段，修正 BillingRecord 默认值 |
| `src/app/api/orders/route.ts` | 添加签约、审核逻辑 |
| `src/app/api/activate/route.ts` | 添加通知ETC记账系统、综合服务系统 |
| `src/app/api/members/cancel/route.ts` | 添加通知ETC记账系统、综合服务系统、互联网系统 |
| `src/app/api/billing-engine/route.ts` | 调整扣费状态默认值 |

### 需要新建的文件

| 文件 | 功能 |
|------|------|
| `src/app/api/cron/daily/route.ts` | 定时任务入口 |
| `src/app/api/cron/trial-expire/route.ts` | 体验期到期扣费 |
| `src/app/api/cron/billing-retry/route.ts` | 扣费重试 |
| `src/app/api/cron/cancel-execute/route.ts` | 执行取消 |
| `src/app/api/cron/reminder/route.ts` | 到期提醒 |
| `src/app/api/external/etc-billing/instruction/route.ts` | 接收扣费指令 |
| `src/app/api/external/yueyun/webhook/route.ts` | 粤运核销回调 |
| `src/app/api/external/internet/activate/route.ts` | ETC激活通知 |
| `src/app/api/external/internet/cancelled/route.ts` | ETC注销通知 |
| `src/app/api/notify/internet-system/route.ts` | 互联网系统通知 |
| `src/app/api/notify/comprehensive-service/route.ts` | 综合服务系统通知 |
| `vercel.json` | Cron Jobs 配置 |

---

## 六、风险提示

1. **定时任务依赖 Vercel Cron**，本地开发需要手动触发或使用第三方服务
2. **外部系统接口需要鉴权**，目前模拟实现无鉴权
3. **数据一致性**，需要考虑分布式事务或补偿机制
4. **扣费失败重试**，需要避免重复扣费
