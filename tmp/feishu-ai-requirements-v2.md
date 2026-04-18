# 粤通卡ETC会员营销平台 - 需求文档
> 文档版本：V1.0创建日期：2026-04-16文档状态：正式版

---

## 一、项目概述

### 1.1 项目背景

粤通卡ETC会员营销平台，为ETC用户提供会员服务（年卡/月卡/次卡）。用户在ETC申办时可体验会员，收到ETC产品激活后自动扣费开通。平台与粤运系统对接，实现权益服务的闭环管理，通过会员机制实现收入多元化。

### 1.2 项目目标

- 搭建完整业务闭环，覆盖会员全生命周期
- 支持多种付费模式（年卡/月卡/次卡）
- 整合权益服务，对接粤运系统
- 现代SaaS风格界面，适合演示和运营

### 1.3 范围界定

**项目范围（In Scope）**

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      类别
    </lark-td>
    <lark-td>
      功能
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户端
    </lark-td>
    <lark-td>
      会员购买、权益查看、扣费记录、取消退款
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      后台端
    </lark-td>
    <lark-td>
      仪表盘、产品管理、权益管理、订单管理、会员管理、扣费控制、结算对账、系统配置
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      外部对接
    </lark-td>
    <lark-td>
      粤运系统、ETC记账系统、互联网系统、综合服务系统、签约渠道
    </lark-td>
  </lark-tr>
</lark-table>

**项目范围外（Out of Scope）**

- 权益包组合购买
- 权益转赠功能

---

## 二、系统架构

### 2.1 系统清单

<lark-table rows="7" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      系统
    </lark-td>
    <lark-td>
      性质
    </lark-td>
    <lark-td>
      职责
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **营销系统**
    </lark-td>
    <lark-td>
      内部（本项目）
    </lark-td>
    <lark-td>
      会员全生命周期管理：产品、权益、订单、扣费调度
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **互联网系统**
    </lark-td>
    <lark-td>
      内部
    </lark-td>
    <lark-td>
      ETC申办发行、签约管理（通行费签约 + 会员签约）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **综合服务系统**
    </lark-td>
    <lark-td>
      内部
    </lark-td>
    <lark-td>
      只换不修服务（维保期管理）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **ETC记账系统**
    </lark-td>
    <lark-td>
      内部
    </lark-td>
    <lark-td>
      通行费记账扣费、执行扣费指令、管理会员信息
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **签约渠道**
    </lark-td>
    <lark-td>
      外部
    </lark-td>
    <lark-td>
      支付宝/微信/银联，提供签约和扣费能力
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **粤运系统**
    </lark-td>
    <lark-td>
      外部
    </lark-td>
    <lark-td>
      权益服务提供方，开通会员免费期
    </lark-td>
  </lark-tr>
</lark-table>

### 2.2 系统架构图
```plaintext
┌─────────────────────────────────────────────────────────────────────┐
│                           用户层                                      │
│              用户端(H5)  │  管理后台(Web)                             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        互联网系统（内部）                              │
│                        ETC申办发行、签约管理                           │
│                                                                       │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│   │ ETC申办     │    │ 签约管理     │    │ 激活/注销   │             │
│   └─────────────┘    └─────────────┘    └─────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │ 通行费签约         │ 会员签约/解约      │ 激活/注销通知
         ▼                    ▼                    ▼
┌──────────────┐    ┌─────────────────────────────────────────────────┐
│  签约渠道    │    │              营销系统（本项目）                    │
│  （外部）    │    │              会员全生命周期管理                     │
│              │    │                                                  │
│ ┌──────────┐ │    │  ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ 支付宝   │ │    │  │ 产品管理 │ │ 权益管理 │ │ 订单管理 │           │
│ ├──────────┤ │    │  ├─────────┤ ├─────────┤ ├─────────┤           │
│ │ 微信     │ │◄───┼──│ 会员管理 │ │ 扣费引擎 │ │ 定时任务 │           │
│ ├──────────┤ │    │  ├─────────┤ ├─────────┤ ├─────────┤           │
│ │ 银联     │ │    │  │ 通知管理 │ │ 结算对账 │ │ 系统配置 │           │
│ └──────────┘ │    │  └─────────┘ └─────────┘ └─────────┘           │
└──────────────┘    └─────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │ETC记账系统    │   │综合服务系统   │   │ 粤运系统      │
   │（内部）       │   │（内部）       │   │ （外部）      │
   │              │   │              │   │              │
   │通行扣费      │   │只换不修      │   │ 权益服务      │
   │会员信息      │   │维保期管理    │   │ 免费期开通    │
   └──────────────┘   └──────────────┘   └──────────────┘

```

### 2.3 系统交互关系

<lark-table rows="14" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      交互
    </lark-td>
    <lark-td>
      发起方
    </lark-td>
    <lark-td>
      接收方
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ETC申办签约
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      签约渠道
    </lark-td>
    <lark-td>
      ETC申办时完成
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      会员签约
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      签约渠道
    </lark-td>
    <lark-td>
      购买会员时完成
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      会员解约
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      签约渠道
    </lark-td>
    <lark-td>
      会员取消、到期时执行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      扣费执行
    </lark-td>
    <lark-td>
      ETC记账系统
    </lark-td>
    <lark-td>
      签约渠道
    </lark-td>
    <lark-td>
      根据扣费指令执行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ETC激活通知
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      激活成功后通知
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ETC注销通知
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      注销时通知
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      扣费指令
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      ETC记账系统
    </lark-td>
    <lark-td>
      发起扣费请求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      会员信息同步
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      ETC记账系统
    </lark-td>
    <lark-td>
      会员开通/取消时
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通行扣费指令
    </lark-td>
    <lark-td>
      ETC记账系统
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      次卡用户通行时
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      免费期开通
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      粤运系统
    </lark-td>
    <lark-td>
      会员开通时
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      权益核销通知
    </lark-td>
    <lark-td>
      粤运系统
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      提供服务后
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      只换不修开通
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      综合服务系统
    </lark-td>
    <lark-td>
      会员开通时
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      只换不修取消
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      综合服务系统
    </lark-td>
    <lark-td>
      会员取消时
    </lark-td>
  </lark-tr>
</lark-table>

---

## 三、核心业务规则

### 3.1 二次签约机制

用户需要完成两次独立的签约：

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      签约类型
    </lark-td>
    <lark-td>
      触发时机
    </lark-td>
    <lark-td>
      签约内容
    </lark-td>
    <lark-td>
      执行系统
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **ETC申办签约**
    </lark-td>
    <lark-td>
      ETC申办时
    </lark-td>
    <lark-td>
      授权从签约渠道扣取ETC通行费
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      **会员签约**
    </lark-td>
    <lark-td>
      会员体验期结束，购买会员时
    </lark-td>
    <lark-td>
      授权从签约渠道扣取会员费
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
  </lark-tr>
</lark-table>

**签约渠道选项**：支付宝、微信、银联云闪付

### 3.2 激活扣费规则

**核心原则：申办时不扣费，ETC激活时才扣费。**
```plaintext
ETC申办 ──→ 创建订单（不扣费）──→ 收到ETC产品 ──→ 激活 ──→ 扣费开通会员开通体验期会员

```

**扣费金额规则**：

<lark-table rows="4" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      产品类型
    </lark-td>
    <lark-td>
      激活时扣费激活时不扣费
    </lark-td>
    <lark-td>
      后续体验期结束后扣费
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      年卡
    </lark-td>
    <lark-td>
      ¥138（一次性）
    </lark-td>
    <lark-td>
      体验期结束后续费¥138/年
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      月卡
    </lark-td>
    <lark-td>
      ¥16.8（首月）
    </lark-td>
    <lark-td>
      每月¥16.8
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      次卡
    </lark-td>
    <lark-td>
      ¥0（不扣费）
    </lark-td>
    <lark-td>
      体验期结束后每次通行¥1，月封顶¥20
    </lark-td>
  </lark-tr>
</lark-table>

### 3.3 一车一会员

**规则**：每辆车只能购买一个会员产品。

**校验时机**：ETC激活时、会员购买时

**校验逻辑**：

