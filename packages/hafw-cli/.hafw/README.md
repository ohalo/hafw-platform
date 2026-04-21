# HAFW Platform 安装指南

**工具集ID:** `hafw-platform`

## 概述

HAFW (High-efficiency AI Framework Workspace) 是一个 AI 智能开发设计的综合管理与协作平台，提供从需求分析到部署运维的完整开发流程支持。

## 执行流程

HAFW 平台包含 27 个指令，按照以下 6 个阶段执行：

```
阶段 0: 项目初始化 (必须)
├── /hafw-context-init {项目名称}          # 初始化项目上下文

阶段 1: 需求分析 (P0)
├── /hafw-req-analysis {需求描述}          # 分析需求
├── /hafw-req-impact {需求ID}              # 影响分析（可选）
├── /hafw-req-spec {需求ID}                # 生成PRD
├── /hafw-req-review {需求ID}              # 评审需求
└── /hafw-req-breakdown {需求ID}           # 拆解任务

阶段 2: 系统设计 (P1)
├── /hafw-design-arch {PRD-ID}             # 架构设计
├── /hafw-design-db {架构ID}               # 数据库设计
└── /hafw-design-api {架构ID}              # API设计

阶段 3: 代码开发 (P2)
├── /hafw-dev-code {架构ID}                # 生成代码
├── /hafw-dev-test {模块名称}              # 生成测试
└── /hafw-dev-review {代码路径}            # 代码审查

阶段 4: 质量保障 (P3)
├── /hafw-qa-scan {范围}                   # 质量扫描
├── /hafw-qa-test {模块}                   # 执行测试
└── /hafw-qa-report                        # 质量报告

阶段 5: 部署运维 (P4)
├── /hafw-deploy-build {环境}              # 构建打包
├── /hafw-deploy-release {环境} {版本}     # 发布部署
└── /hafw-deploy-monitor {应用} {环境}     # 监控运维
```

**完整流程文档**: 参见 `FLOW.md`

---

## 安装步骤

### 1. 创建 HAFW 工作目录

```bash
mkdir -p .hafw/{项目名称}/{context,requirements,architecture,deployment}
```

目录结构说明：
```
.hafw/
├── {项目名称}/           # 上下文文件
│   ├── contexts/      # 多维度上下文
│   ├── requirements/  # 需求上下文
│   ├── architecture/   # 架构上下文
│   ├── design/        # 设计上下文
│   └── development/   # 开发上下文
```

### 2. 检测 AI 编程助手类型

根据当前环境检测：
- 如果 `.claude` 目录存在，使用 Claude Code
- 如果 `.github` 目录存在，使用 GitHub Copilot
- 如果 `.codebuddy` 目录存在，使用 Tencent CodeBuddy
- 如果未检测到，使用手动配置

### 3. 创建快捷指令

#### hafw Code (`.hafw/actions`)

```bash
mkdir -p .hafw/actions

# 上下文初始化
cat > .hafw/actions/hafw-context-init.md << 'EOF'
---
description: "HAFW上下文初始化 - 初始化项目上下文（必须首先执行）"
argument-hint: "[项目名称]"
---

Follow the instructions in .hafw/actions/hafw-context-init.md
EOF

# 需求分析
cat > .hafw/actions/hafw-req-analysis.md << 'EOF'
---
description: "HAFW需求分析 - 分析用户需求"
argument-hint: "[用户原始需求描述]"
---

Follow the instructions in .hafw/actions/hafw-req-analysis.md
EOF

# 代码生成
cat > ..hafw/actions/hafw-dev-code.md << 'EOF'
---
description: "HAFW代码生成 - 基于需求生成代码"
argument-hint: "[功能需求ID或描述]"
---

Follow the instructions in .hafw/actions/hafw-dev-code.md
EOF

# 质量扫描
cat > .hafw/actions/hafw-qa-scan.md << 'EOF'
---
description: "HAFW质量扫描 - 执行代码质量检查"
argument-hint: "[扫描范围: all|modified|file-path]"
---

Follow the instructions in .hafw/actions/hafw-qa-scan.md
EOF
```

### 4. 验证安装

验证目录结构：
```bash
ls -la .hafw/
```

预期输出：
```
.hafw/
├── actions/
├── spec/
├── {项目名称}/
```

---

## 可用指令

