# HAFW 工作原理说明

## 核心架构

HAFW 是一个以**AI 智能体**为核心的开发框架，通过 Actions 机制让 AI 智能体能够执行各种开发任务。

```
┌────────────────────────────────────────────────────┐
│                 AI 智能体 (Lingma/Copilot)           │
│  用户输入：/hafw-req-analysis "需求描述"             │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│          读取 .hafw/actions/*.md 指令文件            │
│  - hafw-req-analysis.md                            │
│  - hafw-design-arch.md                             │
│  - hafw-dev-code.md                                │
│  - ... 等 27 个指令                                  │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│  AI 智能体解析指令内容，执行相应操作                   │
│  1. 创建需求文档                                    │
│  2. 生成架构设计                                    │
│  3. 编写代码                                        │
│  4. 更新上下文                                      │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│          输出到 .hafw/{项目名称}/ 目录                   │
│  ├── requirements/    需求文档                       │
│  ├── architecture/    架构文档                       │
│  ├── development/     开发文档                       │
│  └── contexts/        上下文文件                     │
└────────────────────────────────────────────────────┘
```

## 工作流程

### 1. 安装 HAFW CLI

```bash
npm install -g hafw-cli
```

### 2. 安装 Actions 到项目

```bash
cd my-project
hafw install
```

这会：
- 创建 `.hafw/` 目录
- 复制所有 Actions 到 `.hafw/actions/`
- 复制 Spec 模板到 `.hafw/spec/`
- 创建项目配置 `.hafw/project.json`

### 3. 使用 AI 智能体

在 AI 对话中使用指令：

```
/hafw-context-init 我的项目

/hafw-req-analysis 实现一个用户积分系统

/hafw-design-arch PRD-我的项目

/hafw-dev-code ARCH-001
```

## 目录结构

```
项目根目录/
├── .hafw/                          # HAFW 工作目录
│   ├── actions/                    # AI 智能体指令（27 个）
│   │   ├── hafw-context-init.md
│   │   ├── hafw-req-analysis.md
│   │   ├── hafw-design-arch.md
│   │   └── ...
│   ├── spec/                       # 规范模板
│   │   ├── requirement-spec.md
│   │   ├── architecture-spec.md
│   │   └── ...
│   ├── {项目名}/                   # 项目工作区
│   │   ├── project.json           # 项目配置
│   │   ├── contexts/              # 多维度上下文
│   │   ├── requirements/          # 需求文档
│   │   ├── architecture/          # 架构文档
│   │   └── ...
│   └── project.json               # 全局配置
└── src/                           # 项目源代码
```

## 核心概念

### Actions（指令）

- 位置：`.hafw/actions/*.md`
- 作用：告诉 AI 智能体如何执行特定任务
- 格式：Markdown 文件，包含指令描述和执行步骤
- 数量：27 个，覆盖完整开发流程

### Spec（规范模板）

- 位置：`.hafw/spec/*.md`
- 作用：提供文档生成的标准模板
- 类型：需求规范、架构规范、部署规范等

### Contexts（上下文）

- 位置：`.hafw/{项目名称}/contexts/`
- 作用：维护项目的多维度上下文信息
- 类型：API 上下文、架构上下文、数据模型上下文等

### Project.json（项目配置）

- 位置：`.hafw/{项目}/project.json`
- 作用：记录项目基本信息和执行状态

## AI 智能体指令列表

### 上下文管理 (8 个)
- `/hafw-context-init` - 初始化项目上下文
- `/hafw-context-show` - 查看当前上下文状态
- `/hafw-context-scan` - 扫描代码更新上下文
- `/hafw-context-update` - 手动更新上下文
- 等...

### 需求管理 (5 个)
- `/hafw-req-analysis` - 分析用户需求
- `/hafw-req-spec` - 生成需求规范文档
- `/hafw-req-review` - 评审需求
- `/hafw-req-breakdown` - 拆解需求生成任务
- 等...

### 系统设计 (3 个)
- `/hafw-design-arch` - 架构设计
- `/hafw-design-db` - 数据库设计
- `/hafw-design-api` - API 设计

### 代码开发 (3 个)
- `/hafw-dev-code` - 生成代码
- `/hafw-dev-test` - 生成测试代码
- `/hafw-dev-review` - 代码审查

### 质量保障 (3 个)
- `/hafw-qa-scan` - 代码质量扫描
- `/hafw-qa-test` - 执行自动化测试
- `/hafw-qa-report` - 生成质量报告

### 部署运维 (3 个)
- `/hafw-deploy-build` - 构建打包
- `/hafw-deploy-release` - 发布部署
- `/hafw-deploy-monitor` - 监控运维

## 与传统 CLI 的区别

| 传统 CLI | HAFW CLI |
|---------|---------|
| 直接执行命令 | 安装 Actions 到本地 |
| 输出到 stdout | AI 智能体读取 Actions 后生成文档 |
| 固定的功能 | 可扩展的 Actions 机制 |
| 命令行操作 | AI 对话中操作 |

## 优势

1. **AI 驱动**: 充分利用 AI 智能体的理解和生成能力
2. **灵活扩展**: 通过修改 Actions 可以定制 AI 行为
3. **标准化**: 所有文档和流程都有标准模板
4. **可追溯**: 完整的上下文和项目状态记录
5. **自动化**: AI 自动执行重复性工作

## 版本信息

- **CLI 版本**: 1.0.4
- **Actions 版本**: 1.0.0
- **文档日期**: 2026-03-20

---

**注意**: HAFW CLI 只负责安装 Actions，真正的执行由 AI 智能体完成。
