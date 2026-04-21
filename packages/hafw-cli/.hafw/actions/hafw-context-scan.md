---
name: hafw-context-scan
description: "HAFW上下文扫描 - 扫描项目代码更新上下文并检测过时内容"
argument-hint: "[--type=api|arch|data|deploy|style|struct|all] [--dry-run]"
---

# HAFW 上下文扫描指令

## 目标

扫描项目代码，自动更新上下文文件，并检测当前上下文是否过时。

## 用法

```bash
# 扫描所有上下文
/hafw-context-scan

# 扫描特定类型上下文
/hafw-context-scan --type=api

# 预览扫描结果（不实际更新）
/hafw-context-scan --dry-run

# 扫描并强制更新
/hafw-context-scan --force
```

## 参数说明

| 参数 | 说明 | 可选值 |
|-----|------|--------|
| --type | 扫描类型 | api/arch/data/deploy/style/struct/all |
| --dry-run | 预览模式 | 只显示差异不更新 |
| --force | 强制更新 | 跳过确认直接更新 |
| --detailed | 详细输出 | 显示完整差异 |

## 扫描流程

### 1. API 上下文扫描

扫描内容：
- Controller 文件中的 API 端点
- 请求/响应参数
- 注解信息 (@RestController, @RequestMapping, etc.)

```bash
# 扫描命令示例
grep -r "@RestController\|@Controller" src/
grep -r "@RequestMapping\|@GetMapping\|@PostMapping" src/
```

### 2. 架构上下文扫描

扫描内容：
- 项目结构
- 组件依赖
- 配置文件 (pom.xml, application.yml)

### 3. 数据模型扫描

扫描内容：
- Entity 类
- Mapper 接口
- 数据库表结构

### 4. 部署配置扫描

扫描内容：
- Dockerfile
- K8s YAML
- CI/CD 配置

### 5. 编码规范扫描

扫描内容：
- Checkstyle 配置
- ESLint 配置
- 代码风格文件

### 6. 项目结构扫描

扫描内容：
- 目录结构
- 关键文件位置
- 模块划分

## 输出示例

```bash
/hafw-context-scan --type=api
```

输出：
```
=== HAFW 上下文扫描 ===

扫描类型: API 上下文
项目: 用户积分系统

🔍 开始扫描...

📁 扫描文件:
   ✅ UserController.java
   ✅ OrderController.java
   ✅ ProductController.java
   ⚠️  发现新文件: PaymentController.java (未记录)

📊 扫描结果:
┌─────────────────┬─────────┬─────────┬─────────┐
│ 检查项          │ 现有    │ 代码中  │ 状态    │
├─────────────────┼─────────┼─────────┼─────────┤
│ API 接口总数    │ 15      │ 18      │ ⚠️ +3   │
│ 新增接口        │ -       │ 3       │ ⚠️ 新增 │
│ 变更接口        │ 2       │ 2       │ ⚠️ 需确认│
│ 删除接口        │ 1       │ 0       │ ⚠️ 已删除│
│ 参数变更        │ 5       │ 7       │ ⚠️ 需确认│
└─────────────────┴─────────┴─────────┴─────────┘

🔍 详细差异:

⚠️ 新增接口 (3个):
   ✅ POST /api/v1/payments/create
   ✅ GET  /api/v1/payments/{id}
   ✅ POST /api/v1/payments/refund

⚠️ 变更接口 (2个):
   📝 POST /api/v1/orders/create
      - 新增参数: paymentMethod (String)
      - 响应字段变更: totalAmount → amount

   📝 GET  /api/v1/users/{id}
      - 响应字段新增: emailVerified (Boolean)

⚠️ 已删除接口 (1个):
   ❌ GET  /api/v1/orders/old-list (代码中不存在)

⚠️ 过时标记:
   - [x] 代码中发现了新的 API 端点但未记录
   - [x] 已有 API 的签名与代码不一致
   - [ ] 文档中的 API 在代码中已删除
   - [ ] 超过 30 天未验证 API 可用性

📝 建议操作:
1. 查看新增接口详情并确认
2. 更新变更接口的文档
3. 删除已废弃的接口记录

操作选项:
➡️ 更新上下文 (将差异应用到上下文文件)
   /hafw-context-scan --type=api --force

➡️ 查看详细差异
   /hafw-context-scan --type=api --detailed

➡️ 手动编辑
   编辑 ./hafw/{项目名称}/contexts/api.md
```

## 过时检测机制

### 检测规则

| 上下文类型 | 过时检测规则 |
|-----------|-------------|
| API | 代码中新接口未记录、参数签名不一致、接口已删除 |
| Architecture | 新组件未记录、依赖关系变化、技术栈版本变更 |
| Data Models | 新实体未记录、字段不一致、索引变化 |
| Deployment | 配置与实际部署不一致、环境变量变更 |
| Coding Style | 新语言特性未记录、规则与配置不一致 |
| Project Structure | 目录结构变化、文件位置变更 |

### 状态标记

| 状态 | 图标 | 说明 |
|-----|------|------|
| 最新 | ✅ | 上下文与代码一致 |
| 需更新 | ⚠️ | 发现差异需要确认 |
| 过时 | ❌ | 上下文已过期需要更新 |

## 更新策略

### 自动更新
```bash
# 自动接受所有变更
/hafw-context-scan --force

# 自动更新特定类型
/hafw-context-scan --type=api --force
```

### 交互式更新
```bash
# 逐个确认变更
/hafw-context-scan --interactive

# 输出示例:
# 发现新增接口: POST /api/v1/payments/create
# 是否添加? [Y/n/m(修改)]: 
```

### 合并更新
```bash
# 保留手动修改，合并自动发现的内容
/hafw-context-scan --merge
```

## 定时扫描配置

```bash
# 配置每日自动扫描
/hafw-context-scan --schedule=daily --time=02:00

# 配置提交前自动扫描
/hafw-context-scan --hook=pre-commit
```

## 扫描报告

扫描完成后生成报告：
- 文件路径：`.hafw/{项目名称}/reports/scan-report-{timestamp}.md`
- 包含：差异详情、建议操作、更新时间

## 注意事项

1. **备份**: 首次扫描前自动备份上下文文件
2. **版本控制**: 建议将上下文文件纳入版本控制
3. **人工确认**: 重要变更建议人工确认后再更新
4. **定期扫描**: 建议每日或每次提交前扫描
