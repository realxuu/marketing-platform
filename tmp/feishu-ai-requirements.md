# 粤通卡ETC会员营销平台 - 业务需求文档

---

## 一、项目背景

粤通卡ETC会员营销平台，为ETC用户提供会员服务（年卡/月卡/次卡），用户在ETC申办时体验会员，收到ETC产品激活后自动扣费开通。平台与粤运系统对接，实现权益服务的闭环管理。

---

## 二、核心业务规则

### 2.1  激活扣费

**申办时不扣费，ETC激活时才扣费。**

- 用户在ETC发行时选择签约渠道和会员产品，仅创建订单（不扣费、不开通会员），需增加签约环节，原需求还有中心化产品的签约流程，此处并未体现。
- 用户收到ETC产品后进行激活，此时通过签约渠道扣费（<text bgcolor="light-yellow">需区分年卡、次卡和月卡3种不同的扣费模式）</text>
- 扣费成功：开通会员（2个月免费体验期）→ 分配权益 <text bgcolor="light-yellow">（权益分配失败如何处理？）</text>→ 通知粤运<text bgcolor="light-yellow">（粤运通知失败如何处理？）——>增加环节通知ETC记账系统</text>
- 扣费失败：不创建会员，记录失败

### 2.2 一车一会员

每辆车只能购买一个会员产品。激活时校验车牌是否已有生效中的会员（TRIAL/ACTIVE/PENDING\_CANCEL），有则拒绝激活。（此处应该放在2.1的第一个步骤，校验唯一性之后再让用户选择签约渠道和会员）

### 2.3 免费体验期

新会员开通后享受61天免费体验期（状态为TRIAL）（免费期是61天还是2个月？），体验期内可随时取消不产生费用。体验期满未取消（原需求是有到期提醒和轮扣环境，此处并未体现），系统自动从签约渠道扣取会员费，扣费成功后状态变为ACTIVE。

### 2.4 会员产品类型

<lark-table rows="4" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      说明
    </lark-td>
    <lark-td>
      扣费方式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      年卡（YEARLY）
    </lark-td>
    <lark-td>
      年度会员
    </lark-td>
    <lark-td>
      一次性扣费¥138/年
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      月卡（MONTHLY）
    </lark-td>
    <lark-td>
      月度会员
    </lark-td>
    <lark-td>
      每月扣费¥16.8/月
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      次卡（PER\_USE）
    </lark-td>
    <lark-td>
      按次计费
    </lark-td>
    <lark-td>
      每次通行扣费¥1/次，月封顶¥20
    </lark-td>
  </lark-tr>
</lark-table>

---

## 三、业务流程图

### 3.1 会员申办流程

应该是先选择签约渠道，判断签约渠道是否支持购买会员，如果支持，在通行费签约完成后，让用户选择会员产品，同意服务协议，创建订单、二次调用签约。签约完成后订单待审核，进入后续审核流程，审核失败了应该如何处理？订单取消应该如何处理？
```plaintext
┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  用户进入  │───→│  选择会员产品  │───→│  选择签约渠道  │───→│  同意服务协议  │
│   首页    │    │  (年卡/月卡/   │    │ (支付宝/微信/  │    │              │
│          │    │   次卡)       │    │  银联云闪付)   │    │              │
└─────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘
                                                               │
                                                               ▼
                                                    ┌──────────────────┐
                                                    │    确认申办        │
                                                    │ 创建订单           │
                                                    │ 状态:待激活        │
                                                    │ 不扣费 不开通会员   │
                                                    └────────┬─────────┘
                                                             │
                                                             ▼
                                                    ┌──────────────────┐
                                                    │    申办成功        │
                                                    │ "收到ETC产品激活后  │
                                                    │  自动扣费开通会员"  │
                                                    └──────────────────┘

```

### 3.2 ETC激活流程

权益激活是应该在硬件激活之前还是硬件激活之后？