- 检查车牌号是否已有生效中的会员（状态为 TRIAL、ACTIVE、PENDING\_CANCEL）
- 有则拒绝，提示"该车牌已有生效中的会员"

### 3.4 免费体验期

**时长**：61天

**规则**：

- 新会员开通后状态为 TRIAL（体验期）
- 体验期内可随时取消，不产生费用
- 体验期结束前3天、1天发送提醒通知
- 体验期满未取消，自动扣费转正（状态变为 ACTIVE）

**注意事项**：

- 次卡同样享有免费体验期，体验期内不扣通行费
- 取消后再次开通不享受免费体验期

### 3.5 会员取消规则

**取消来源**：

<lark-table rows="5" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      来源
    </lark-td>
    <lark-td>
      代码
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户主动取消
    </lark-td>
    <lark-td>
      USER\_CANCEL
    </lark-td>
    <lark-td>
      用户在前端操作，需5秒倒计时确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      管理员取消
    </lark-td>
    <lark-td>
      ADMIN\_CANCEL
    </lark-td>
    <lark-td>
      后台管理员操作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      扣费失败取消
    </lark-td>
    <lark-td>
      BILLING\_FAILED
    </lark-td>
    <lark-td>
      连续3天扣费失败自动取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ETC注销取消
    </lark-td>
    <lark-td>
      ETC\_CANCELLED
    </lark-td>
    <lark-td>
      ETC设备注销时自动取消
    </lark-td>
  </lark-tr>
</lark-table>

**取消流程**：

- USER\_CANCEL、ADMIN\_CANCEL、BILLING\_FAILED：状态先变为 PENDING\_CANCEL，权益保留至到期日，到期后正式取消
- ETC\_CANCELLED：立即取消，无过渡期

### 3.6 产品类型说明

#### 年卡会员（YEARLY）

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      属性
    </lark-td>
    <lark-td>
      值
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      价格
    </lark-td>
    <lark-td>
      ¥138/年
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      扣费方式
    </lark-td>
    <lark-td>
      一次性扣费
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      有效期
    </lark-td>
    <lark-td>
      12个月
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      体验期
    </lark-td>
    <lark-td>
      61天
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      包含权益
    </lark-td>
    <lark-td>
      粤运拯救（不限金额）、只换不修、中石化年卡权益
    </lark-td>
  </lark-tr>
</lark-table>

#### 月卡会员（MONTHLY）

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      属性
    </lark-td>
    <lark-td>
      值
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      价格
    </lark-td>
    <lark-td>
      ¥16.8/月
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      扣费方式
    </lark-td>
    <lark-td>
      每月扣费
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      有效期
    </lark-td>
    <lark-td>
      1个月（自动续费）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      体验期
    </lark-td>
    <lark-td>
      61天
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      包含权益
    </lark-td>
    <lark-td>
      粤运拯救（单次限额500元）
    </lark-td>
  </lark-tr>
</lark-table>

#### 次卡会员（PER\_USE）

<lark-table rows="7" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      属性
    </lark-td>
    <lark-td>
      值
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      价格
    </lark-td>
    <lark-td>
      ¥1/次
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      扣费方式
    </lark-td>
    <lark-td>
      体验期结束后每次通行扣费
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      月封顶
    </lark-td>
    <lark-td>
      ¥20/月
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      有效期
    </lark-td>
    <lark-td>
      与会员状态同步
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      体验期
    </lark-td>
    <lark-td>
      61天（体验期内不扣通行费）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      包含权益
    </lark-td>
    <lark-td>
      粤运拯救（单次限额500元，年度累计1500元）、高速意外险
    </lark-td>
  </lark-tr>
</lark-table>

---

## 四、业务流程

### 4.1 ETC申办流程

**前置条件**：用户未办理ETC
```plaintext
┌─────────┐     ┌──────────────┐     ┌──────────────┐
│ 用户发起  │────→│ 互联网系统    │────→│ 签约渠道      │
│ ETC申办  │     │ 处理申办      │     │ 通行费签约    │
└─────────┘     └──────────────┘     └──────────────┘
                       │                    │
                       │    签约成功 ◄───────┘
                       ▼
                ┌──────────────┐
                │ ETC申办成功   │
                │ 等待卡签寄达  │
                └──────────────┘

```

**流程步骤**：

<lark-table rows="6" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      步骤
    </lark-td>
    <lark-td>
      执行方
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      用户
    </lark-td>
    <lark-td>
      在互联网系统发起ETC申办
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      选择签约渠道（支付宝/微信/银联）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      3
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      调用签约渠道完成通行费签约
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      4
    </lark-td>
    <lark-td>
      签约渠道
    </lark-td>
    <lark-td>
      返回签约结果
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      5
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      ETC申办成功，等待卡签寄达
    </lark-td>
  </lark-tr>
</lark-table>

---

### 4.2 会员购买流程

**前置条件**：用户已收到ETC卡签并激活
```plaintext
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 用户收到    │────→│ 互联网系统    │────→│ 营销系统      │
│ ETC卡签    │     │ 激活ETC      │     │ 推荐会员产品  │
└─────────────┘     └──────────────┘     └──────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────┐
                    │              用户选择会员产品                  │
                    │              同意协议，确认购买                │
                    └─────────────────────────────────────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 营销系统    │────→│ 互联网系统    │────→│ 签约渠道      │
│ 发起签约    │     │ 会员签约      │     │ 完成签约      │
└─────────────┘     └──────────────┘     └──────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────┐
                    │              签约成功，进入审核                │
                    │              审核通过 → 执行扣费                │
                    │              审核失败 → 订单取消                │
                    └─────────────────────────────────────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 营销系统    │────→│ ETC记账系统   │────→│ 签约渠道      │
│ 发送扣费指令│     │ 执行扣费      │     │ 从账户扣费    │
└─────────────┘     └──────────────┘     └──────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────┐
                    │              扣费成功                         │
                    │              创建会员（TRIAL，61天体验期）       │
                    │              分配权益                          │
                    └─────────────────────────────────────────────┘
                                               │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
            ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
            │综合服务系统   │   │ETC记账系统    │   │ 粤运系统      │
            │只换不修开通  │   │会员信息同步   │   │ 免费期开通    │
            └──────────────┘   └──────────────┘   └──────────────┘

```

**流程步骤**：

<lark-table rows="16" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      步骤
    </lark-td>
    <lark-td>
      执行方
    </lark-td>
    <lark-td>
      操作
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      用户
    </lark-td>
    <lark-td>
      激活ETC
    </lark-td>
    <lark-td>
      在互联网系统完成激活
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      通知营销系统
    </lark-td>
    <lark-td>
      发送ETC激活通知
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      3
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      展示会员产品
    </lark-td>
    <lark-td>
      显示可选的会员套餐
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      4
    </lark-td>
    <lark-td>
      用户
    </lark-td>
    <lark-td>
      选择产品
    </lark-td>
    <lark-td>
      选择年卡/月卡/次卡
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      5
    </lark-td>
    <lark-td>
      用户
    </lark-td>
    <lark-td>
      同意协议
    </lark-td>
    <lark-td>
      勾选会员服务协议
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      6
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      发起会员签约
    </lark-td>
    <lark-td>
      调用互联网系统
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      7
    </lark-td>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      调用签约渠道
    </lark-td>
    <lark-td>
      完成会员签约
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      8
    </lark-td>
    <lark-td>
      签约渠道
    </lark-td>
    <lark-td>
      返回结果
    </lark-td>
    <lark-td>
      签约成功/失败
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      9
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      审核流程
    </lark-td>
    <lark-td>
      审核通过继续，审核失败则订单取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      10
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      发送扣费指令
    </lark-td>
    <lark-td>
      调用ETC记账系统
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      11
    </lark-td>
    <lark-td>
      ETC记账系统
    </lark-td>
    <lark-td>
      执行扣费
    </lark-td>
    <lark-td>
      通过签约渠道扣费
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      12
    </lark-td>
    <lark-td>
      签约渠道
    </lark-td>
    <lark-td>
      返回扣费结果
    </lark-td>
    <lark-td>
      成功/失败
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      13
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      创建会员
    </lark-td>
    <lark-td>
      状态TRIAL，61天体验期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      14
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      分配权益
    </lark-td>
    <lark-td>
      检查总量限制
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      15
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      多方通知
    </lark-td>
    <lark-td>
      综合服务系统、ETC记账系统、粤运系统
    </lark-td>
  </lark-tr>
