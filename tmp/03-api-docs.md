# 粤通卡ETC营销平台 - API文档

## 一、用户相关

### GET /api/users
获取用户列表

**参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 否 | 手机号搜索 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |

### POST /api/users
创建用户

**请求体**：
```json
{
  "phone": "13800138000",
  "name": "张三",
  "plateNumber": "粤A12345"
}
```

## 二、产品相关

### GET /api/products
获取产品列表

### POST /api/products
创建产品

**请求体**：
```json
{
  "name": "年卡会员",
  "type": "YEARLY",
  "price": 138,
  "description": "年卡会员产品",
  "duration": 365
}
```

## 三、订单相关

### GET /api/orders
获取订单列表

**参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 订单状态筛选 |
| userId | string | 否 | 用户ID筛选 |

### POST /api/orders
创建订单

**请求体**：
```json
{
  "userId": "user_id",
  "productId": "product_id",
  "payMethod": "WECHAT"
}
```

## 四、会员相关

### GET /api/members
获取会员列表

**参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 会员状态筛选 |
| userId | string | 否 | 用户ID筛选 |

## 五、权益相关

### GET /api/rights
获取权益列表

### POST /api/rights
创建权益

**请求体**：
```json
{
  "name": "粤运拯救服务",
  "description": "省内高速救援",
  "type": "SELF_OPERATED"
}
```

## 六、计费相关

### GET /api/billing
获取扣费记录

### POST /api/billing-engine
触发计费引擎

**请求体**：
```json
{
  "memberId": "member_id",
  "type": "MEMBERSHIP_FEE"
}
```

## 七、用户权益相关

### GET /api/user-rights
获取用户权益

**参数**：
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
| status | string | 否 | 权益状态筛选 |

## 八、结算相关

### GET /api/settlements
获取结算记录

## 九、统计相关

### GET /api/stats
获取统计数据

## 十、系统配置

### GET /api/config
获取系统配置

### POST /api/config
更新系统配置