```plaintext
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│ 用户收到ETC  │───→│   ETC激活     │───→│  校验订单状态  │
│   产品      │    │              │    │  (未激活)     │
└─────────────┘    └──────────────┘    └──────┬───────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │  校验车牌唯一性    │
                                    │  (一车一会员)      │
                                    └────┬────────┬────┘
                                         │        │
                                    通过  │        │ 不通过
                                         ▼        ▼
                               ┌──────────┐  ┌──────────────┐
                               │ 签约渠道  │  │ 拒绝激活      │
                               │  扣费    │  │ "该车牌已有    │
                               └──┬───┬──┘  │ 生效中的会员"  │
                                  │   │      └──────────────┘
                             成功 │   │ 失败
                                  ▼   ▼
                    ┌────────────┐  ┌──────────────┐
                    │ 创建会员    │  │ 记录失败日志   │
                    │ 状态:TRIAL  │  │ 不创建会员     │
                    │ 61天体验期  │  └──────────────┘
                    └─────┬──────┘
                          │
                          ▼
                    ┌────────────┐
                    │ 分配用户权益 │
                    │ (检查总量    │
                    │  限制)      │
                    └─────┬──────┘
                          │
                          ▼
                    ┌────────────┐    ┌──────────────┐
                    │ 更新订单    │───→│   通知粤运     │
                    │ 状态:PAID  │    │ MEMBER_       │
                    │ 已激活     │    │ ACTIVATED     │
                    └────────────┘    └──────────────┘

```

### 3.3 会员取消流程

待取消是为了啥
```plaintext
┌──────────────────────────────────────────────────────┐
│                    取消触发来源                         │
├──────────┬──────────┬──────────────┬─────────────────┤
│ 用户主动  │ 管理后台  │ 扣费引擎自动   │  ETC设备注销    │
│ USER_    │ ADMIN_   │ BILLING_     │  ETC_CANCELLED  │
│ CANCEL   │ CANCEL   │ FAILED       │                 │
└────┬─────┴────┬─────┴──────┬───────┴────────┬────────┘
     │          │            │                │
     └──────────┴────────────┴────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  会员状态变为      │
              │  PENDING_CANCEL   │
              │  (待取消)         │
              └────────┬─────────┘
                       │
              ┌────────┴─────────┐
              │                  │
              ▼                  ▼
    ┌──────────────┐  ┌──────────────┐
    │ 创建取消确认   │  │   通知粤运     │
    │ 通知          │  │ MEMBER_       │
    │              │  │ CANCELLED     │
    └──────────────┘  └──────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ 权益保留至到期日    │
              │ 到期后正式取消      │
              └──────────────────┘

```

### 3.4 扣费引擎流程

#### 次卡通行扣费

增加接受ETC记账系统的扣费指令

校验产品状态还是会员状态？成功如何处理，失败如何处理？

扣费失败如何处理？
```plaintext
┌───────────┐    ┌──────────────┐    ┌──────────────┐
│ 用户通行    │───→│  计算扣费金额  │───→│  校验产品状态  │
│ 高速       │    │  (¥1/次)     │    │  (上架+权益   │
│           │    │              │    │   启用)       │
└───────────┘    └──────────────┘    └──────┬───────┘
                                            │
                                            ▼
                                 ┌──────────────────┐
                                 │  检查月封顶        │
                                 │  (¥20/月)         │
                                 └──┬──────────┬────┘
                                    │          │
                               未封顶│          │已封顶
                                    ▼          ▼
                          ┌──────────┐  ┌──────────────┐
                          │ 正常扣费  │  │ 扣费¥0或差额  │
                          │ SUCCESS  │  │ CAPPED       │
                          └──────────┘  └──────────────┘

```

#### 会员费扣费（体验期结束）

没有到期提醒功能，除了通知粤运，还需要取消权益，这里丢了？