</lark-table>

**订单状态流转**：
```plaintext
PENDING（待签约）→ PENDING_ACTIVATION（已签约待激活）→ PAID（已支付）
                                                    ↓
                                               CANCELLED（审核失败）

```

---

### 4.3 免费期到期扣费流程

**前置条件**：会员处于 TRIAL 状态，即将满61天
```plaintext
┌─────────────────────────────────────────────────────────────────┐
│                        定时任务检查                               │
│                  到期前3天 ──→ 发送提醒通知                        │
│                  到期前1天 ──→ 发送提醒通知                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │ 免费期结束        │
                    │ （61天后）        │
                    └────────┬─────────┘
                             │
                             ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 营销系统    │────→│ ETC记账系统   │────→│ 签约渠道      │
│ 发送扣费指令│     │ 执行扣费      │     │ 扣取会员费    │
└─────────────┘     └──────────────┘     └──────────────┘
                             │
                             ▼
              ┌──────────────┴──────────────┐
              │                             │
         扣费成功                       扣费失败
              │                             │
              ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ TRIAL → ACTIVE   │          │ 记录失败日志      │
    │ 分配正式权益      │          │ 每日重试          │
    │ 通知粤运转正      │          │ 连续3天失败       │
    └──────────────────┘          │ 自动取消          │
                                  └──────────────────┘

```

**流程步骤**：

<lark-table rows="9" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      步骤
    </lark-td>
    <lark-td>
      触发时机
    </lark-td>
    <lark-td>
      执行方
    </lark-td>
    <lark-td>
      操作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      到期前3天
    </lark-td>
    <lark-td>
      定时任务
    </lark-td>
    <lark-td>
      发送提醒通知
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2
    </lark-td>
    <lark-td>
      到期前1天
    </lark-td>
    <lark-td>
      定时任务
    </lark-td>
    <lark-td>
      发送提醒通知
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      3
    </lark-td>
    <lark-td>
      到期日
    </lark-td>
    <lark-td>
      定时任务
    </lark-td>
    <lark-td>
      发送扣费指令
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      4
    </lark-td>
    <lark-td>
      -
    </lark-td>
    <lark-td>
      ETC记账系统
    </lark-td>
    <lark-td>
      执行扣费
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      5
    </lark-td>
    <lark-td>
      扣费成功
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      状态TRIAL→ACTIVE
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      6
    </lark-td>
    <lark-td>
      扣费成功
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      通知粤运系统
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      7
    </lark-td>
    <lark-td>
      扣费失败
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      记录日志，每日重试
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      8
    </lark-td>
    <lark-td>
      连续3天失败
    </lark-td>
    <lark-td>
      营销系统
    </lark-td>
    <lark-td>
      自动取消会员
    </lark-td>
  </lark-tr>
</lark-table>

**扣费金额**：

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      产品类型
    </lark-td>
    <lark-td>
      扣费金额
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      年卡
    </lark-td>
    <lark-td>
      ¥138（续费一年）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      月卡
    </lark-td>
    <lark-td>
      ¥16.8（续费一个月）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      次卡
    </lark-td>
    <lark-td>
      体验期结束后按次扣费
    </lark-td>
  </lark-tr>
</lark-table>

---

### 4.4 次卡通行扣费流程

**前置条件**：次卡会员，用户驾驶车辆通行高速
```plaintext
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 用户通行    │────→│ ETC记账系统   │────→│ 营销系统      │
│ 高速        │     │ 发送扣费指令  │     │ 校验状态      │
└─────────────┘     └──────────────┘     └──────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────┐
                    │              校验检查                         │
                    │  • 会员状态是否为 TRIAL/ACTIVE                │
                    │  • 产品是否上架                               │
                    │  • 权益是否启用                               │
                    │  • 本月是否已达封顶（¥20）                      │
                    └─────────────────────────────────────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 营销系统    │────→│ ETC记账系统   │────→│ 签约渠道      │
│ 返回扣费金额│     │ 执行扣费      │     │ 扣费          │
└─────────────┘     └──────────────┘     └──────────────┘

```

**扣费计算逻辑**：

<lark-table rows="4" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      扣费金额
    </lark-td>
    <lark-td>
      状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      未封顶
    </lark-td>
    <lark-td>
      ¥1
    </lark-td>
    <lark-td>
      SUCCESS
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      本次扣费后达封顶
    </lark-td>
    <lark-td>
      差额
    </lark-td>
    <lark-td>
      CAPPED
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      已封顶
    </lark-td>
    <lark-td>
      ¥0
    </lark-td>
    <lark-td>
      CAPPED
    </lark-td>
  </lark-tr>
</lark-table>

---

### 4.5 会员取消流程

**前置条件**：会员处于 TRIAL 或 ACTIVE 状态
```plaintext
┌─────────────────────────────────────────────────────────────────┐
│                        取消触发来源                               │
├──────────┬──────────┬──────────────┬─────────────────┤
│ 用户主动  │ 管理后台  │ 扣费引擎自动   │ ETC设备注销     │
│ USER_    │ ADMIN_   │ BILLING_     │ ETC_CANCELLED   │
│ CANCEL   │ CANCEL   │ FAILED       │                 │
└────┬─────┴────┬─────┴──────┬───────┴────────┬────────┘
     │          │            │                │
     └──────────┴────────────┴────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │ 判断取消类型      │
              └────────┬─────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ETC注销        其他原因      （立即取消）
         │             │
         ▼             ▼
┌──────────────┐ ┌──────────────────┐
│ 立即取消      │ │ 状态变为          │
│ CANCELLED    │ │ PENDING_CANCEL   │
│ 权益立即失效  │ │ 权益保留至到期日   │
└──────────────┘ └────────┬─────────┘
                          │
                          ▼
               ┌──────────────────┐
               │ 多方通知          │
               │ • 粤运系统        │
               │ • ETC记账系统     │
               │ • 综合服务系统    │
               │ • 互联网系统      │
               └────────┬─────────┘
                        │
                        ▼（到期日）
               ┌──────────────────┐
               │ 正式取消          │
               │ CANCELLED        │
               │ 解除签约          │
               │ 取消权益          │
               └──────────────────┘

```

**通知清单**：

<lark-table rows="6" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      通知对象
    </lark-td>
    <lark-td>
      通知内容
    </lark-td>
    <lark-td>
      时机
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      粤运系统
    </lark-td>
    <lark-td>
      MEMBER\_CANCELLED
    </lark-td>
    <lark-td>
      取消时立即
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ETC记账系统
    </lark-td>
    <lark-td>
      会员取消信息
    </lark-td>
    <lark-td>
      取消时立即
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      综合服务系统
    </lark-td>
    <lark-td>
      取消只换不修
    </lark-td>
    <lark-td>
      取消时立即
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      互联网系统
    </lark-td>
    <lark-td>
      解除会员签约
    </lark-td>
    <lark-td>
      到期日执行
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户
    </lark-td>
    <lark-td>
      取消确认通知
    </lark-td>
    <lark-td>
      取消时立即
    </lark-td>
  </lark-tr>
</lark-table>

---

### 4.6 权益核销流程

**前置条件**：用户享有粤运拯救权益，使用救援服务
```plaintext
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 用户拨打    │────→│ 粤运系统      │────→│ 提供救援服务  │
│ 救援电话    │     │ 受理请求      │     │              │
└─────────────┘     └──────────────┘     └──────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────┐
                    │              服务完成                         │
                    └─────────────────────────────────────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 粤运系统    │────→│ 营销系统      │────→│ 核销权益      │
│ 发送核销通知│     │ 处理核销      │     │ usedCount+1  │
└─────────────┘     └──────────────┘     └──────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────┐
                    │              usedCount >= totalCount ?       │
                    │              是 → 状态变为 USED               │
                    │              否 → 状态保持 ACTIVE             │
                    └─────────────────────────────────────────────┘

```

---

### 4.7 ETC设备注销流程

