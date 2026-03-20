---
description: "HAFW上下文初始化 - 初始化HAFW工作空间和上下文，支持现有项目识别"
argument-hint: "[项目名称] [--force] [--scan]"
---

# HAFW 上下文初始化指令

## 目标

初始化 HAFW 工作空间，创建标准化的目录结构和上下文配置文件。支持识别现有项目并自动提取项目信息。

## 用法

```bash
# 初始化新项目（自动识别当前目录项目，获取项目名称）
/hafw-context-init

# 指定项目名称初始化
/hafw-context-init {项目名称}

# 强制重新初始化
/hafw-context-init {项目名称} --force

# 初始化并扫描现有项目
/hafw-context-init {项目名称} --scan
```

## 参数说明

| 参数 | 必填 | 说明 |
|-----|------|------|
| 项目名称 | 否 | HAFW 项目标识名称，默认自动识别 |
| --force | 否 | 强制重新初始化（会清空现有数据） |
| --scan | 否 | 扫描现有项目并填充上下文 |

## 执行步骤

### 1. 检测现有项目

如果当前目录已存在项目，自动识别项目信息：

```bash
# 检测项目类型
if [ -f "pom.xml" ]; then
    PROJECT_TYPE="Maven Java"
    BUILD_TOOL="Maven"
    LANGUAGE="Java"
elif [ -f "package.json" ]; then
    PROJECT_TYPE="Node.js"
    BUILD_TOOL="npm/yarn"
    LANGUAGE="JavaScript/TypeScript"
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    PROJECT_TYPE="Python"
    BUILD_TOOL="pip/poetry"
    LANGUAGE="Python"
fi

# 提取项目信息
PROJECT_NAME=$(从pom.xml/package.json等提取)
PROJECT_VERSION=$(从配置文件提取)
PROJECT_DESCRIPTION=$(从README.md提取)
```

### 2. 扫描项目结构

扫描现有项目目录结构：

```bash
# 扫描源代码结构
find src -type f -name "*.java" 2>/dev/null | head -20

# 扫描配置文件
ls -la *.xml *.yml *.yaml *.json 2>/dev/null

# 扫描文档
ls -la README* docs/ 2>/dev/null

# 扫描测试
find src/test -type f 2>/dev/null | head -10
```

### 3. 识别技术栈

根据项目文件识别技术栈：

| 检测文件 | 技术栈 |
|---------|--------|
| `pom.xml` | Java + Maven |
| `build.gradle` | Java + Gradle |
| `package.json` | Node.js + npm/yarn |
| `requirements.txt` | Python + pip |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `Dockerfile` | Docker |
| `docker-compose.yml` | Docker Compose |
| `k8s/` 或 `kubernetes/` | Kubernetes |

### 4. 创建工作空间目录结构

```
项目根目录/
├── .hafw/                          ## HAFW 工作目录
│   ├── {项目名称}/                    ## 上下文目录
│   │   ├── project.json            ## 项目基本信息
│   │   ├── contexts/               ## 多维度上下文
│   │   │   ├── index.md            ## 上下文索引
│   │   │   ├── api.md              ## API 上下文
│   │   │   ├── architecture.md     ## 架构上下文
│   │   │   ├── data-models.md      ## 数据模型上下文
│   │   │   ├── development.md       ## 开发配置上下文
│   │   │   ├── coding-style.md     ## 编码规范上下文
│   │   │   └── project-structure.md## 项目结构上下文
│   │   ├── requirements/           ## 需求上下文
│   │   ├── architecture/           ## 架构上下文
│   │   ├── design/                 ## 设计上下文
│   │   ├── development/            ## 开发上下文
│   │   ├── quality/                ## 质量上下文
├── src/                            ## 项目源代码（已存在）
├── pom.xml/build.gradle            ## 构建配置（已存在）
└── README.md                       ## 项目说明（已存在）
```

### 5. 初始化项目配置文件

创建 `.hafw/{项目名称}/context/project.json`：

```json
{
  "project": {
    "id": "HAFW-{YYYYMMDD}-{UUID}",
    "name": "{项目名称}",
    "version": "{从项目文件提取的版本}",
    "description": "{从README提取的描述}",
    "type": "{Maven/Gradle/Node.js/Python}",
    "language": "{Java/JavaScript/Python/Go}",
    "status": "initialized",
    "created_at": "{ISO8601_TIMESTAMP}",
    "updated_at": "{ISO8601_TIMESTAMP}",
    "owner": "{当前用户}",
    "team": []
  },
  "workspace": {
    "root": ".hafw/",
    "project_root": "./",
    "structure_version": "1.0.0"
  },
  "phases": {
    "requirements": { "status": "pending", "completed_at": null, "artifacts": [] },
    "design": { "status": "pending", "completed_at": null, "artifacts": [] },
    "development": { "status": "in_progress", "completed_at": null, "artifacts": [] },
    "quality": { "status": "pending", "completed_at": null, "artifacts": [] }
  },
  "current_context": {
    "active_requirement": null,
    "active_design": null,
    "active_tasks": [],
    "active_branch": null
  },
  "detected_info": {
    "source_files_count": {count},
    "test_files_count": {count},
    "config_files": [{files}],
    "dependencies": [{deps}]
  }
}
```

### 6. 生成多维度上下文文件（基于模板+项目识别）

不是简单复制模板，而是根据项目实际情况填充：