更新字段没有备注表名，增加表名
```plaintext
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  体验期结束    │───→│  签约渠道扣费  │───→│   扣费结果     │
│  (61天后)     │    │  会员费       │    │              │
└──────────────┘    └──────────────┘    └──┬───────┬───┘
                                            │       │
                                       成功  │       │ 失败
                                            ▼       ▼
                                  ┌──────────┐ ┌──────────────┐
                                  │TRIAL→    │ │ 记录失败日志   │
                                  │ACTIVE    │ │ 进入重试       │
                                  └──────────┘ └──────┬───────┘
                                                      │
                                                      ▼
                                           ┌──────────────────┐
                                           │ 连续3天扣费失败？  │
                                           └──┬──────────┬────┘
                                              │          │
                                          否  │          │ 是
                                              ▼          ▼
                                    ┌──────────┐  ┌──────────────┐
                                    │ 继续重试  │  │ 自动取消会员   │
                                    │          │  │ PENDING_CANCEL│
                                    └──────────┘  │ cancelReason: │
                                                  │ BILLING_     │
                                                  │ FAILED       │
                                                  └──────┬───────┘
                                                         │
                                                         ▼
                                                  ┌──────────────┐
                                                  │   通知粤运     │
                                                  │ BILLING_      │
                                                  │ FAILED_CANCEL │
                                                  └──────────────┘

```

### 3.5 权益核销流程

管理员核销是从哪里冒出来的？

粤语权益核销应该是由粤运通知，

只换不修服务应该在ETC更换环节处理
```plaintext
┌───────────┐    ┌──────────────┐    ┌──────────────┐
│ 用户使用    │───→│  管理员核销    │───→│ usedCount+1  │
│ 权益       │    │  (选择类型/    │    │              │
│           │    │   操作人/备注) │    │              │
└───────────┘    └──────────────┘    └──────┬───────┘
                                            │
                                            ▼
                                 ┌──────────────────┐
                                 │ usedCount >=      │
                                 │ totalCount ?      │
                                 └──┬──────────┬────┘
                                    │          │
                                否  │          │ 是
                                    ▼          ▼
                          ┌──────────┐  ┌──────────────┐
                          │ 继续可用  │  │ 状态变为USED  │
                          └──────────┘  └──────────────┘

```

### 3.6 权益禁用与保留流程

```plaintext
┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 管理员禁用    │───→│ right.isActive   │───→│ 已有用户的        │
│ 权益         │    │ = false          │    │ UserRight标记     │
│             │    │                  │    │ rightDisabledAt   │
└──────────────┘    └──────────────────┘    └────────┬─────────┘
                                                      │
                             ┌─────────────────────────┼──────────────────┐
                             │                                            │
                             ▼                                            ▼
                   ┌──────────────────┐                       ┌──────────────────┐
                   │ 旧会员权益保留    │                       │ 新用户不再分配     │
                   │ 至会员期结束      │                       │ 该权益            │
                   │ (通过rightDisabled│                       │                  │
                   │  At判断)         │                       │                  │
                   └──────────────────┘                       └──────────────────┘

```

---

## 四、数据模型

### 4.1 User（用户）

<lark-table rows="7" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
    </lark-td>
    <lark-td>
      主键
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
      是
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
      否
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
      否
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
      否
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
      否
    </lark-td>
    <lark-td>
      证件号码，同步给粤运
    </lark-td>
  </lark-tr>
</lark-table>

### 4.2 Vehicle（车辆）

一车一会员，为什么要配置是否主车辆？

<lark-table rows="6" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
    </lark-td>
    <lark-td>
      关联用户
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
      是
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
      是
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
      否
    </lark-td>
    <lark-td>
      是否主车辆，默认false
    </lark-td>
  </lark-tr>
</lark-table>

### 4.3 MemberProduct（会员产品）

生效起始时间应该是有开始时间和结束时间

<lark-table rows="8" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
    </lark-td>
    <lark-td>
      产品名称，如"年卡会员"
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
      是
    </lark-td>
    <lark-td>
      YEARLY/MONTHLY/PER\_USE
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
      是
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
      否
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
      否
    </lark-td>
    <lark-td>
      生效起始时间
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
      否
    </lark-td>
    <lark-td>
      是否上架，默认true
    </lark-td>
  </lark-tr>
</lark-table>

**产品与权益为多对多关系**，通过 ProductRight 关联表连接。（睁眼说瞎话，表在哪里？）

### 4.4 Right（权益）