**前置条件**：用户主动注销ETC设备
```plaintext
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 用户申请    │────→│ 互联网系统    │────→│ 营销系统      │
│ ETC注销    │     │ 处理注销      │     │ 自动取消会员  │
└─────────────┘     └──────────────┘     └──────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────┐
                    │              会员状态：CANCELLED              │
                    │              cancelReason: ETC_CANCELLED      │
                    │              权益立即失效                       │
                    └─────────────────────────────────────────────┘
                                               │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
            ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
            │ 粤运系统      │   │ETC记账系统    │   │综合服务系统   │
            │ 通知取消      │   │ 会员信息更新  │   │ 取消只换不修  │
            └──────────────┘   └──────────────┘   └──────────────┘

```

---

### 4.8 只换不修流程

**前置条件**：会员享有只换不修权益，ETC设备故障
```plaintext
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 用户ETC设备 │────→│ 综合服务系统  │────→│ 校验维保期    │
│ 故障        │     │ 受理申请      │     │              │
└─────────────┘     └──────────────┘     └──────────────┘
                                               │
                               ┌───────────────┼───────────────┐
                               │                               │
                          维保期内                         维保期外
                               │                               │
                               ▼                               ▼
                    ┌──────────────────┐            ┌──────────────────┐
                    │ 免费更换设备      │            │ 用户自行承担费用  │
                    └──────────────────┘            └──────────────────┘

```

**触发时机**：

<lark-table rows="3" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      事件
    </lark-td>
    <lark-td>
      操作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      会员开通
    </lark-td>
    <lark-td>
      营销系统通知综合服务系统开通权益
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      会员取消
    </lark-td>
    <lark-td>
      营销系统通知综合服务系统取消权益
    </lark-td>
  </lark-tr>
</lark-table>

---

## 五、数据模型

### 5.1 实体关系图
```plaintext
┌─────────┐       ┌─────────┐       ┌─────────────┐
│  User   │───1:N─│ Vehicle │       │MemberProduct│
└────┬────┘       └─────────┘       └──────┬──────┘
     │                                    │
     │1:N                          M:N    │
     │                                    │
     ▼                                    ▼
┌─────────┐       ┌─────────┐       ┌─────────────┐
│  Order  │       │ Member  │───────│ProductRight │
└─────────┘       └────┬────┘       └─────────────┘
                       │                    │
                       │1:N                 │
                       │                    ▼
                       ▼              ┌─────────┐
                ┌────────────┐        │  Right  │
                │BillingRecord│        └────┬────┘
                └────────────┘             │
                                           │1:N
                                           ▼
                                    ┌──────────┐
                                    │UserRight │
                                    └────┬─────┘
                                         │1:N
                                         ▼
                                  ┌────────────┐
                                  │ RightUsage │
                                  └────────────┘

```

### 5.2 User（用户）

<lark-table rows="9" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键，自动生成
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      phone
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      手机号，唯一
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      name
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      姓名
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      plateNumber
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      车牌号
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      plateColor
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      车牌颜色：BLUE/YELLOW/GREEN
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      idNumber
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      证件号码，同步给粤运
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      updatedAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
  </lark-tr>
</lark-table>

**关联关系**：

- 一对多：Vehicle（车辆）
- 一对多：Order（订单）
- 一对多：Member（会员）

### 5.3 Vehicle（车辆）

<lark-table rows="7" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      userId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      关联用户ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      plateNumber
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      车牌号
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      plateColor
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      车牌颜色
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      isPrimary
    </lark-td>
    <lark-td>
      Boolean
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      是否主车辆，默认false
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
</lark-table>

### 5.4 MemberProduct（会员产品）

<lark-table rows="11" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      name
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      产品名称
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      type
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      类型：YEARLY/MONTHLY/PER\_USE
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      price
    </lark-td>
    <lark-td>
      Float
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      价格（元）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      description
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      产品描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      effectiveStartTime
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      生效起始时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      effectiveEndTime
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      生效结束时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      isActive
    </lark-td>
    <lark-td>
      Boolean
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      是否上架，默认true
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      updatedAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
  </lark-tr>
</lark-table>

### 5.5 Right（权益）

<lark-table rows="10" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      name
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      权益名称
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      description
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      权益描述
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      totalLimit
    </lark-td>
    <lark-td>
      Integer
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      总量控制，null表示不限制
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      currentTotal
    </lark-td>
    <lark-td>
      Integer
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      已发放总量，默认0
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      detailHtml
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      权益详情HTML
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      isActive
    </lark-td>
    <lark-td>
      Boolean
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      是否启用，默认true
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      updatedAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
  </lark-tr>
</lark-table>

### 5.6 ProductRight（产品权益关联）

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      productId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      产品ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      rightId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      权益ID
    </lark-td>
  </lark-tr>
</lark-table>

**联合主键**：\[productId, rightId]

### 5.7 Order（订单）

<lark-table rows="19" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      userId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      用户ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      productId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      产品ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      amount
    </lark-td>
    <lark-td>
      Float
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      订单金额
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      status
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      订单状态，默认PENDING
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      payMethod
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      支付方式：WECHAT/ALIPAY/UNIONPAY
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      channel
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      签约渠道：WECHAT/ALIPAY/UNIONPAY
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      isSigned
    </lark-td>
    <lark-td>
      Boolean
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      是否已签约，默认false
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      isActivated
    </lark-td>
    <lark-td>
      Boolean
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      是否已激活，默认false
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      auditStatus
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      审核状态：PENDING/APPROVED/REJECTED
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      auditAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      审核时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      auditBy
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      审核人
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      auditRemark
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      审核备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      agreementAccepted
    </lark-td>
    <lark-td>
      Boolean
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      是否同意协议，默认false
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      activatedAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      激活时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      paidAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      支付时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      updatedAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
  </lark-tr>
</lark-table>

**订单状态**：

<lark-table rows="7" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING
    </lark-td>
    <lark-td>
      待签约
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING\_ACTIVATION
    </lark-td>
    <lark-td>
      已签约待激活
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PAID
    </lark-td>
    <lark-td>
      已支付
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      COMPLETED
    </lark-td>
    <lark-td>
      已完成
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      CANCELLED
    </lark-td>
    <lark-td>
      已取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      REFUNDED
    </lark-td>
    <lark-td>
      已退款
    </lark-td>
  </lark-tr>
</lark-table>

**审核状态**：

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING
    </lark-td>
    <lark-td>
      待审核
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      APPROVED
    </lark-td>
    <lark-td>
      审核通过
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      REJECTED
    </lark-td>
    <lark-td>
      审核拒绝
    </lark-td>
  </lark-tr>
</lark-table>

### 5.8 Member（会员）

<lark-table rows="15" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      userId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      用户ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      productId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      产品ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      status
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      会员状态，默认TRIAL
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      startDate
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      开始日期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      endDate
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      结束日期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      isTrial
    </lark-td>
    <lark-td>
      Boolean
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      是否体验期，默认true
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      cancelReason
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      取消原因
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      cancelAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      取消时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      warrantyEndDate
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      维保到期日期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      plateNumber
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      绑定车牌
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      plateColor
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      车牌颜色
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      updatedAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
  </lark-tr>
</lark-table>

**会员状态**：

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TRIAL
    </lark-td>
    <lark-td>
      体验期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ACTIVE
    </lark-td>
    <lark-td>
      正式会员
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING\_CANCEL
    </lark-td>
    <lark-td>
      待取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      CANCELLED
    </lark-td>
    <lark-td>
      已取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      EXPIRED
    </lark-td>
    <lark-td>
      已过期
    </lark-td>
  </lark-tr>
</lark-table>

**取消原因**：

<lark-table rows="5" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      原因
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      USER\_CANCEL
    </lark-td>
    <lark-td>
      用户主动取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ADMIN\_CANCEL
    </lark-td>
    <lark-td>
      管理员取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      BILLING\_FAILED
    </lark-td>
    <lark-td>
      扣费失败取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ETC\_CANCELLED
    </lark-td>
    <lark-td>
      ETC注销取消
    </lark-td>
  </lark-tr>
</lark-table>

### 5.9 UserRight（用户权益）

