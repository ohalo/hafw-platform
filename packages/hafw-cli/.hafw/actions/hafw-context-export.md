---
description: "HAFW上下文导出 - 导出HAFW项目上下文"
argument-hint: "[--project=项目名称] [--format=json|zip] [--output=路径]"
---

# HAFW 上下文导出指令

## 目标

导出 HAFW 项目的完整上下文，用于备份、迁移或分享。

## 用法

```bash
# 导出当前项目
/hafw-context-export

# 导出指定项目
/hafw-context-export --project={项目名称}

# 指定导出格式
/hafw-context-export --format=zip

# 指定输出路径
/hafw-context-export --output=/backup/hafw-project.zip
```

## 参数说明

| 参数 | 说明 | 默认值 |
|-----|------|--------|
| --project | 项目名称 | 当前项目 |
| --format | 导出格式 (json/zip) | zip |
| --output | 输出路径 | 自动生成 |
| --include-cache | 包含缓存数据 | false |

## 导出内容

### 1. JSON 格式导出

包含以下文件：
```
{项目名称}-{日期}-export/
├── project.json              ## 项目配置
├── context/                  ## 上下文数据
│   ├── requirements.json     ## 需求上下文
│   ├── design.json           ## 设计上下文
│   ├── development.json      ## 开发上下文
│   ├── quality.json          ## 质量上下文
│   └── deployment.json       ## 部署上下文
├── documents/                ## 文档索引
│   ├── requirements.json     ## 需求文档列表
│   ├── design.json           ## 设计文档列表
│   ├── development.json      ## 开发文档列表
│   ├── quality.json          ## 质量文档列表
│   └── deployment.json       ## 部署文档列表
├── tasks.json                ## 任务数据
├── timeline.json             ## 时间线
└── metadata.json             ## 元数据
```

### 2. ZIP 格式导出

包含完整工作空间：
```
{项目名称}-{日期}-export.zip
├── context/                  ## 上下文目录
├── documents/                ## 文档目录
├── tasks/                    ## 任务目录
├── metadata/                 ## 元数据目录
└── export.json               ## 导出信息
```

## 输出示例

```bash
/hafw-context-export --format=zip
```

输出：
```
=== HAFW 上下文导出 ===

项目: 用户积分系统
格式: ZIP
包含缓存: 否

导出内容:
📁 context/
   ✅ project.json (2.3 KB)
   ✅ requirements/current.json (5.1 KB)
   ✅ design/current.json (8.7 KB)
   ✅ development/current.json (3.2 KB)
   ✅ quality/current.json (1.5 KB)
   ✅ deployment/current.json (0.8 KB)

📁 documents/
   ✅ requirements/ (5 files, 45 KB)
   ✅ design/ (3 files, 32 KB)
   ✅ development/ (8 files, 28 KB)

📁 tasks/
   ✅ current.json (12.5 KB)
   ✅ completed.json (8.3 KB)

📁 metadata/
   ✅ timeline.json (15.2 KB)
   ✅ metrics.json (6.7 KB)

导出统计:
┌─────────────┬─────────┐
│ 文件总数    │ 42      │
│ 总大小      │ 156 KB  │
│ 文档数量    │ 16      │
│ 任务数量    │ 8       │
│ 导出耗时    │ 1.2s    │
└─────────────┴─────────┘

✅ 导出成功
   文件: /exports/用户积分系统-20240313-153000.zip
   大小: 156 KB
   MD5: a1b2c3d4e5f6...

导出信息:
{
  "export_id": "EXP-20240313-abc123",
  "project_id": "HAFW-20240313-xyz789",
  "project_name": "用户积分系统",
  "version": "1.0.0",
  "export_time": "2024-03-13T15:30:00Z",
  "format": "zip",
  "files_count": 42,
  "total_size": "156 KB",
  "checksum": "a1b2c3d4e5f6..."
}

用途:
➡️ 备份: 保存到安全位置
➡️ 迁移: 在其他环境导入
➡️ 分享: 发送给团队成员

导入命令:
/hafw-context-import /exports/用户积分系统-20240313-153000.zip
```

## 导出信息文件 (export.json)

```json
{
  "export_info": {
    "export_id": "EXP-{YYYYMMDD}-{UUID}",
    "export_time": "{ISO8601_TIMESTAMP}",
    "export_by": "{username}",
    "version": "1.0.0"
  },
  "project": {
    "id": "{项目ID}",
    "name": "{项目名称}",
    "version": "{版本}",
    "status": "{状态}"
  },
  "contents": {
    "context": {
      "files": 6,
      "size": "21.6 KB"
    },
    "documents": {
      "files": 16,
      "size": "105 KB"
    },
    "tasks": {
      "files": 2,
      "size": "20.8 KB"
    },
    "metadata": {
      "files": 2,
      "size": "21.9 KB"
    }
  },
  "checksums": {
    "md5": "{md5_hash}",
    "sha256": "{sha256_hash}"
  }
}
```

## 自动备份

可以配置自动定期导出：

```bash
# 配置每日自动备份
/hafw-context-export --auto-backup=daily --retention=7

# 配置每周自动备份
/hafw-context-export --auto-backup=weekly --retention=4
```