<lark-table rows="8" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
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
      否
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
      否
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
      否
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
      否
    </lark-td>
    <lark-td>
      权益详情展示HTML（点击权益时弹窗展示）
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
      否
    </lark-td>
    <lark-td>
      是否启用，默认true
    </lark-td>
  </lark-tr>
</lark-table>

### 4.5 Order（订单）

需增加订单状态标识是否已签约

<lark-table rows="12" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
    </lark-td>
    <lark-td>
      关联用户
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
      是
    </lark-td>
    <lark-td>
      关联产品
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
      是
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
      否
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
      否
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
      否
    </lark-td>
    <lark-td>
      签约渠道：WECHAT/ALIPAY/UNIONPAY
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
      否
    </lark-td>
    <lark-td>
      是否已激活，默认false
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
      否
    </lark-td>
    <lark-td>
      激活时间
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
      否
    </lark-td>
    <lark-td>
      是否同意协议，默认false
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
      否
    </lark-td>
    <lark-td>
      支付时间
    </lark-td>
  </lark-tr>
</lark-table>

**订单状态流转：**

待签约、已签约待支付、已支付待激活、已完成、已取消
```plaintext
PENDING → PENDING_ACTIVATION → PAID
                                ↓
                            CANCELLED / REFUNDED

```

- PENDING：待支付
- PENDING\_ACTIVATION：待激活（申办成功后的状态，尚未扣费）
- PAID：已支付（激活扣费成功后）
- CANCELLED：已取消
- REFUNDED：已退款

### 4.6 Member（会员）

会员表可以跟用户表合并

<lark-table rows="13" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
    </lark-td>
    <lark-td>
      关联用户
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
      是
    </lark-td>
    <lark-td>
      关联产品
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
      否
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
      是
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
      是
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
      否
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
      否
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
      否
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
      否
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
      否
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
      否
    </lark-td>
    <lark-td>
      车牌颜色
    </lark-td>
  </lark-tr>
</lark-table>

**会员状态流转：**

PENDING_CANCEL ，CANCELLED，EXPIRED的区别是？
```plaintext
TRIAL ──(体验期结束扣费成功)──→ ACTIVE
  │                              │
  │                              └──(申请取消)──→ PENDING_CANCEL ──(到期)──→ CANCELLED
  │
  └──(申请取消)──→ PENDING_CANCEL ──(到期)──→ CANCELLED

TRIAL/ACTIVE ──(到期未续费)──→ EXPIRED
TRIAL/ACTIVE ──(扣费连续3天失败)──→ PENDING_CANCEL

```

**取消原因：**

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
      用户主动取消（前端5秒倒计时确认）
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ADMIN\_CANCEL
    </lark-td>
    <lark-td>
      后台管理员取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      BILLING\_FAILED
    </lark-td>
    <lark-td>
      扣费引擎检测连续3天扣费失败自动取消
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      ETC\_CANCELLED
    </lark-td>
    <lark-td>
      ETC设备注销
    </lark-td>
  </lark-tr>
</lark-table>

### 4.7 UserRight（用户权益）

权益需增加生效时间

其中权益状态status=used有啥用？

<lark-table rows="10" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
    </lark-td>
    <lark-td>
      关联用户
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
      是
    </lark-td>
    <lark-td>
      关联权益
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
      是
    </lark-td>
    <lark-td>
      关联会员
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
      否
    </lark-td>
    <lark-td>
      ACTIVE/USED/EXPIRED，默认ACTIVE
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
      否
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
      否
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
      是
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
      否
    </lark-td>
    <lark-td>
      权益被禁用的时间（旧会员保留权益至会员期结束）
    </lark-td>
  </lark-tr>
</lark-table>

### 4.8 RightUsage（权益核销记录）

各枚举值代表什么意思？

<lark-table rows="6" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
    </lark-td>
    <lark-td>
      关联用户权益
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
      是
    </lark-td>
    <lark-td>
      核销类型：RESCUE/REPLACE/INSURANCE
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
      否
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
      否
    </lark-td>
    <lark-td>
      操作人
    </lark-td>
  </lark-tr>
</lark-table>

### 4.9 BillingRecord（扣费记录）