<lark-table rows="12" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      userId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      用户ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      rightId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      权益ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      memberId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      会员ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      status
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      状态，默认ACTIVE
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      totalCount
    </lark-td>
    <lark-td>
      Integer
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      总次数，默认1
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      usedCount
    </lark-td>
    <lark-td>
      Integer
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      已用次数，默认0
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      expireAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      过期时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      rightDisabledAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      权益禁用时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      updatedAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
  </lark-tr>
</lark-table>

**状态说明**：

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ACTIVE
    </lark-td>
    <lark-td>
      可用
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      USED
    </lark-td>
    <lark-td>
      已用完
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      EXPIRED
    </lark-td>
    <lark-td>
      已过期
    </lark-td>
  </lark-tr>
</lark-table>

### 5.10 RightUsage（权益核销记录）

<lark-table rows="7" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      userRightId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      用户权益ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      type
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      核销类型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      description
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      operator
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      操作人
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
</lark-table>

**核销类型**：

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      RESCUE
    </lark-td>
    <lark-td>
      粤运拯救
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      REPLACE
    </lark-td>
    <lark-td>
      只换不修
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      INSURANCE
    </lark-td>
    <lark-td>
      高速意外险
    </lark-td>
  </lark-tr>
</lark-table>

### 5.11 BillingRecord（扣费记录）

<lark-table rows="8" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      memberId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      会员ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      amount
    </lark-td>
    <lark-td>
      Float
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      扣费金额
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      type
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      类型，默认MEMBERSHIP\_FEE
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      status
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      状态，**默认PENDING**
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      remark
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
</lark-table>

**扣费类型**：

<lark-table rows="3" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      MEMBERSHIP\_FEE
    </lark-td>
    <lark-td>
      会员费
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TOLL\_FEE
    </lark-td>
    <lark-td>
      通行费
    </lark-td>
  </lark-tr>
</lark-table>

**扣费状态**：

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING
    </lark-td>
    <lark-td>
      待处理
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      SUCCESS
    </lark-td>
    <lark-td>
      成功
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      FAILED
    </lark-td>
    <lark-td>
      失败
    </lark-td>
  </lark-tr>
</lark-table>

### 5.12 BillingLog（扣费日志）

<lark-table rows="10" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      userId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      用户ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      memberId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      会员ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      type
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      类型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      amount
    </lark-td>
    <lark-td>
      Float
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      金额
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      status
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      reason
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      原因
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      month
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      月份，格式YYYY-MM
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
</lark-table>

**状态说明**：

<lark-table rows="5" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      SUCCESS
    </lark-td>
    <lark-td>
      成功
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      FAILED
    </lark-td>
    <lark-td>
      失败
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING
    </lark-td>
    <lark-td>
      待处理
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      CAPPED
    </lark-td>
    <lark-td>
      已封顶
    </lark-td>
  </lark-tr>
</lark-table>

### 5.13 Notification（通知记录）

<lark-table rows="10" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      userId
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      用户ID
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      type
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      通知类型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      title
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      标题
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      content
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      channel
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      渠道：SMS/PUSH/IN\_APP
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      status
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      状态，默认PENDING
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      sentAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      发送时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
</lark-table>

**通知类型**：

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TRIAL\_EXPIRING
    </lark-td>
    <lark-td>
      体验期即将到期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      BILLING\_REMINDER
    </lark-td>
    <lark-td>
      扣费提醒
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      BILLING\_FAILED
    </lark-td>
    <lark-td>
      扣费失败
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      CANCEL\_CONFIRM
    </lark-td>
    <lark-td>
      取消确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      MEMBER\_STATUS\_CHANGE
    </lark-td>
    <lark-td>
      会员状态变更
    </lark-td>
  </lark-tr>
</lark-table>

### 5.14 SystemConfig（系统配置）

<lark-table rows="8" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      key
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      配置键，唯一
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      value
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      配置值
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      description
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      category
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      分类，默认GENERAL
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      updatedAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
  </lark-tr>
</lark-table>

**分类**：BILLING（扣费）、MEMBER（会员）、GENERAL（通用）

### 5.15 Settlement（结算记录）

