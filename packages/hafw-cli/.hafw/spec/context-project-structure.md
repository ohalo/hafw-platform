# HAFW 项目结构上下文模板

## 基本信息

| 项目 | 内容 |
|-----|------|
| 上下文ID | STRUCT-{YYYYMMDD}-{序号} |
| 所属项目 | {项目名称} |
| 版本 | v{版本号} |
| 最后更新 | {YYYY-MM-DD HH:mm:ss} |
| 更新方式 | 手动/自动扫描 |
| 状态 | ✅ 最新 / ⚠️ 需更新 / ❌ 过时 |

---

## 项目概览

### 项目类型
- [ ] Spring Boot (Java)
- [ ] Node.js / Express
- [ ] Python / Django / FastAPI
- [ ] React / Vue / Angular
- [ ] 其他: {说明}

### 构建工具
| 工具 | 版本 | 说明 |
|-----|------|------|
| Maven/Gradle/npm | {ver} | 构建工具 |
| Docker | {ver} | 容器化 |
| K8s | {ver} | 编排工具 |

---

## 目录结构

```
{项目根目录}/
├── .hafw/                          # hafw 配置
│   ├── actions/                   # 指令
│   └── spec/                   # 模版
├── src/                            # 源代码
│   ├── main/                       # 主代码
│   │   ├── java/                   # Java 代码
│   │   │   └── com/{company}/{project}/
│   │   │       ├── controller/     # 控制器层
│   │   │       ├── service/        # 服务层
│   │   │       ├── mapper/         # 数据访问层
│   │   │       ├── entity/         # 实体类
│   │   │       ├── dto/            # 数据传输对象
│   │   │       ├── config/         # 配置类
│   │   │       └── util/           # 工具类
│   │   └── resources/              # 资源文件
│   │       ├── application.yml     # 主配置
│   │       ├── application-dev.yml # 开发配置
│   │       ├── application-prod.yml# 生产配置
│   │       └── mapper/             # MyBatis Mapper
│   └── test/                       # 测试代码
│       └── java/
├── docs/                           # 文档
├── scripts/                        # 脚本
├── config/                         # 配置文件
├── docker/                         # Docker 配置
└── README.md                       # 项目说明
```

---

## 目录说明

| 路径 | 用途 | 文件类型 | 访问权限 |
|-----|------|---------|---------|
| `src/main/java` | 主代码 | .java | 读写 |
| `src/test/java` | 测试代码 | .java | 读写 |
| `src/main/resources` | 资源文件 | .yml, .xml | 读写 |
| `docs/` | 文档 | .md | 读写 |
| `scripts/` | 脚本 | .sh, .py | 执行 |

---

## 关键文件

| 文件 | 用途 | 说明 |
|-----|------|------|
| `pom.xml` / `build.gradle` | 构建配置 | 依赖管理 |
| `application.yml` | 应用配置 | 主配置文件 |
| `Dockerfile` | 容器配置 | 镜像构建 |
| `.gitignore` | Git 忽略 | 版本控制 |
| `README.md` | 项目说明 | 入门文档 |

---

## 模块划分

| 模块 | 路径 | 职责 | 依赖 |
|-----|------|------|------|
| {module} | `src/.../{module}` | {desc} | {deps} |

---

## 文件命名规范

| 类型 | 命名规则 | 示例 |
|-----|---------|------|
| 控制器 | `{Name}Controller` | `UserController` |
| 服务 | `{Name}Service` / `{Name}ServiceImpl` | `UserService` |
| Mapper | `{Name}Mapper` | `UserMapper` |
| 实体 | `{Name}` / `{Name}Entity` | `User` |
| DTO | `{Name}DTO` / `{Name}Request` / `{Name}Response` | `UserDTO` |
| 配置 | `{Name}Config` | `WebConfig` |
| 工具 | `{Name}Utils` / `{Name}Helper` | `DateUtils` |

---

## 验证状态

| 检查项 | 最后检查 | 状态 | 备注 |
|--------|---------|------|------|
| 目录结构完整性 | {date} | ✅/❌ | {note} |
| 文件命名规范性 | {date} | ✅/❌ | {note} |
| 配置文件有效性 | {date} | ✅/❌ | {note} |
| 文档完整性 | {date} | ✅/❌ | {note} |

---

## 过时检测标记

<!-- 自动扫描时更新以下标记 -->
- [ ] 代码中发现了新的目录结构但未记录
- [ ] 目录结构与标准规范不一致
- [ ] 关键文件缺失或位置变更
- [ ] 模块依赖关系与实际代码不符
- [ ] 超过 30 天未验证项目结构

**检测时间**: {ISO8601_TIMESTAMP}
**检测结果**: ✅ 最新 / ⚠️ 存在差异 / ❌ 需要更新