### 上下文管理 (8个)
- `/hafw-context-init {项目名称}` - 初始化项目上下文（**必须首先执行**）
- `/hafw-context-show` - 查看当前上下文状态
- `/hafw-context-switch {项目名称}` - 切换项目上下文
- `/hafw-context-export` - 导出项目上下文
- `/hafw-context-import {文件路径}` - 导入项目上下文
- `/hafw-context-timeline` - 查看项目时间线
- `/hafw-context-scan {类型}` - 扫描代码更新上下文
- `/hafw-context-update {类型}` - 手动更新上下文

### 需求管理 (5个)
- `/hafw-req-analysis {需求描述}` - 分析用户需求
- `/hafw-req-impact {需求ID}` - 分析需求影响范围
- `/hafw-req-spec {需求ID}` - 生成需求规范文档
- `/hafw-req-review {需求ID}` - 评审需求
- `/hafw-req-breakdown {需求ID}` - 拆解需求生成任务

### 任务管理 (2个)
- `/hafw-task-list {需求ID}` - 查看任务列表和进度
- `/hafw-task-update {任务ID} status={状态}` - 更新任务状态

### 系统设计 (3个)
- `/hafw-design-arch {PRD-ID}` - 架构设计
- `/hafw-design-db {架构ID}` - 数据库设计
- `/hafw-design-api {架构ID}` - API设计

### 代码开发 (3个)
- `/hafw-dev-code {架构ID}` - 生成代码
- `/hafw-dev-test {模块名称}` - 生成测试代码
- `/hafw-dev-review {代码路径}` - 代码审查

### 质量保障 (3个)
- `/hafw-qa-scan {范围}` - 代码质量扫描
- `/hafw-qa-test {模块}` - 执行自动化测试
- `/hafw-qa-report` - 生成质量报告

### 部署运维 (3个)
- `/hafw-deploy-build {环境}` - 构建打包
- `/hafw-deploy-release {环境} {版本号}` - 发布部署
- `/hafw-deploy-monitor {应用名称} {环境}` - 监控运维

---

## 使用示例

### 示例 1: 完整开发流程

```bash
# 1. 初始化项目（必须）
/hafw-context-init 用户积分系统

# 2. 需求分析
/hafw-req-analysis 实现一个用户积分系统，包括积分获取、消费、查询功能
/hafw-req-spec REQ-20240313-用户积分系统
/hafw-req-review PRD-用户积分系统

# 3. 系统设计
/hafw-design-arch PRD-用户积分系统
/hafw-design-db ARCH-001
/hafw-design-api ARCH-001

# 4. 代码开发
/hafw-dev-code ARCH-001
/hafw-dev-test 用户积分系统
/hafw-dev-review src/main/java/com/example/

# 5. 质量保障
/hafw-qa-scan all
/hafw-qa-test all
/hafw-qa-report

# 6. 部署运维
/hafw-deploy-build prod
/hafw-deploy-release prod 1.0.0
/hafw-deploy-monitor 用户积分系统 prod
```

### 示例 2: 查看任务进度

```bash
/hafw-task-list REQ-20240313-用户积分系统
```

### 示例 3: 更新任务状态

```bash
/hafw-task-update T001-001 status=开发中 progress=50
```

---

## 输出目录结构

### 需求文档
```
.hafw/{项目名称}/requirements/
├── REQ-{日期}-{名称}.md      # 需求分析文档
├── IMPACT-{需求ID}.md        # 影响分析报告
├── PRD-{需求名称}.md         # 需求规范文档
├── REVIEW-{需求ID}.md        # 评审报告
└── TASKS-{需求ID}.md         # 任务清单
```

### 架构文档
```
.hafw/{项目名称}/architecture/
├── ARCH-{架构ID}-{系统名称}.md    # 架构设计文档
├── DB-{设计ID}-{模块名称}.md      # 数据库设计文档
└── API-{设计ID}-{模块名称}.md     # API设计文档
```

### 部署文档
```
.hafw/{项目名称}/deployment/
├── BUILD-{构建ID}.md           # 构建报告
├── DEP-{部署ID}-{环境}.md      # 部署文档
└── MONITOR-{应用}-{环境}.md    # 监控配置
```

---

## 下一步

1. 执行 `/hafw-context-init` 初始化您的第一个项目
2. 参考 `FLOW.md` 了解完整执行流程
3. 尝试 `/hafw-req-analysis` 分析一个需求

---

## 许可证

Copyright (c) 2026 halo26812.com & halo26812. All rights reserved.

Licensed under the PROPRIETARY SOFTWARE LICENSE.
