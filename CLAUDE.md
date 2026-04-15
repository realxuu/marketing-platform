@AGENTS.md

## 飞书知识库配置

- **知识库名称**：粤通卡ETC营销平台
- **Space ID**：7628564057213160639
- **CLI 命令**：`npx @larksuite/cli`

### 文档目录

| 目录 | node_token | obj_token | 说明 |
|------|-----------|-----------|------|
| 01-需求管理 | RnHrw3QdKiqC8XkOD12cG4UTnoc | ZjazduVnAogDGyxKbYLcbKgVn9d | 需求清单、业务规则、产品说明 |
| ├ 营销平台项目一期会议材料 | Ro1Xwra2TiDWLVkftyHcP3Vcnmc | X60adHhwlotW6Bxi9nwc93r5njd | 原始需求文档（桌面） |
| ├ 营销平台系统方案 | P6LvwTA7piZ3jVk0xHTc6aA9noh | I0x0dZQufoLvfmxQjjEc94Dvn0b | 系统方案V1.4（桌面） |
| ├ 3.2-附件1：高速通行权益新套餐 | YNeywOSrBiJ93bkzFDwcS4ohnNc | BAtadjQZeoBPTsxT789cUk22nJd | 年卡/月卡/次卡权益套餐详情 |
| 02-技术方案 | GlvgwyzGtilfWck3a8rcRgXLn9e | PMGvdscMpoMZ9Qx0FPzcKMo0nLn | 技术架构、数据模型、项目结构 |
| 03-API文档 | ADAAw4pDeid5zhk2etQcBltynAb | FWaidtRGIoXULSxkglFcmJqVnZb | 接口文档 |
| 04-测试管理 | ZjpjwmTiAiDzjRksyZsco98VnTc | ViA8d9bwAoYFyMxwuxLc1Smznse | 测试用例、Bug记录 |
| 05-部署运维 | UXdGwPv7eicPBFkFu6fcopkWnvb | DdyJdTOGKoZHGAx6MDSc4YoGnff | 部署流程、环境变量、运维手册 |
| 06-会议纪要 | LqQ5ws2luiKjtykpZgHcoNyanIg | LhykdCdnFooi2LxWmMyczr6bnOe | 会议记录 |

### 工作流规则

**改动前必须先拉取飞书最新内容**：
1. 涉及需求、技术方案、API等文档相关改动时，先用 `docs +fetch` 拉取飞书最新版本
2. 基于最新内容做变更
3. 变更完成后用 `docs +update` 同步回飞书

拉取文档内容：
```bash
npx @larksuite/cli docs +fetch --doc "<obj_token>"
```

更新文档内容：
```bash
npx @larksuite/cli docs +update --doc "<obj_token>" --mode overwrite --markdown @tmp/<file>.md
```

创建子节点：
```bash
npx @larksuite/cli wiki +node-create --space-id "7628564057213160639" --parent-node-token "<parent_node_token>" --title "<标题>" --obj-type docx
```

查看知识库节点：
```bash
npx @larksuite/cli api GET "/open-apis/wiki/v2/spaces/7628564057213160639/nodes" --params '{"page_size":20}'
```

