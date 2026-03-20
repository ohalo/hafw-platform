---
description: "HAFW代码智能生成 - 基于需求和设计生成高质量代码"
argument-hint: "[功能需求ID或描述]"
---

# HAFW 代码智能生成指令

## 目标

基于已分析的需求和设计，自动生成高质量的代码实现。

## 前置条件

- 已完成需求分析（/hafw-req-analysis）
- 已完成架构设计（/hafw-design-arch）
- 工作空间上下文已构建（/asdm-context-build）

## 输入

- 需求文档路径（通过 $ARGUMENTS 或自动检测）
- 架构设计文档
- 工作空间上下文

## 执行步骤

### 1. 加载上下文与检查任务列表

#### 1.1 读取相关文档
- 需求文档：`.hafw/{项目名称}/requirements/`
- 架构文档：`.hafw/{项目名称}/architecture/`
- 上下文文档：`.hafw/{项目名称}/contexts/`

#### 1.2 检查任务列表（前置条件）

**开发前必须确认任务列表存在**：
```bash
# 检查任务清单文件是否存在
TASKS_FILE=".hafw/{项目名称}/requirements/TASKS-{需求ID}.md"

if [ ! -f "$TASKS_FILE" ]; then
    echo "⚠️ 任务清单不存在，请先运行 /hafw-req-breakdown 生成任务列表"
    exit 1
fi
```

**读取当前任务状态**：
- 查看待开发任务（⬜ 未开始 / 🔄 待开发）
- 确认任务依赖是否已完成
- 标记当前任务为「🔄 开发中」

**任务状态流转**：
```
⬜ 未开始 → 🔄 待开发 → 🔄 开发中 → 🔄 待测试 → ✅ 已完成
```

### 2. 代码生成策略

根据技术栈选择代码生成策略：

| 技术栈 | 代码模板 | 生成策略 |
|-------|---------|---------|
| Java/Spring Boot | Controller-Service-Repository | 分层架构 |
| Python/FastAPI | Router-Service-Model | 模块化 |
| TypeScript/NestJS | Controller-Service-Entity | 领域驱动 |

### 3. 代码生成流程

#### 3.1 实体类生成
```java
// 根据数据模型生成实体类
@Entity
@Table(name = "{table_name}")
public class {EntityName} {
    // 字段定义
    // 关联关系
    // 业务方法
}
```

#### 3.2 数据访问层生成
```java
// 生成 Repository/Mapper
@Repository
public interface {Entity}Repository extends JpaRepository<{Entity}, Long> {
    // 自定义查询方法
}
```

#### 3.3 业务逻辑层生成
```java
// 生成 Service
@Service
public class {Entity}Service {
    // CRUD 方法
    // 业务方法
    // 事务控制
}
```

#### 3.4 控制层生成
```java
// 生成 Controller
@RestController
@RequestMapping("/api/{entity}")
public class {Entity}Controller {
    // REST API 端点
    // 参数校验
    // 异常处理
}
```

### 4. 代码质量检查

生成的代码应满足：
- [ ] 符合编码规范
- [ ] 包含必要的注释
- [ ] 处理异常情况
- [ ] 包含日志记录
- [ ] 参数校验完整

### 5. 测试代码生成

同步生成单元测试：
```java
@SpringBootTest
public class {Entity}ServiceTest {
    // 测试用例
    // Mock 数据
    // 断言验证
}
```

### 6. 同步更新任务列表（必需步骤）

**开发完成后必须更新任务状态**：

#### 6.1 更新任务状态
```bash
# 将当前任务标记为已完成
/hafw-task-update {任务ID} status=已完成
```

#### 6.2 更新任务清单文件
修改 `.hafw/{项目名称}/requirements/TASKS-{需求ID}.md`：
- 更新任务状态：🔄 开发中 → ✅ 已完成
- 填写完成时间
- 更新进度统计

#### 6.3 任务完成检查清单
- [ ] 代码已提交/保存
- [ ] 单元测试已通过
- [ ] 任务状态已更新为「✅ 已完成」
- [ ] 进度统计已更新
- [ ] 下一步任务已标记为「🔄 待开发」

**示例更新内容**：
```markdown
### 任务 X: {任务名称}
| 属性 | 内容 |
|-----|------|
| 任务ID | T00X |
| 状态 | ✅ 已完成 |  ← 更新状态
| 完成时间 | 2025-03-18 |  ← 填写完成时间
```

## 输出

### 生成的文件

```
src/
├── main/
│   ├── java/com/hafw/{module}/
│   │   ├── entity/
│   │   │   └── {Entity}.java
│   │   ├── mapper/
│   │   │   └── {Entity}Mapper.java
│   │   ├── service/
│   │   │   ├── {Entity}Service.java
│   │   │   └── impl/{Entity}ServiceImpl.java
│   │   ├── controller/
│   │   │   └── {Entity}Controller.java
│   │   └── dto/
│   │       └── {Entity}DTO.java
│   └── resources/
│       └── mapper/{Entity}Mapper.xml
└── test/
    └── java/com/hafw/{module}/
        └── service/{Entity}ServiceTest.java
```

### 生成报告

```
=== HAFW 代码生成报告 ===

生成功能: {功能名称}
生成文件: {文件数量} 个
代码行数: {总行数} 行
测试覆盖: {测试数量} 个
任务状态: ✅ 已更新

生成文件列表:
1. {文件路径1} - {说明}
2. {文件路径2} - {说明}
...

任务更新:
✅ T00X: {任务名称} - 已完成
➡️ T00Y: {下一个任务} - 待开发

注意事项:
- 请检查生成的代码是否符合业务逻辑
- 需要手动补充复杂的业务规则
- 任务列表已自动更新

下一步建议:
➡️ /hafw-dev-test {模块名称}
   为生成的代码生成单元测试

➡️ /hafw-dev-review {代码路径}
   进行代码质量审查

➡️ /hafw-req-breakdown {需求ID}
   如需继续开发下一个任务

或者查看智能推荐:
➡️ 运行 /hafw-workflow-guide next
```

## 最佳实践

1. **代码复用**: 优先使用现有代码和组件
2. **设计模式**: 合理应用设计模式
3. **安全性**: 包含必要的安全控制
4. **性能**: 考虑性能优化点
5. **可维护性**: 代码结构清晰，易于维护
