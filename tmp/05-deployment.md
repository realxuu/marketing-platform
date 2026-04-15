# 粤通卡ETC营销平台 - 部署运维

## 一、部署架构

### 线上环境
- **平台**：Vercel
- **数据库**：Neon PostgreSQL（Serverless）
- **域名**：待配置

### 本地开发环境
- **框架**：Next.js 16 (Turbopack)
- **数据库**：SQLite
- **启动命令**：`pnpm dev`

## 二、环境变量

| 变量名 | 说明 | 环境 |
|--------|------|------|
| POSTGRES_PRISMA_URL | PostgreSQL连接URL（连接池） | 线上 |
| POSTGRES_URL_NON_POOLING | PostgreSQL直连URL | 线上 |
| DATABASE_URL | SQLite数据库路径 | 本地 |

## 三、部署流程

### 线上部署
1. 代码推送到 Git 仓库
2. Vercel 自动构建部署
3. Prisma schema 变更需执行 `prisma migrate deploy`

### 本地开发
1. 克隆仓库
2. `pnpm install` 安装依赖
3. 修改 `prisma/schema.prisma` 为 SQLite 配置
4. `npx prisma generate && npx prisma db push`
5. `pnpm dev` 启动开发服务器
6. 调试完成后恢复 PostgreSQL 配置再部署

## 四、数据库迁移

### 创建迁移
```bash
npx prisma migrate dev --name <migration_name>
```

### 应用迁移（线上）
```bash
npx prisma migrate deploy
```

### 种子数据
```bash
pnpm db:seed
```

## 五、监控与告警

| 监控项 | 工具 | 说明 |
|--------|------|------|
| 应用性能 | Vercel Analytics | 页面加载、API响应 |
| 错误追踪 | Vercel Logs | 运行时错误 |
| 数据库 | Neon Dashboard | 连接数、查询性能 |

## 六、运维手册

### 常见问题
- **数据库连接超时**：检查 Neon 数据库是否处于休眠状态
- **构建失败**：检查 Prisma generate 是否正常执行
- **API 500错误**：查看 Vercel 函数日志

### 紧急联系
- 开发负责人：徐锦润
