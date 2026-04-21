---
name: hafw-qa-scan
description: "HAFW 代码质量扫描 - 执行代码质量检查和扫描"
argument-hint: "[扫描范围：all|modified|file-path]"
---

# HAFW 代码质量扫描指令

## 目标

对代码进行全面的质量扫描，识别潜在问题，生成质量报告。

## 扫描维度

| 维度 | 工具 | 检查内容 |
|-----|------|---------|
| 代码规范 | P3C/Checkstyle | 命名规范、格式规范 |
| 代码复杂度 | SonarQube | 圈复杂度、认知复杂度 |
| 安全漏洞 | SonarQube/SpotBugs | SQL注入、XSS、敏感信息 |
| 重复代码 | SonarQube | 代码重复率 |
| 测试覆盖 | JaCoCo | 单元测试覆盖率 |

## 执行步骤

### 1. 确定扫描范围

根据参数确定扫描范围：
- `all`: 扫描整个项目
- `modified`: 扫描变更的文件
- `file-path`: 扫描指定文件

### 2. 执行扫描

#### 2.1 代码规范扫描
```bash
mvn checkstyle:check
# 或
mvn com.github.futureprocessing:maven-sonar-plugin:check
```

#### 2.2 P3C 规范扫描
```bash
mvn p3c:check
```

#### 2.3 SonarQube 扫描
```bash
mvn sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.projectKey=hafw-project
```

#### 2.4 测试覆盖率
```bash
mvn jacoco:report
```

### 3. 结果分析

解析扫描结果，分类问题：

| 级别 | 定义 | 处理要求 |
|-----|------|---------|
| Blocker | 阻塞问题 | 必须立即修复 |
| Critical | 严重问题 | 必须修复 |
| Major | 主要问题 | 建议修复 |
| Minor | 次要问题 | 可选修复 |
| Info | 信息提示 | 参考 |

### 4. 生成质量报告

创建质量报告文档：

```markdown
# 代码质量扫描报告

## 扫描概览
- 扫描时间: {timestamp}
- 扫描范围: {scope}
- 代码总行数: {lines}
- 文件总数: {files}

## 问题统计
| 级别 | 数量 | 占比 |
|-----|------|------|
| Blocker | {count} | {percent}% |
| Critical | {count} | {percent}% |
| Major | {count} | {percent}% |
| Minor | {count} | {percent}% |
| Info | {count} | {percent}% |

## 详细问题列表

### Blocker Issues
1. [文件:行号] 问题描述
   - 建议修复方案

### Critical Issues
1. [文件:行号] 问题描述
   - 建议修复方案

## 质量指标
- 代码规范合规率: {percent}%
- 测试覆盖率: {percent}%
- 重复代码率: {percent}%
- 平均圈复杂度: {value}

## 修复建议
1. 优先修复 Blocker 和 Critical 级别问题
2. 对 Major 级别问题制定修复计划
3. 建立代码审查机制防止新问题引入
```

## 输出

### 控制台输出

```
=== HAFW 代码质量扫描结果 ===

扫描范围: {scope}
扫描文件: {count} 个
发现问题: {total} 个

问题分布:
  🔴 Blocker:  {count} 个
  🟠 Critical: {count} 个
  🟡 Major:    {count} 个
  🔵 Minor:    {count} 个
  ⚪ Info:     {count} 个

质量评分: {score}/100

详细报告: .hafw/{项目名称}/qa/quality-report-{date}.md

修复建议:
1. 立即修复 {blocker_count} 个 Blocker 级别问题
2. 本周内修复 {critical_count} 个 Critical 级别问题
3. 建立代码规范检查流水线
```

### 报告文件

保存到：`.hafw/{项目名称}/qa/quality-report-{YYYYMMDD}.md`

## 自动修复

对于部分问题，提供自动修复建议：

```bash
# 代码格式化
mvn spotless:apply

# 导入优化
mvn impsort:sort
```

## 集成建议

建议将质量扫描集成到：
1. **Git Hook**: 提交前自动扫描
2. **CI/CD Pipeline**: 构建时自动扫描
3. **IDE Plugin**: 实时检测代码问题