#### API 上下文 ({项目名称}/contexts/api.md)

```markdown
# API 上下文

## 基本信息
| 项目 | 内容 |
|-----|------|
| 上下文ID | API-{YYYYMMDD}-001 |
| 所属项目 | {项目名称} |
| 版本 | v{版本} |
| 最后更新 | {日期} |
| 状态 | ✅ 最新 |

## API 概览

<!-- 扫描代码自动填充 -->
| 类型 | 数量 | 说明 |
|-----|------|------|
| REST API | {从Controller扫描} | RESTful 接口 |

## REST API 清单

<!-- 从代码扫描生成 -->
### 模块: {模块名}

#### {接口名称}
| 属性 | 内容 |
|-----|------|
| 接口ID | API-001 |
| 路径 | {从@RequestMapping提取} |
| 方法 | {GET/POST/PUT/DELETE} |
| 状态 | ✅ 已上线 |

## 过时检测标记
- [ ] 代码中发现了新的 API 端点但未记录
- [ ] 已有 API 的签名与代码不一致

**检测时间**: {ISO8601_TIMESTAMP}
**检测结果**: ✅ 最新
```

#### 架构上下文 ({项目名称}/contexts/architecture.md)

```markdown
# 架构上下文

## 基本信息
...

## 架构概览

### 架构风格
- [x] {根据项目识别的架构风格}

### 技术栈
| 层次 | 技术 | 版本 | 来源 |
|-----|------|------|------|
| 后端 | {从pom.xml/build.gradle提取} | {版本} | 自动识别 |
| 数据库 | {从配置文件提取} | {版本} | 自动识别 |

## 系统架构图

<!-- 根据项目结构生成 -->
```

#### 项目结构上下文 ({项目名称}/contexts/project-structure.md)

```markdown
# 项目结构上下文

## 实际目录结构

```
{从项目扫描的实际结构}
```

## 关键文件

| 文件 | 用途 | 说明 |
|-----|------|------|
| {实际存在的文件} | {用途} | 自动识别 |
```

### 7. 创建上下文索引

创建 `{项目名称}/contexts/index.md`：

```markdown
# {项目名称} - 上下文索引

## 项目信息
| 项目 | 内容 |
|-----|------|
| 项目名称 | {项目名称} |
| 项目类型 | {Maven/Gradle/Node.js} |
| 编程语言 | {Java/JavaScript/Python} |
| 源代码文件 | {count} 个 |
| 测试文件 | {count} 个 |

## 检测到的技术栈
- {技术1} {版本}
- {技术2} {版本}

## 上下文清单
...
```

## 输出示例

### 新项目初始化

```
=== HAFW 上下文初始化 ===

🆕 新项目初始化

项目名称: 我的项目
项目ID: HAFW-20240313-abc123

✅ 工作空间创建成功
   路径: .hafw/
   
✅ 项目空间创建成功
   路径: {项目名称}

✅ 目录结构初始化完成
   ├── context/
   ├── requirements/
   ├── architecture/
   ├── deployment/
   ├── tasks/
   └── metadata/

✅ 配置文件初始化完成
   └── project.json

✅ 多维度上下文初始化完成
   ├── contexts/index.md
   ├── contexts/api.md
   ├── contexts/architecture.md
   ├── contexts/data-models.md
   ├── contexts/deployment.md
   ├── contexts/coding-style.md
   └── contexts/project-structure.md

项目状态: 🟢 已初始化

下一步建议:
➡️ 运行 /hafw-req-analysis {需求描述}
   开始第一个需求分析
```

### 现有项目识别

```
=== HAFW 上下文初始化 ===

🔍 检测到现有项目

项目类型: Maven Java 项目
项目名称: employee-points-system (从pom.xml提取)
项目版本: 1.0.0-SNAPSHOT
编程语言: Java
源代码: 15 个文件
测试代码: 8 个文件

📦 检测到的技术栈:
   ✅ Spring Boot 2.7.x
   ✅ MyBatis
   ✅ MySQL
   ✅ Maven
   ✅ Docker

✅ 工作空间创建成功
   路径: .hafw/

✅ 项目结构扫描完成
   识别到以下模块:
   ├── controller/ (3 个Controller)
   ├── service/ (2 个Service)
   ├── mapper/ (2 个Mapper)
   └── entity/ (5 个Entity)

✅ API 扫描完成
   识别到 12 个API接口
   已生成到 contexts/api.md

✅ 数据模型扫描完成
   识别到 5 个实体类
   已生成到 contexts/data-models.md

✅ 项目结构上下文已生成
   已根据实际目录结构填充

项目状态: 🟢 已初始化（基于现有项目）

⚠️ 注意:
   部分上下文内容需要手动确认和补充

下一步建议:
➡️ 运行 /hafw-context-show
   查看完整的上下文信息

➡️ 运行 /hafw-context-scan --type=all
   深度扫描并更新所有上下文
```

## 注意事项

1. **项目识别**: 自动识别基于常见项目文件（pom.xml、package.json等）
2. **扫描范围**: 默认扫描 `src/` 目录，可通过配置调整
3. **敏感信息**: 不会提取密码、密钥等敏感信息
4. **备份**: 使用 `--force` 时会自动备份现有 `.hafw/` 目录

## 相关指令

- `/hafw-context-show` - 查看当前上下文
- `/hafw-context-scan` - 扫描代码更新上下文
- `/hafw-context-update` - 手动更新上下文