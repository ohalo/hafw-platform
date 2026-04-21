---
name: hafw-context-update
description: "HAFW上下文更新 - 手动更新或合并上下文内容"
argument-hint: "[上下文类型] [--file=文件路径] [--merge] [--validate]"
---

# HAFW 上下文更新指令

## 目标

手动更新上下文内容，支持文件导入、内容合并和验证。

## 用法

```bash
# 更新特定上下文
/hafw-context-update api

# 从文件导入
/hafw-context-update api --file=/path/to/api.md

# 合并更新
/hafw-context-update api --merge

# 验证上下文
/hafw-context-update --validate
```

## 参数说明

| 参数 | 说明 | 可选值 |
|-----|------|--------|
| 上下文类型 | 要更新的上下文 | api/arch/data/deploy/style/struct |
| --file | 导入文件路径 | 文件路径 |
| --merge | 合并模式 | 保留现有内容并合并新内容 |
| --validate | 验证模式 | 只验证不更新 |
| --backup | 备份现有 | 更新前备份 |

## 更新模式

### 1. 直接更新

完全替换现有上下文：
```bash
/hafw-context-update api
```

交互式编辑：
```
=== 更新 API 上下文 ===

当前上下文: .hafw/用户积分系统/contexts/api.md

选择操作:
1. 编辑现有内容
2. 从模板重新生成
3. 从文件导入
4. 扫描代码更新

> 1

打开编辑器...
[用户编辑内容]

✅ 更新成功
备份文件: api.md.backup.20240313120000
```

### 2. 合并更新

保留手动修改，合并新内容：
```bash
/hafw-context-update api --merge --file=new-api.md
```

合并策略：
```
=== 合并 API 上下文 ===

基础文件: api.md
合并文件: new-api.md

冲突检测:
┌─────────────────┬─────────────────┬─────────────────┐
│ 字段            │ 当前值          │ 新值            │
├─────────────────┼─────────────────┼─────────────────┤
│ API-001.path    │ /api/v1/users   │ /api/v2/users   │
│ API-001.method  │ GET             │ GET             │
│ API-002.status  │ active          │ (删除)          │
│ API-003         │ (新增)          │ POST /payments  │
└─────────────────┴─────────────────┴─────────────────┘

解决冲突:
1. API-001.path: 使用当前值 / 使用新值 / 手动编辑
2. API-002.status: 保留 / 删除
3. API-003: 添加 / 忽略

✅ 合并完成
```

### 3. 从文件导入

导入外部上下文文件：
```bash
/hafw-context-update api --file=/downloads/api-updated.md
```

验证导入文件：
```
🔍 验证导入文件...

✅ 文件格式: Markdown
✅ 必要字段: 存在
✅ 语法检查: 通过
⚠️  警告: 发现 2 个未定义的 API 引用

是否继续导入? [Y/n]: 
```

### 4. 批量更新

更新所有上下文：
```bash
/hafw-context-update all
```

选择性更新：
```bash
/hafw-context-update api,arch,data
```

## 验证功能

### 上下文验证
```bash
/hafw-context-update --validate
```

验证内容：
- 文件格式正确性
- 必要字段完整性
- 交叉引用一致性
- 过时标记检查

输出示例：
```
=== 上下文验证 ===

验证项目: 用户积分系统

📋 验证结果:
┌─────────────────┬─────────┬─────────────────────────────┐
│ 上下文          │ 状态    │ 说明                        │
├─────────────────┼─────────┼─────────────────────────────┤
│ api.md          │ ✅ 通过 │ 格式正确，引用完整          │
│ arch.md         │ ⚠️ 警告 │ 发现 2 个未定义的组件引用   │
│ data.md         │ ✅ 通过 │ 格式正确                    │
│ deploy.md       │ ❌ 错误 │ 缺少必要字段: environment   │
│ style.md        │ ✅ 通过 │ 格式正确                    │
│ struct.md       │ ✅ 通过 │ 格式正确                    │
└─────────────────┴─────────┴─────────────────────────────┘

❌ 错误详情:
   deploy.md:
   - Line 15: 缺少 'environment' 字段
   - Line 32: 无效的 YAML 格式

⚠️ 警告详情:
   arch.md:
   - 引用了未定义的组件: PaymentService
   - 建议: 运行 /hafw-context-scan arch 更新

修复建议:
➡️ /hafw-context-update deploy --fix
   自动修复可修复的错误

➡️ /hafw-context-scan arch
   扫描并更新架构上下文
```

## 版本管理

### 查看历史
```bash
/hafw-context-update --history api
```

输出：
```
=== API 上下文历史 ===

┌─────────────────────┬─────────┬──────────┬──────────────────┐
│ 时间                │ 版本    │ 操作     │ 说明             │
├─────────────────────┼─────────┼──────────┼──────────────────┤
│ 2024-03-13 12:00:00 │ v1.3    │ 自动扫描 │ 新增 3 个接口    │
│ 2024-03-12 10:30:00 │ v1.2    │ 手动编辑 │ 修改接口文档     │
│ 2024-03-11 09:00:00 │ v1.1    │ 导入     │ 从 Swagger 导入  │
│ 2024-03-10 15:00:00 │ v1.0    │ 初始化   │ 初始版本         │
└─────────────────────┴─────────┴──────────┴──────────────────┘

➡️ /hafw-context-update api --rollback=v1.2
   回滚到指定版本
```

### 回滚操作
```bash
# 回滚到上一版本
/hafw-context-update api --rollback

# 回滚到指定版本
/hafw-context-update api --rollback=v1.2
```

## 备份与恢复

### 自动备份
每次更新自动创建备份：
- 备份路径：`.hafw/{项目名称}/backups/`
- 命名格式：`{context}-{timestamp}.md`
- 保留数量：最近 10 个版本

### 手动备份
```bash
/hafw-context-update api --backup-only
```

### 恢复备份
```bash
/hafw-context-update api --restore=api.md.backup.20240313120000
```

## 同步功能

### 与代码同步
```bash
# 将上下文同步到代码注释
/hafw-context-update api --sync-to-code

# 从代码注释同步到上下文
/hafw-context-update api --sync-from-code
```

### 与文档同步
```bash
# 导出为 API 文档
/hafw-context-update api --export-doc

# 从 API 文档导入
/hafw-context-update api --import-doc=/docs/api.md
```

## 最佳实践

1. **定期更新**: 建议每次功能迭代后更新上下文
2. **版本控制**: 将上下文文件纳入 Git 管理
3. **备份策略**: 重要更新前手动备份
4. **团队协作**: 共享上下文文件，保持一致性
5. **自动化**: 配置 CI/CD 自动验证上下文