扣费状态为什么会默认成功？

<lark-table rows="7" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
    </lark-td>
    <lark-td>
      关联会员
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
      是
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
      否
    </lark-td>
    <lark-td>
      MEMBERSHIP\_FEE/TOLL\_FEE，默认MEMBERSHIP\_FEE
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
      否
    </lark-td>
    <lark-td>
      SUCCESS/FAILED/PENDING，默认SUCCESS
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
      否
    </lark-td>
    <lark-td>
      备注
    </lark-td>
  </lark-tr>
</lark-table>

### 4.10 BillingLog（扣费日志）

跟扣费记录的区别是啥

<lark-table rows="9" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
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
      否
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
      是
    </lark-td>
    <lark-td>
      MEMBERSHIP\_FEE/PER\_USE\_FEE
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
      是
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
      是
    </lark-td>
    <lark-td>
      SUCCESS/FAILED/PENDING/CAPPED
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
      否
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
      是
    </lark-td>
    <lark-td>
      月份，格式YYYY-MM
    </lark-td>
  </lark-tr>
</lark-table>

### 4.11 Settlement（结算记录）

<lark-table rows="6" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
    </lark-td>
    <lark-td>
      INCOME/EXPENSE
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
      是
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
      否
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
      否
    </lark-td>
    <lark-td>
      PENDING/COMPLETED，默认PENDING
    </lark-td>
  </lark-tr>
</lark-table>

### 4.12 Notification（通知记录）

<lark-table rows="9" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
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
      是
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
      是
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
      是
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
      是
    </lark-td>
    <lark-td>
      SMS/PUSH/IN\_APP
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
      否
    </lark-td>
    <lark-td>
      PENDING/SENT/FAILED，默认PENDING
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
      否
    </lark-td>
    <lark-td>
      发送时间
    </lark-td>
  </lark-tr>
</lark-table>

**通知类型：** TRIAL\_EXPIRING / BILLING\_REMINDER / BILLING\_FAILED / CANCEL\_CONFIRM / MEMBER\_STATUS\_CHANGE

### 4.13 SystemConfig（系统配置）

<lark-table rows="6" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      必填
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
      自动
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
      是
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
      是
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
      否
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
      否
    </lark-td>
    <lark-td>
      BILLING/MEMBER/GENERAL，默认GENERAL
    </lark-td>
  </lark-tr>
</lark-table>

**预置配置项：**

<lark-table rows="6" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      key
    </lark-td>
    <lark-td>
      默认值
    </lark-td>
    <lark-td>
      分类
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
      BILLING
    </lark-td>
    <lark-td>
      次卡月度封顶金额
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
      BILLING
    </lark-td>
    <lark-td>
      次卡单次扣费金额
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
      MEMBER
    </lark-td>
    <lark-td>
      免费体验期天数
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
      GENERAL
    </lark-td>
    <lark-td>
      次卡单次救援限额
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
      GENERAL
    </lark-td>
    <lark-td>
      次卡年度累计救援限额
    </lark-td>
  </lark-tr>
</lark-table>

---

## 五、API接口（需增加外部接口ETC记账系统、综合服务系统、粤运接口）

### 5.1 用户模块 {folded="true"}

#### GET /api/users

查询所有用户，包含会员和产品信息。

#### POST /api/users

创建用户。
```json
{ "phone": "13800138001", "name": "张三", "plateNumber": "粤A12345", "plateColor": "BLUE", "idNumber": "440101199001011234" }

```

### 5.2 产品模块 {folded="true"}

#### GET /api/products

查询所有会员产品，包含关联权益。

#### POST /api/products

创建产品。
```json
{ "name": "年卡会员", "type": "YEARLY", "price": 138, "description": "粤运拯救服务1次 + 中石化年卡权益", "effectiveStartTime": "2026-04-15T00:00:00Z", "isActive": true, "rightIds": ["权益ID1", "权益ID2"] }

```

#### PATCH /api/products

更新产品。支持上架/下架、更新关联权益（先删后增）。

### 5.3 权益模块 {folded="true"}

#### GET /api/rights

