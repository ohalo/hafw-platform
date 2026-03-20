# HAFW 规范模板说明

## 概述

本目录包含 HAFW 平台的标准规范模板，用于指导各阶段文档的生成。

## 模板清单

### 阶段文档模板

| 模板文件 | 用途 | 对应指令 |
|---------|------|---------|
| `requirement-spec.md` | 需求规范模板 (PRD) | `/hafw-req-spec` |
| `architecture-spec.md` | 架构设计规范模板 | `/hafw-design-arch` |
| `deployment-spec.md` | 部署规范模板 | `/hafw-deploy-release` |

### 上下文模板 (参考 context-builder)

| 模板文件 | 用途 | 对应指令 |
|---------|------|---------|
| `context-api.md` | API 上下文模板 | `/hafw-context-init`, `/hafw-context-scan` |
| `context-architecture.md` | 架构上下文模板 | `/hafw-context-init`, `/hafw-context-scan` |
| `context-data-models.md` | 数据模型上下文模板 | `/hafw-context-init`, `/hafw-context-scan` |
| `context-deployment.md` | 部署配置上下文模板 | `/hafw-context-init`, `/hafw-context-scan` |
| `context-coding-style.md` | 编码规范上下文模板 | `/hafw-context-init`, `/hafw-context-scan` |
| `context-project-structure.md` | 项目结构上下文模板 | `/hafw-context-init`, `/hafw-context-scan` |

## 模板使用说明

### 1. 需求规范模板 (requirement-spec.md)

**使用指令**: `/hafw-req-spec {需求ID}`

**生成文档路径**: `.hafw/{项目名称}/requirements/PRD-{需求ID}-{需求名称}.md`

**模板章节结构**:
1. 基本信息（需求ID、名称、优先级、状态等）
2. 背景与目标（业务背景、目标、成功指标）
3. 用户故事（目标用户、场景、验收标准）
4. 功能需求（功能清单、详细说明、业务规则、异常处理）
5. 非功能需求（性能、安全、可用性、兼容性）
6. 数据需求（数据实体、数据流、数据量预估）
7. 接口需求（内部/外部接口）
8. 界面原型（页面清单、原型链接）
9. 风险评估（风险清单、缓解措施）
10. 附录（术语表、参考资料、变更记录、评审记录）

---

### 2. 架构设计规范模板 (architecture-spec.md)

**使用指令**: `/hafw-design-arch {PRD-ID}`

**生成文档路径**: `.hafw/{项目名称}/design/ARCH-{架构ID}-{系统名称}.md`

**模板章节结构**:
1. 基本信息（架构ID、系统名称、版本、状态等）
2. 架构概述（设计目标、原则、技术选型）
3. 系统架构（整体架构图、分层设计）
4. 模块设计（模块划分、详细设计、接口设计、依赖关系）
5. 数据架构（数据模型、数据库设计、索引设计）
6. 接口架构（API设计规范、接口清单）
7. 安全架构（认证授权、数据安全、防护机制）
8. 性能架构（性能指标、优化策略、缓存策略）
9. 高可用架构（可用性目标、高可用设计、容灾备份）
10. 部署架构（部署拓扑、部署清单、资源规划）
11. 监控运维（监控体系、运维手册）
12. 风险评估（风险清单、缓解措施）
13. 附录（术语表、变更记录、评审记录）

---

### 3. 部署规范模板 (deployment-spec.md)

**使用指令**: `/hafw-deploy-release {环境} {版本号}`

**生成文档路径**: `.hafw/{项目名称}/deployment/DEP-{部署ID}-{环境}-{版本}.md`

**模板章节结构**:
1. 基本信息（部署ID、系统名称、版本、状态等）
2. 部署概述（目标、范围、环境）
3. 部署前检查（代码、配置、数据、依赖检查清单）
4. 部署方案（策略、流程、详细步骤）
5. 回滚方案（触发条件、回滚流程、回滚命令）
6. 验证方案（功能验证、性能验证、监控验证）
7. 监控配置（应用监控、日志监控、告警规则）
8. 应急预案（常见问题处理、紧急联系人）
9. 部署记录（部署日志、问题记录）
10. 附录（脚本清单、配置文件清单、变更记录）
11. 部署确认（检查项、确认人、时间）

---

## 模板引用方式

在各指令文件中，通过以下方式引用模板：

```markdown
## 参考模板

生成本文档时，请参考以下模板文件：
- **模板路径**: `.hafw/spec/{模板文件名}`
- **模板说明**: {模板描述}

生成文档时应遵循模板的章节结构，包括：
1. {章节1}
2. {章节2}
...
```

## 自定义模板

如需自定义模板，可复制现有模板并修改：

```bash
# 复制模板
cp requirement-spec.md requirement-spec-custom.md

# 修改模板内容
# ... 编辑 requirement-spec-custom.md

# 在指令中引用自定义模板
# 修改指令文件中的模板路径
```

## 上下文模板使用说明

### 初始化时生成

运行 `/hafw-context-init {项目名称}` 时，会自动基于以下模板生成上下文文件：

```
.hafw/{项目名称}/contexts/
├── index.md              # 上下文索引（自动生成）
├── api.md                # 基于 context-api.md
├── architecture.md       # 基于 context-architecture.md
├── data-models.md        # 基于 context-data-models.md
├── deployment.md         # 基于 context-deployment.md
├── coding-style.md       # 基于 context-coding-style.md
└── project-structure.md  # 基于 context-project-structure.md
```

### 过时检测机制

每个上下文模板都包含过时检测标记：

```markdown
## 过时检测标记

<!-- 自动扫描时更新以下标记 -->
- [ ] 代码中发现了新的 API 端点但未记录
- [ ] 已有 API 的签名与代码不一致
- [ ] 文档中的 API 在代码中已删除
- [ ] 超过 30 天未验证 API 可用性

**检测时间**: 2024-03-13T12:00:00Z
**检测结果**: ✅ 最新 / ⚠️ 存在差异 / ❌ 需要更新
```

### 扫描更新流程

1. **自动扫描**: `/hafw-context-scan --type=api`
   - 扫描代码中的 API 定义
   - 与现有上下文对比
   - 标记差异和过时内容

2. **查看差异**: 扫描结果会显示：
   - 新增内容
   - 变更内容
   - 删除内容
   - 过时标记

3. **更新上下文**: `/hafw-context-update api --merge`
   - 合并扫描结果
   - 保留手动修改
   - 更新过时标记

### 手动更新

可以直接编辑上下文文件：
```bash
# 编辑 API 上下文
vim .hafw/{项目名称}/contexts/api.md

# 更新后验证
/hafw-context-update --validate
```

## 模板版本管理

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| v1.0 | 2024-03-13 | 初始版本，包含需求、架构、部署三个模板 |
| v1.1 | 2024-03-13 | 新增上下文模板（API、架构、数据模型、部署、编码规范、项目结构） |

## 注意事项

1. **模板一致性**: 保持模板章节结构的一致性，便于文档管理
2. **必填字段**: 模板中的 `{占位符}` 为必填字段，生成文档时需要替换
3. **可选章节**: 根据实际需求，部分章节可以删减
4. **扩展章节**: 可根据项目需要添加自定义章节
