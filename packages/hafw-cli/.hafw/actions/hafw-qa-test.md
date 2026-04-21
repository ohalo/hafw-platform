---
name: hafw-qa-test
description: "HAFW 质量测试 - 执行自动化测试并生成测试报告"
argument-hint: "[测试范围：unit|integration|e2e|all]"
---

# HAFW 质量测试指令

## 目标

执行全面的自动化测试，包括单元测试、集成测试和端到端测试，确保软件质量。

## 输入

- 测试范围（unit/integration/e2e/all）
- 测试代码
- 测试数据

## 执行步骤

### 1. 单元测试

```bash
# 执行单元测试
mvn test

# 指定测试类
mvn test -Dtest={TestClass}

# 生成覆盖率报告
mvn jacoco:report
```

### 2. 集成测试

```bash
# 执行集成测试
mvn verify -P integration-test

# 使用 TestContainers
mvn test -Dtest=*IntegrationTest
```

### 3. 端到端测试

```bash
# 执行 E2E 测试（使用 Cypress/Playwright）
npm run e2e

# 或 Selenium
mvn test -Dtest=*E2ETest
```

### 4. 性能测试

```bash
# 使用 JMeter
jmeter -n -t performance-test.jmx -l result.jtl

# 使用 Gatling
mvn gatling:test
```

### 5. 生成测试报告

```markdown
# 测试报告

## 测试概览
| 类型 | 总数 | 通过 | 失败 | 跳过 | 覆盖率 |
|-----|------|------|------|------|--------|
| 单元测试 | {total} | {passed} | {failed} | {skipped} | {percent}% |
| 集成测试 | {total} | {passed} | {failed} | {skipped} | {percent}% |
| E2E 测试 | {total} | {passed} | {failed} | {skipped} | - |

## 失败用例
| 用例 | 类型 | 错误信息 | 堆栈 |
|-----|------|---------|------|
| {name} | {type} | {message} | {stack} |

## 覆盖率详情
| 模块 | 行覆盖率 | 分支覆盖率 | 方法覆盖率 |
|-----|---------|-----------|-----------|
| {module} | {percent}% | {percent}% | {percent}% |

## 性能指标
| 指标 | 值 | 阈值 | 状态 |
|-----|----|------|------|
| 平均响应时间 | {ms}ms | < 200ms | ✅ |
| 95分位响应时间 | {ms}ms | < 500ms | ✅ |
| 吞吐量 | {tps} | > 100 | ✅ |
| 错误率 | {percent}% | < 0.1% | ✅ |
```

## 输出

### 测试报告
- 文件路径：`.hafw/{项目名称}/qa/test-report-{timestamp}.html`

### 覆盖率报告
- 文件路径：`target/site/jacoco/index.html`

### 控制台输出

```
=== HAFW 质量测试结果 ===

测试范围: {scope}
测试时间: {duration}

单元测试:
✅ 通过: {passed}/{total}
❌ 失败: {failed}
⏭️ 跳过: {skipped}
📊 覆盖率: {percent}%

集成测试:
✅ 通过: {passed}/{total}
❌ 失败: {failed}

E2E 测试:
✅ 通过: {passed}/{total}
❌ 失败: {failed}

性能测试:
✅ 平均响应: {ms}ms
✅ P95响应: {ms}ms
✅ 吞吐量: {tps} TPS
✅ 错误率: {percent}%

测试报告: {path}
覆盖率报告: target/site/jacoco/index.html

下一步建议:
1. 修复失败的测试用例
2. 提升测试覆盖率至 80%+
3. 优化性能瓶颈点
```