查询所有权益，包含关联产品和用户权益。

#### POST /api/rights

创建权益。
```json
{ "name": "粤运拯救", "description": "省内高速救援服务", "totalLimit": 100000, "detailHtml": "<h3>粤运拯救服务</h3><p>...</p>", "isActive": true }

```

#### PATCH /api/rights

更新权益。禁用权益时，标记关联 UserRight 的 rightDisabledAt。

### 5.4 订单模块 {folded="true"}

#### GET /api/orders?userId=\&status=

查询订单，支持按用户ID和状态筛选。

#### POST /api/orders

创建订单（申办）。status 自动设为 PENDING\_ACTIVATION，isActivated 为 false，不扣费。
```json
{ "userId": "用户ID", "productId": "产品ID", "amount": 138, "payMethod": "ALIPAY", "channel": "ALIPAY", "agreementAccepted": true }

```

#### PATCH /api/orders

更新订单状态。退款时自动将关联用户权益设为过期。

### 5.5 激活模块 {folded="true"}

#### POST /api/activate

ETC激活，扣费并开通会员。
```json
{ "orderId": "订单ID" }

```

**处理步骤：**

1. 查询订单（含用户和产品权益信息）
1. 校验订单未激活
1. 从用户信息获取车牌号和车牌颜色
1. 校验车牌唯一性（一车一会员）
1. 创建会员记录（TRIAL，61天体验期）
1. 分配用户权益（检查总量限制，达到上限的权益跳过）
1. 更新订单状态为PAID，isActivated=true
1. 通知粤运（action: MEMBER\_ACTIVATED）

### 5.6 会员模块 {folded="true"}

#### GET /api/members?userId=

查询会员列表，包含用户、产品（含权益）、扣费记录。

#### PATCH /api/members/cancel

取消会员。
```json
{ "memberId": "会员ID", "cancelReason": "USER_CANCEL" }

```

**处理步骤：**

1. 校验取消原因合法性（USER\_CANCEL/ADMIN\_CANCEL/BILLING\_FAILED/ETC\_CANCELLED）
1. 校验会员未被取消
1. 更新会员状态为PENDING\_CANCEL，记录取消原因和时间
1. 创建取消确认通知
1. 通知粤运（action: MEMBER\_CANCELLED）

### 5.7 用户权益模块

#### GET /api/user-rights?userId=\&status=

查询用户权益，含权益详情和使用记录。

#### PATCH /api/user-rights

核销或过期权益。
```json
// 核销
{ "id": "用户权益ID", "action": "use", "type": "RESCUE", "description": "高速救援", "operator": "admin" }
// 过期
{ "id": "用户权益ID", "action": "expire" }

```

核销逻辑：usedCount+1，usedCount >= totalCount 时状态变为USED。

### 5.8 扣费引擎模块

#### POST /api/billing-engine

**计算次卡扣费：**
```json
{ "userId": "用户ID", "action": "calculate_per_use" }

```

返回：扣费金额、状态（SUCCESS/CAPPED）、月累计、月封顶、剩余额度。扣费前校验产品上架和权益启用状态。

**执行扣费：**
```json
{ "userId": "用户ID", "memberId": "会员ID", "action": "execute_billing", "type": "PER_USE_FEE", "amount": 1 }

```

创建BillingLog和BillingRecord记录。

**检查连续扣费失败：**
```json
{ "memberId": "会员ID", "action": "check_consecutive_failures" }

```

检查最近3天内失败次数，>=3次自动取消会员并通知粤运（action: BILLING\_FAILED\_CANCEL）。

**检查月封顶状态：**
```json
{ "userId": "用户ID", "action": "check_monthly_cap" }

```

**月度扣费统计：**
```json
{ "action": "monthly_stats" }

```

#### GET /api/billing-engine?userId=\&month=\&status=

查询扣费日志，支持按用户/月份/状态筛选。

### 5.9 粤运通知模块

#### POST /api/notify/yueyun

通知粤运系统。

**通知类型及参数：**