<lark-table rows="8" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填 {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      id
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      主键
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      type
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      类型：INCOME/EXPENSE
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      amount
    </lark-td>
    <lark-td>
      Float
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      金额
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      description
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      {align="center"}
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      status
    </lark-td>
    <lark-td>
      String
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      状态，默认PENDING
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      createdAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      创建时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      updatedAt
    </lark-td>
    <lark-td>
      DateTime
    </lark-td>
    <lark-td>
      ✓ {align="center"}
    </lark-td>
    <lark-td>
      更新时间
    </lark-td>
  </lark-tr>
</lark-table>

---

## 六、接口设计

### 6.1 内部API

#### 6.1.1 用户模块

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/users
    </lark-td>
    <lark-td>
      查询用户列表
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/users
    </lark-td>
    <lark-td>
      创建用户
    </lark-td>
    <lark-td>
      phone, name, plateNumber, plateColor, idNumber
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.2 产品模块

<lark-table rows="4" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/products
    </lark-td>
    <lark-td>
      查询产品列表
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/products
    </lark-td>
    <lark-td>
      创建产品
    </lark-td>
    <lark-td>
      name, type, price, description, rightIds\[]
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PATCH
    </lark-td>
    <lark-td>
      /api/products
    </lark-td>
    <lark-td>
      更新产品
    </lark-td>
    <lark-td>
      id, isActive, rightIds\[]
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.3 权益模块

<lark-table rows="4" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/rights
    </lark-td>
    <lark-td>
      查询权益列表
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/rights
    </lark-td>
    <lark-td>
      创建权益
    </lark-td>
    <lark-td>
      name, description, totalLimit, detailHtml
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PATCH
    </lark-td>
    <lark-td>
      /api/rights
    </lark-td>
    <lark-td>
      更新权益
    </lark-td>
    <lark-td>
      id, isActive
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.4 订单模块

<lark-table rows="6" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/orders
    </lark-td>
    <lark-td>
      查询订单
    </lark-td>
    <lark-td>
      userId?, status?
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/orders
    </lark-td>
    <lark-td>
      创建订单
    </lark-td>
    <lark-td>
      userId, productId, amount, channel, agreementAccepted
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PATCH
    </lark-td>
    <lark-td>
      /api/orders
    </lark-td>
    <lark-td>
      更新订单
    </lark-td>
    <lark-td>
      id, status
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/orders/sign
    </lark-td>
    <lark-td>
      会员签约
    </lark-td>
    <lark-td>
      orderId
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/orders/audit
    </lark-td>
    <lark-td>
      订单审核
    </lark-td>
    <lark-td>
      orderId, status(APPROVED/REJECTED), remark?
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.5 激活模块

<lark-table rows="2" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/activate
    </lark-td>
    <lark-td>
      ETC激活
    </lark-td>
    <lark-td>
      orderId, plateNumber?, plateColor?
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.6 会员模块

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/members
    </lark-td>
    <lark-td>
      查询会员
    </lark-td>
    <lark-td>
      userId?
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/members/cancel
    </lark-td>
    <lark-td>
      取消会员
    </lark-td>
    <lark-td>
      memberId, cancelReason, operator?
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.7 用户权益模块

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/user-rights
    </lark-td>
    <lark-td>
      查询用户权益
    </lark-td>
    <lark-td>
      userId?, status?
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PATCH
    </lark-td>
    <lark-td>
      /api/user-rights
    </lark-td>
    <lark-td>
      核销权益
    </lark-td>
    <lark-td>
      id, action(use/expire), type?, description?, operator?
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.8 扣费引擎模块

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/billing-engine
    </lark-td>
    <lark-td>
      扣费操作
    </lark-td>
    <lark-td>
      action, ...
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/billing-engine
    </lark-td>
    <lark-td>
      查询扣费日志
    </lark-td>
    <lark-td>
      userId?, month?, status?
    </lark-td>
  </lark-tr>
</lark-table>

**扣费操作类型**：

<lark-table rows="6" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      action
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      calculate\_per\_use
    </lark-td>
    <lark-td>
      计算次卡扣费
    </lark-td>
    <lark-td>
      userId
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      execute\_billing
    </lark-td>
    <lark-td>
      执行扣费
    </lark-td>
    <lark-td>
      userId, memberId, type, amount
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      check\_consecutive\_failures
    </lark-td>
    <lark-td>
      检查连续失败
    </lark-td>
    <lark-td>
      memberId
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      check\_monthly\_cap
    </lark-td>
    <lark-td>
      检查月封顶
    </lark-td>
    <lark-td>
      userId
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      monthly\_stats
    </lark-td>
    <lark-td>
      月度统计
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.9 统计模块

<lark-table rows="2" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/stats
    </lark-td>
    <lark-td>
      仪表盘数据
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.10 结算模块

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/settlements
    </lark-td>
    <lark-td>
      查询结算记录
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/settlements
    </lark-td>
    <lark-td>
      创建结算记录
    </lark-td>
    <lark-td>
      type, amount, description
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.1.11 系统配置模块

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GET
    </lark-td>
    <lark-td>
      /api/config
    </lark-td>
    <lark-td>
      查询配置
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PATCH
    </lark-td>
    <lark-td>
      /api/config
    </lark-td>
    <lark-td>
      更新配置
    </lark-td>
    <lark-td>
      configs\[{key, value}]
    </lark-td>
  </lark-tr>
</lark-table>

### 6.2 外部系统接口

#### 6.2.1 接收互联网系统通知

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/external/internet/activate
    </lark-td>
    <lark-td>
      ETC激活通知
    </lark-td>
    <lark-td>
      userId, plateNumber, plateColor
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/external/internet/cancelled
    </lark-td>
    <lark-td>
      ETC注销通知
    </lark-td>
    <lark-td>
      userId, plateNumber
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.2.2 接收ETC记账系统指令

<lark-table rows="3" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/external/etc-billing/instruction
    </lark-td>
    <lark-td>
      通行扣费指令
    </lark-td>
    <lark-td>
      userId, plateNumber, passTime, tollAmount
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/external/etc-billing/callback
    </lark-td>
    <lark-td>
      扣费结果回调
    </lark-td>
    <lark-td>
      billingId, status, amount
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.2.3 接收粤运系统通知

<lark-table rows="2" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      方法
    </lark-td>
    <lark-td>
      路径
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      参数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST
    </lark-td>
    <lark-td>
      /api/external/yueyun/webhook
    </lark-td>
    <lark-td>
      权益核销通知
    </lark-td>
    <lark-td>
      userId, rightType, useTime, description
    </lark-td>
  </lark-tr>
</lark-table>

### 6.3 调用外部系统

#### 6.3.1 粤运系统

<lark-table rows="4" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      接口
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      触发时机
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST /yueyun/member/activate
    </lark-td>
    <lark-td>
      开通免费期
    </lark-td>
    <lark-td>
      会员扣费成功后
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST /yueyun/member/convert
    </lark-td>
    <lark-td>
      免费期转正
    </lark-td>
    <lark-td>
      TRIAL→ACTIVE时
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST /yueyun/member/cancel
    </lark-td>
    <lark-td>
      会员取消
    </lark-td>
    <lark-td>
      会员取消时
    </lark-td>
  </lark-tr>
</lark-table>

**请求参数**：
```json
{
  "memberId": "xxx",
  "userId": "xxx",
  "plateNumber": "粤A12345",
  "plateColor": "BLUE",
  "action": "MEMBER_ACTIVATED",
  "timestamp": "2026-04-16T10:00:00Z"
}

```

#### 6.3.2 ETC记账系统

<lark-table rows="3" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      接口
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      触发时机
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST /etc-billing/charge
    </lark-td>
    <lark-td>
      扣费指令
    </lark-td>
    <lark-td>
      各扣费场景
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST /etc-billing/member
    </lark-td>
    <lark-td>
      会员信息
    </lark-td>
    <lark-td>
      会员状态变更
    </lark-td>
  </lark-tr>
</lark-table>

**扣费指令请求**：
```json
{
  "memberId": "xxx",
  "userId": "xxx",
  "channel": "ALIPAY",
  "amount": 138,
  "type": "MEMBERSHIP_FEE",
  "reason": "年卡会员费"
}

```

#### 6.3.3 综合服务系统

<lark-table rows="3" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      接口
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      触发时机
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST /comprehensive/warranty/open
    </lark-td>
    <lark-td>
      开通只换不修
    </lark-td>
    <lark-td>
      会员开通时
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST /comprehensive/warranty/cancel
    </lark-td>
    <lark-td>
      取消只换不修
    </lark-td>
    <lark-td>
      会员取消时
    </lark-td>
  </lark-tr>
</lark-table>

#### 6.3.4 互联网系统

<lark-table rows="3" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      接口
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      触发时机
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST /internet/sign
    </lark-td>
    <lark-td>
      会员签约请求
    </lark-td>
    <lark-td>
      购买会员时
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      POST /internet/unbind
    </lark-td>
    <lark-td>
      解约请求
    </lark-td>
    <lark-td>
      会员取消到期时
    </lark-td>
  </lark-tr>
</lark-table>

---

## 七、页面功能

### 7.1 用户端

#### 7.1.1 首页（/）

**功能**：会员产品展示、开通入口

**布局**：

- 顶部蓝色渐变横幅：粤通卡会员服务
- 产品列表：3个会员产品卡片
- 每个卡片：产品名、描述、价格、权益列表、操作按钮

**按钮状态**：

<lark-table rows="4" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      按钮文案
    </lark-td>
    <lark-td>
      操作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      所有用户都有生效会员
    </lark-td>
    <lark-td>
      "已开通会员"（禁用）
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      有待激活订单
    </lark-td>
    <lark-td>
      "待激活，查看订单"
    </lark-td>
    <lark-td>
      跳转会员页
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      无会员无待激活订单
    </lark-td>
    <lark-td>
      "立即开通"
    </lark-td>
    <lark-td>
      跳转购买页
    </lark-td>
  </lark-tr>
</lark-table>

#### 7.1.2 购买页（/purchase）

**功能**：选择产品、签约渠道、同意协议

**内容**：

- 会员套餐卡片
- 签约渠道选择（支付宝/微信/银联）
- 协议勾选
- 底部固定操作栏

**提示文案**：

- 申办成功后，收到ETC产品激活时自动扣费
- 扣费成功后开通2个月免费体验期并通知粤运
- 体验期内可随时取消，不产生费用
- 体验期满未取消将自动续费扣款

**拦截逻辑**：

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      条件
    </lark-td>
    <lark-td>
      提示
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      已有生效会员
    </lark-td>
    <lark-td>
      "您已有生效中的会员"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      有待激活订单
    </lark-td>
    <lark-td>
      "您有待激活的申办订单"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      未勾选协议
    </lark-td>
    <lark-td>
      弹出协议弹窗
    </lark-td>
  </lark-tr>
</lark-table>

#### 7.1.3 我的会员页（/member）

**功能**：会员状态、权益、取消

**会员卡内容**：

- 产品名 + 车牌号 + 状态徽章
- 三栏数据：剩余天数 | 开通日期 | 到期日期
- 体验期提示："🎉 免费体验期中，到期后自动扣费"
- 待取消提示："会员取消中，权益保留至到期日"

**功能入口**：

- 权益中心
- 取消会员服务（红色按钮）

**取消确认弹窗**：

- 警告图标 + "确认取消会员服务？"
- 取消说明（4条）
- 5秒倒计时确认

#### 7.1.4 权益中心（/rights）

**功能**：权益列表、使用记录

**内容**：

- 可用权益列表：权益名、描述、剩余次数、过期时间
- 已用/过期权益列表
- 权益详情弹窗（HTML展示）

#### 7.1.5 扣费记录（/billing）

**功能**：扣费明细

**内容**：

- 扣费记录列表：会员费/通行费、金额、状态、时间

### 7.2 管理后台

**通用布局**：左侧固定侧边栏 + 右侧主内容区

#### 7.2.1 仪表盘（/admin）

**功能**：核心数据展示

**内容**：

- 4个统计卡片：总用户数、会员总数、总收入、本月收入
- 会员产品分布图
- 最近扣费记录

#### 7.2.2 产品管理（/admin/products）

**功能**：产品CRUD、上下架

**列表字段**：名称、类型、价格、描述、状态、操作

**表单字段**：名称、类型、价格、描述、关联权益（多选）

#### 7.2.3 权益管理（/admin/rights）

**功能**：权益CRUD、启用禁用

**列表字段**：名称、描述、总量控制、已发放、状态、操作

**表单字段**：名称、描述、totalLimit、detailHtml（带预览）

#### 7.2.4 权益核销（/admin/usages）

**功能**：核销操作

**内容**：

- 统计：可用权益数、已用权益数、总核销次数
- 可用权益列表 + 核销操作
- 已用/过期权益列表

#### 7.2.5 订单管理（/admin/orders）

**功能**：订单查询、审核、退款

**列表字段**：订单号、用户、产品、金额、状态、创建时间、操作

**操作**：

- 待审核订单：审核按钮
- 已支付订单：退款按钮

#### 7.2.6 会员管理（/admin/members）

**功能**：会员列表、取消

**列表字段**：用户、车牌、产品、状态、有效期、剩余天数、操作

#### 7.2.7 扣费控制（/admin/billing-control）

**功能**：扣费测试、日志查询

**内容**：

- 月度扣费统计
- 扣费计算测试工具
- 扣费日志列表

#### 7.2.8 结算对账（/admin/settlement）

**功能**：收支报表

**内容**：

- 统计卡片：总收入/总支出/净利润/待处理金额
- 结算记录列表
- 新增结算记录

#### 7.2.9 系统配置（/admin/settings）

**功能**：参数配置

**配置项**：

- 次卡月封顶金额
- 次卡单次扣费金额
- 免费体验期天数
- 单次救援限额
- 年度累计救援限额

---

## 八、定时任务

### 8.1 任务列表

<lark-table rows="6" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      任务
    </lark-td>
    <lark-td>
      执行时间
    </lark-td>
    <lark-td>
      Cron
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      到期提醒
    </lark-td>
    <lark-td>
      09:00
    </lark-td>
    <lark-td>
      0 9 \* \* \*
    </lark-td>
    <lark-td>
      体验期前3天/1天发送提醒
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      体验期到期扣费
    </lark-td>
    <lark-td>
      10:00
    </lark-td>
    <lark-td>
      0 10 \* \* \*
    </lark-td>
    <lark-td>
      检查即将到期会员，触发扣费
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      扣费重试
    </lark-td>
    <lark-td>
      10:30
    </lark-td>
    <lark-td>
      30 10 \* \* \*
    </lark-td>
    <lark-td>
      重试扣费失败的会员
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING\_CANCEL执行
    </lark-td>
    <lark-td>
      11:00
    </lark-td>
    <lark-td>
      0 11 \* \* \*
    </lark-td>
    <lark-td>
      到期日执行取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      会员状态检查
    </lark-td>
    <lark-td>
      12:00
    </lark-td>
    <lark-td>
      0 12 \* \* \*
    </lark-td>
    <lark-td>
      检查到期会员，更新状态
    </lark-td>
  </lark-tr>
</lark-table>

### 8.2 任务逻辑

#### 8.2.1 到期提醒
```plaintext
查询条件：
- 会员状态 = TRIAL
- 剩余天数 = 3 或 1

操作：
- 创建通知记录
- 发送短信/推送

```

#### 8.2.2 体验期到期扣费
```plaintext
查询条件：
- 会员状态 = TRIAL
- endDate = 今天

操作：
- 发送扣费指令给ETC记账系统
- 扣费成功：TRIAL → ACTIVE，通知粤运
- 扣费失败：记录失败日志

```

#### 8.2.3 扣费重试
```plaintext
查询条件：
- BillingRecord.status = FAILED
- createdAt >= 3天内

操作：
- 重新发送扣费指令
- 更新扣费状态
- 连续3天失败：自动取消会员

```

#### 8.2.4 PENDING\_CANCEL执行
```plaintext
查询条件：
- 会员状态 = PENDING_CANCEL
- endDate = 今天

操作：
- 通知互联网系统解除签约
- 取消权益（状态变为EXPIRED）
- 会员状态变为CANCELLED

```

#### 8.2.5 会员状态检查
```plaintext
查询条件：
- 会员状态 = ACTIVE 或 TRIAL
- endDate < 今天

操作：
- 状态变为EXPIRED
- 权益状态变为EXPIRED

```

---

## 九、异常处理

### 9.1 业务异常

<lark-table rows="7" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      场景
    </lark-td>
    <lark-td>
      处理方式
    </lark-td>
    <lark-td>
      用户提示
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      签约失败
    </lark-td>
    <lark-td>
      订单取消
    </lark-td>
    <lark-td>
      "签约失败，请重新尝试"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      审核失败
    </lark-td>
    <lark-td>
      订单取消
    </lark-td>
    <lark-td>
      "审核未通过，原因：xxx"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      扣费失败
    </lark-td>
    <lark-td>
      记录日志，每日重试
    </lark-td>
    <lark-td>
      "扣费失败，将在次日重试"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      连续3天扣费失败
    </lark-td>
    <lark-td>
      自动取消会员
    </lark-td>
    <lark-td>
      "扣费连续失败，会员已取消"
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      权益分配失败（总量限制）
    </lark-td>
    <lark-td>
      跳过该权益
    </lark-td>
    <lark-td>
      不影响其他权益
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      一车一会员校验失败
    </lark-td>
    <lark-td>
      拒绝激活
    </lark-td>
    <lark-td>
      "该车牌已有生效中的会员"
    </lark-td>
  </lark-tr>
</lark-table>

### 9.2 系统异常

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      场景
    </lark-td>
    <lark-td>
      处理方式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      粤运通知失败
    </lark-td>
    <lark-td>
      记录日志，不影响主流程，后续补偿
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ETC记账系统通知失败
    </lark-td>
    <lark-td>
      记录日志，重试机制
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      综合服务系统通知失败
    </lark-td>
    <lark-td>
      记录日志，不影响主流程
    </lark-td>
  </lark-tr>
</lark-table>

### 9.3 补偿机制

<lark-table rows="3" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      场景
    </lark-td>
    <lark-td>
      补偿方式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      扣费成功但会员创建失败
    </lark-td>
    <lark-td>
      回滚扣费或手动创建会员
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      通知外部系统失败
    </lark-td>
    <lark-td>
      定时重试 + 人工介入
    </lark-td>
  </lark-tr>
</lark-table>

---

## 十、配置项

### 10.1 扣费配置

<lark-table rows="4" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      配置键
    </lark-td>
    <lark-td>
      默认值
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      monthly\_cap
    </lark-td>
    <lark-td>
      20
    </lark-td>
    <lark-td>
      次卡月度封顶金额（元）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      per\_use\_fee
    </lark-td>
    <lark-td>
      1
    </lark-td>
    <lark-td>
      次卡单次扣费金额（元）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      trial\_days
    </lark-td>
    <lark-td>
      61
    </lark-td>
    <lark-td>
      免费体验期天数
    </lark-td>
  </lark-tr>
</lark-table>

### 10.2 权益配置

<lark-table rows="3" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      配置键
    </lark-td>
    <lark-td>
      默认值
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      rescue\_limit\_per\_use
    </lark-td>
    <lark-td>
      500
    </lark-td>
    <lark-td>
      次卡单次救援限额（元）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      rescue\_limit\_yearly
    </lark-td>
    <lark-td>
      1500
    </lark-td>
    <lark-td>
      次卡年度累计救援限额（元）
    </lark-td>
  </lark-tr>
</lark-table>

---

## 十一、附录

### 11.1 状态码速查

#### 订单状态

<lark-table rows="7" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      中文名
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING
    </lark-td>
    <lark-td>
      待签约
    </lark-td>
    <lark-td>
      订单创建，等待签约
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING\_ACTIVATION
    </lark-td>
    <lark-td>
      已签约待激活
    </lark-td>
    <lark-td>
      签约成功，等待激活
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PAID
    </lark-td>
    <lark-td>
      已支付
    </lark-td>
    <lark-td>
      激活扣费成功
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      COMPLETED
    </lark-td>
    <lark-td>
      已完成
    </lark-td>
    <lark-td>
      会员期结束
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      CANCELLED
    </lark-td>
    <lark-td>
      已取消
    </lark-td>
    <lark-td>
      审核失败/用户取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      REFUNDED
    </lark-td>
    <lark-td>
      已退款
    </lark-td>
    <lark-td>
      退款完成
    </lark-td>
  </lark-tr>
</lark-table>

#### 会员状态

<lark-table rows="6" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      中文名
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      TRIAL
    </lark-td>
    <lark-td>
      体验期
    </lark-td>
    <lark-td>
      61天免费体验
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ACTIVE
    </lark-td>
    <lark-td>
      正式会员
    </lark-td>
    <lark-td>
      已转正
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING\_CANCEL
    </lark-td>
    <lark-td>
      待取消
    </lark-td>
    <lark-td>
      权益保留至到期日
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      CANCELLED
    </lark-td>
    <lark-td>
      已取消
    </lark-td>
    <lark-td>
      正式取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      EXPIRED
    </lark-td>
    <lark-td>
      已过期
    </lark-td>
    <lark-td>
      到期未续费
    </lark-td>
  </lark-tr>
</lark-table>

#### 权益状态

<lark-table rows="4" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      中文名
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ACTIVE
    </lark-td>
    <lark-td>
      可用
    </lark-td>
    <lark-td>
      权益可用
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      USED
    </lark-td>
    <lark-td>
      已用完
    </lark-td>
    <lark-td>
      次数用完
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      EXPIRED
    </lark-td>
    <lark-td>
      已过期
    </lark-td>
    <lark-td>
      过期失效
    </lark-td>
  </lark-tr>
</lark-table>

#### 扣费状态

<lark-table rows="5" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      中文名
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PENDING
    </lark-td>
    <lark-td>
      待处理
    </lark-td>
    <lark-td>
      初始状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      SUCCESS
    </lark-td>
    <lark-td>
      成功
    </lark-td>
    <lark-td>
      扣费成功
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      FAILED
    </lark-td>
    <lark-td>
      失败
    </lark-td>
    <lark-td>
      扣费失败
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      CAPPED
    </lark-td>
    <lark-td>
      已封顶
    </lark-td>
    <lark-td>
      达到月封顶
    </lark-td>
  </lark-tr>
</lark-table>

### 11.2 枚举值速查

#### 产品类型

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      值
    </lark-td>
    <lark-td>
      中文名
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      YEARLY
    </lark-td>
    <lark-td>
      年卡
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      MONTHLY
    </lark-td>
    <lark-td>
      月卡
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      PER\_USE
    </lark-td>
    <lark-td>
      次卡
    </lark-td>
  </lark-tr>
</lark-table>

#### 签约渠道

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      值
    </lark-td>
    <lark-td>
      中文名
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ALIPAY
    </lark-td>
    <lark-td>
      支付宝
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      WECHAT
    </lark-td>
    <lark-td>
      微信
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      UNIONPAY
    </lark-td>
    <lark-td>
      银联云闪付
    </lark-td>
  </lark-tr>
</lark-table>

#### 车牌颜色

<lark-table rows="4" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      值
    </lark-td>
    <lark-td>
      中文名
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      BLUE
    </lark-td>
    <lark-td>
      蓝色
    </lark-td>
    <lark-td>
      小型车
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      YELLOW
    </lark-td>
    <lark-td>
      黄色
    </lark-td>
    <lark-td>
      大型车
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      GREEN
    </lark-td>
    <lark-td>
      绿色
    </lark-td>
    <lark-td>
      新能源车
    </lark-td>
  </lark-tr>
</lark-table>

#### 取消原因

<lark-table rows="5" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      值
    </lark-td>
    <lark-td>
      中文名
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      USER\_CANCEL
    </lark-td>
    <lark-td>
      用户取消
    </lark-td>
    <lark-td>
      用户主动取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ADMIN\_CANCEL
    </lark-td>
    <lark-td>
      管理员取消
    </lark-td>
    <lark-td>
      后台操作取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      BILLING\_FAILED
    </lark-td>
    <lark-td>
      扣费失败
    </lark-td>
    <lark-td>
      连续3天扣费失败
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ETC\_CANCELLED
    </lark-td>
    <lark-td>
      ETC注销
    </lark-td>
    <lark-td>
      ETC设备注销
    </lark-td>
  </lark-tr>
</lark-table>

#### 核销类型

<lark-table rows="4" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      值
    </lark-td>
    <lark-td>
      中文名
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      RESCUE
    </lark-td>
    <lark-td>
      粤运拯救
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      REPLACE
    </lark-td>
    <lark-td>
      只换不修
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      INSURANCE
    </lark-td>
    <lark-td>
      高速意外险
    </lark-td>
  </lark-tr>
</lark-table>

### 11.3 种子数据

#### 权益数据

<lark-table rows="5" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      名称
    </lark-td>
    <lark-td>
      描述
    </lark-td>
    <lark-td>
      totalLimit
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      粤运拯救
    </lark-td>
    <lark-td>
      省内高速救援服务，享1次免费救援
    </lark-td>
    <lark-td>
      100000
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      只换不修
    </lark-td>
    <lark-td>
      ETC设备故障免费更换，含往返邮寄
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      高速意外险
    </lark-td>
    <lark-td>
      最高560万保额保障
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      中石化年卡权益
    </lark-td>
    <lark-td>
      易捷满减券、加油/充电/洗车折扣
    </lark-td>
    <lark-td>
      -
    </lark-td>
  </lark-tr>
</lark-table>

#### 产品数据

<lark-table rows="4" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      名称
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      价格
    </lark-td>
    <lark-td>
      包含权益
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      年卡会员
    </lark-td>
    <lark-td>
      YEARLY
    </lark-td>
    <lark-td>
      ¥138
    </lark-td>
    <lark-td>
      粤运拯救、只换不修、中石化年卡权益
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      月卡会员
    </lark-td>
    <lark-td>
      MONTHLY
    </lark-td>
    <lark-td>
      ¥16.8
    </lark-td>
    <lark-td>
      粤运拯救
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      次卡会员
    </lark-td>
    <lark-td>
      PER\_USE
    </lark-td>
    <lark-td>
      ¥1
    </lark-td>
    <lark-td>
      粤运拯救、高速意外险
    </lark-td>
  </lark-tr>
</lark-table>

#### 用户数据

<lark-table rows="5" cols="5" header-row="true" column-widths="146,146,146,146,146">

  <lark-tr>
    <lark-td>
      姓名
    </lark-td>
    <lark-td>
      手机号
    </lark-td>
    <lark-td>
      车牌号
    </lark-td>
    <lark-td>
      车牌颜色
    </lark-td>
    <lark-td>
      会员状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      张三
    </lark-td>
    <lark-td>
      13800138001
    </lark-td>
    <lark-td>
      粤A12345
    </lark-td>
    <lark-td>
      BLUE
    </lark-td>
    <lark-td>
      年卡 ACTIVE
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      李四
    </lark-td>
    <lark-td>
      13800138002
    </lark-td>
    <lark-td>
      粤B67890
    </lark-td>
    <lark-td>
      BLUE
    </lark-td>
    <lark-td>
      月卡 TRIAL
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      王五
    </lark-td>
    <lark-td>
      13800138003
    </lark-td>
    <lark-td>
      粤C11111
    </lark-td>
    <lark-td>
      GREEN
    </lark-td>
    <lark-td>
      次卡 TRIAL
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      赵六
    </lark-td>
    <lark-td>
      13800138004
    </lark-td>
    <lark-td>
      粤D88888
    </lark-td>
    <lark-td>
      BLUE
    </lark-td>
    <lark-td>
      无会员
    </lark-td>
  </lark-tr>
</lark-table>

---

## 文档历史

<lark-table rows="2" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      版本
    </lark-td>
    <lark-td>
      日期
    </lark-td>
    <lark-td>
      修改内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      V1.0
    </lark-td>
    <lark-td>
      2026-04-16
    </lark-td>
    <lark-td>
      初版，整合系统交互说明，完整业务流程
    </lark-td>
  </lark-tr>
</lark-table>