会员激活：
```json
{ "memberId": "会员ID", "action": "MEMBER_ACTIVATED", "plateNumber": "粤A12345", "plateColor": "BLUE", "userId": "用户ID" }

```

会员取消：
```json
{ "memberId": "会员ID", "action": "MEMBER_CANCELLED", "plateNumber": "粤A12345", "plateColor": "BLUE", "cancelReason": "USER_CANCEL", "cancelAt": "2026-04-15T10:00:00Z" }

```

扣费失败取消：
```json
{ "memberId": "会员ID", "action": "BILLING_FAILED_CANCEL", "plateNumber": "粤A12345", "cancelReason": "BILLING_FAILED" }

```

### 5.10 统计模块

#### GET /api/stats

返回仪表盘数据：总用户数、会员总数、活跃/体验期会员数、总收入、本月收入、产品分布、最近10条扣费记录。

### 5.11 结算模块

#### GET /api/settlements

查询结算记录并计算汇总（总收入/总支出/净利润/待处理金额）。

#### POST /api/settlements

创建结算记录。
```json
{ "type": "INCOME", "amount": 154.8, "description": "会员费收入", "status": "COMPLETED" }

```

### 5.12 系统配置模块

#### GET /api/config

获取所有系统配置，按分类（BILLING/MEMBER/GENERAL）分组。

#### PATCH /api/config

批量更新配置项。

---

## 六、页面交互

### 6.1 用户端

#### 6.1.1 首页

**布局：** 移动端优先，max-w-md居中，底部固定三栏导航

**内容：**

1. 顶部蓝色渐变横幅：粤通卡会员服务标题 + 描述
1. 产品列表：3个会员产品卡片（年卡¥138/年、月卡¥16.8/月、次卡¥1/次）
1. 每个卡片：产品名、描述、价格、包含权益列表、操作按钮

**按钮状态：**

- 所有用户都有生效会员 → "已开通会员"（禁用灰色）
- 有待激活订单 → "待激活，查看订单"（跳转会员页）
- 无会员无待激活订单 → "立即开通"（跳转购买页）

#### 6.1.2 购买/申办页

**布局：** 移动端卡片式，底部固定操作栏

**内容：**

1. 会员套餐卡片：产品名、描述、价格、包含权益（可点击查看详情弹窗）
1. 签约渠道选择：支付宝/微信支付/银联云闪付，三选一单选，默认支付宝
1. 协议勾选：必须同意《会员服务协议》才能申办
1. 底部固定栏：申办金额（蓝色）+ "确认申办"按钮

**提示文字：**

- 申办成功后，收到ETC产品激活时自动扣费
- 扣费成功后开通2个月免费体验期并通知粤运
- 体验期内可随时取消，不产生费用
- 体验期满未取消将自动续费扣款

**拦截逻辑：**

- 已有生效会员 → "您已有生效中的会员"提示页
- 有待激活订单 → "您有待激活的申办订单"提示页
- 未勾选协议 → 弹出协议弹窗

**申办成功页：**

- 标题："申办成功"
- 描述："您已选择XX会员"
- 提示："收到ETC产品激活后自动扣费开通会员"
- 按钮："查看我的会员"

#### 6.1.3 我的会员页

**布局：** 顶部蓝色渐变会员卡 + 下方功能区域

**会员卡内容：**

- 多车牌切换（下拉选择器，仅多车时显示）
- 产品名 + 车牌号 + 状态徽章
- 三栏数据：剩余天数 | 开通日期(yyyy/MM/dd) | 到期日期(yyyy/MM/dd)
- 体验期提示："🎉 免费体验期中，到期后自动扣费"
- 待取消提示："会员取消中，权益保留至到期日"

**无会员时：** "您还未开通会员" + "立即开通"按钮

**待激活订单区域：**

- 蓝色边框卡片，显示产品名、申办时间、签约渠道
- "模拟ETC激活（演示）"按钮
- 提示："收到ETC产品后激活，自动扣费开通会员"

**功能区域：**

- 权益中心入口
- 取消会员服务按钮（红色，仅非取消/非过期状态显示）

**取消确认弹窗：**

- 警告图标 + "确认取消会员服务？"
- 4条取消说明
- "再想想" / "确认取消"按钮
- **5秒倒计时**：确认取消按钮5秒内禁用，显示"请阅读 (Ns)"

#### 6.1.4 权益中心页

- 可用权益列表：权益名、描述、剩余次数、过期时间
- 已用/过期权益列表
- 点击有detailHtml的权益 → 弹窗展示HTML详情
- 使用记录展示

#### 6.1.5 扣费记录页

- 扣费记录列表：会员费/通行费、金额、状态、时间、关联产品

### 6.2 管理后台

**通用布局：** 左侧固定侧边栏(w-64) + 右侧主内容区

**侧边栏导航：** 仪表盘、产品管理、权益管理、权益核销、订单管理、会员管理、扣费控制、结算对账、底部"返回用户端"链接

#### 仪表盘

- 4个统计卡片：总用户数、会员总数（体验期/正式）、总收入、本月收入
- 最近扣费记录列表
- 会员产品分布图
- "重置演示数据"按钮（红色，右上角，二次确认后清除所有数据并重新种子）

#### 产品管理

- 产品列表 + 新增/编辑/上下架
- 表格：名称、类型、价格、描述、生效时间、状态、操作
- 表单：名称、类型（YEARLY/MONTHLY/PER\_USE）、价格、描述、生效时间、关联权益（多选）

#### 权益管理

- 权益列表 + 新增/编辑/启用禁用
- 表格：名称、描述、总量控制、已发放、详情、状态、关联产品、操作
- 表单：名称、描述、totalLimit、detailHtml（带预览按钮）
- 禁用权益时标记已有UserRight的rightDisabledAt

#### 权益核销

- 统计：可用权益数、已用权益数、总核销次数
- 可用权益表格 + 核销操作（选择类型/操作人/备注）
- 已用/过期权益列表

#### 订单管理

- 表格：订单号、用户、产品、金额、签约渠道、状态、激活状态、创建时间、操作
- 待激活订单：显示"激活"按钮
- 已支付订单：显示"退款"按钮

#### 会员管理

- 表格：用户、车牌、产品、状态、有效期、剩余天数、维保到期、取消信息、操作
- 取消会员：5秒倒计时确认弹窗，选择取消原因

#### 扣费控制

- 月度扣费统计卡片
- 扣费计算测试工具
- 扣费日志表格（支持按月份/状态筛选）

#### 结算对账

- 统计卡片：总收入/总支出/净利润/待处理金额
- 新增结算记录（收入/支出）
- 结算记录列表

---

## 七、种子数据

### 7.1 权益（4个）

<lark-table rows="5" cols="4" header-row="true" column-widths="183,183,183,183">

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
    <lark-td>
      detailHtml
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
    <lark-td>
      有（含服务说明HTML）
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
      null
    </lark-td>
    <lark-td>
      有（含服务说明HTML）
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
      null
    </lark-td>
    <lark-td>
      无
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
      null
    </lark-td>
    <lark-td>
      有（含权益详情HTML）
    </lark-td>
  </lark-tr>
</lark-table>

### 7.2 产品（3个）

<lark-table rows="4" cols="5" header-row="true" column-widths="146,146,146,146,146">

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
      描述
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
      138
    </lark-td>
    <lark-td>
      粤运拯救服务1次 + 中石化年卡权益
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
      16.8
    </lark-td>
    <lark-td>
      粤运拯救服务1次（最高500元）
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
      1
    </lark-td>
    <lark-td>
      每次通行享省内高速救援1次
    </lark-td>
    <lark-td>
      粤运拯救、高速意外险
    </lark-td>
  </lark-tr>
</lark-table>

### 7.3 用户（4个）

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
      无会员（用于演示申办流程）
    </lark-td>
  </lark-tr>
</lark-table>

### 7.4 其他种子数据

- 3条已支付已激活订单（张三/李四/王五各一条）
- 用户权益记录（对应各会员的权益）
- 扣费记录（张三年卡138元、李四月卡16.8元）
- 结算记录（收入154.8元、支出29.9元待处理）
- 系统配置（5项）
