# HAFW 部署规范模板

## 基本信息

| 项目 | 内容 |
|-----|------|
| 部署ID | DEP-{YYYYMMDD}-{序号} |
| 系统名称 | {系统名称} |
| 版本 | v{版本号} |
| 部署日期 | {YYYY-MM-DD} |
| 部署人 | {部署人姓名} |
| 关联架构 | {架构ID} |
| 关联需求 | {需求ID} |
| 状态 | 待部署/部署中/已部署/已回滚 |

---

## 1. 部署概述

### 1.1 部署目标
{描述本次部署的目标和范围}

### 1.2 部署范围
| 组件 | 版本 | 部署方式 | 说明 |
|-----|------|---------|------|
| {组件1} | v{x.x.x} | 滚动/蓝绿/金丝雀 | {说明} |
| {组件2} | v{x.x.x} | 滚动/蓝绿/金丝雀 | {说明} |

### 1.3 部署环境
| 环境 | 地址 | 配置 | 状态 |
|-----|------|------|------|
| 开发环境 | {地址} | {配置} | 已部署 |
| 测试环境 | {地址} | {配置} | 已部署 |
| 预发布环境 | {地址} | {配置} | 已部署 |
| 生产环境 | {地址} | {配置} | 待部署 |

---

## 2. 部署前检查

### 2.1 代码检查清单
- [ ] 代码已合并到发布分支
- [ ] 代码已通过 Code Review
- [ ] 代码已通过自动化测试
- [ ] 代码扫描无高危漏洞

### 2.2 配置检查清单
- [ ] 配置文件已更新
- [ ] 配置参数已验证
- [ ] 密钥证书已准备
- [ ] 环境变量已配置

### 2.3 数据检查清单
- [ ] 数据库脚本已准备
- [ ] 数据迁移脚本已测试
- [ ] 回滚脚本已准备
- [ ] 数据备份已完成

### 2.4 依赖检查清单
- [ ] 第三方服务可用性检查
- [ ] 中间件版本兼容性检查
- [ ] 接口契约检查
- [ ] 资源配额检查

---

## 3. 部署方案

### 3.1 部署策略
| 策略 | 说明 | 适用场景 |
|-----|------|---------|
| 滚动部署 | 逐个替换实例 | 无状态服务 |
| 蓝绿部署 | 两套环境切换 | 有状态服务 |
| 金丝雀部署 | 灰度发布 | 高风险变更 |

本次部署采用: **{策略名称}**

### 3.2 部署流程

```
部署准备
    │
    ▼
┌─────────────────┐
│   停止流量      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   备份数据      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   部署应用      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   数据迁移      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   健康检查      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   恢复流量      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   监控验证      │
└─────────────────┘
```

### 3.3 部署步骤

#### 步骤 1: 部署准备
```bash
# 1.1 切换到发布分支
git checkout release/v{x.x.x}

# 1.2 拉取最新代码
git pull origin release/v{x.x.x}

# 1.3 检查版本号
mvn help:evaluate -Dexpression=project.version

# 1.4 构建打包
mvn clean package -DskipTests
```

#### 步骤 2: 数据备份
```bash
# 2.1 备份数据库
mysqldump -h{host} -u{user} -p{password} {database} > backup_{date}.sql

# 2.2 备份配置文件
cp application.yml application.yml.backup.{date}

# 2.3 备份日志
tar -czvf logs_backup_{date}.tar.gz /var/log/{app}/
```

#### 步骤 3: 应用部署
```bash
# 3.1 停止旧版本
kubectl scale deployment {app} --replicas=0

# 3.2 更新镜像
kubectl set image deployment/{app} {app}={image}:v{x.x.x}

# 3.3 启动新版本
kubectl scale deployment {app} --replicas={replicas}

# 3.4 等待就绪
kubectl rollout status deployment/{app}
```

#### 步骤 4: 数据迁移
```bash
# 4.1 执行 DDL
mysql -h{host} -u{user} -p{password} {database} < ddl.sql

# 4.2 执行 DML
mysql -h{host} -u{user} -p{password} {database} < dml.sql

# 4.3 验证数据
mysql -h{host} -u{user} -p{password} -e "SELECT COUNT(*) FROM {table}"
```

#### 步骤 5: 健康检查
```bash
# 5.1 检查 Pod 状态
kubectl get pods -l app={app}

# 5.2 检查服务状态
curl http://{host}:{port}/actuator/health

# 5.3 检查日志
kubectl logs -l app={app} --tail=100

# 5.4 检查指标
curl http://{host}:{port}/actuator/metrics
```

#### 步骤 6: 流量切换
```bash
# 6.1 更新负载均衡配置
kubectl apply -f ingress-v{x.x.x}.yaml

# 6.2 验证流量
curl http://{host}/api/health

# 6.3 监控流量分布
kubectl top pods -l app={app}
```

---

## 4. 回滚方案

### 4.1 回滚触发条件
- [ ] 部署后健康检查失败
- [ ] 错误率超过阈值 ({X}%)
- [ ] 响应时间超过阈值 ({X}ms)
- [ ] 业务功能异常
- [ ] 人工决策回滚

### 4.2 回滚流程

```
发现问题
    │
    ▼
┌─────────────────┐
│   停止流量      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   回滚应用      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   回滚数据      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   健康检查      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   恢复流量      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   问题排查      │
└─────────────────┘
```

### 4.3 回滚命令

```bash
# 1. 停止流量
kubectl apply -f ingress-maintenance.yaml

# 2. 回滚应用
kubectl rollout undo deployment/{app}

# 或指定版本回滚
kubectl set image deployment/{app} {app}={image}:v{x.x.x-1}

# 3. 回滚数据
mysql -h{host} -u{user} -p{password} {database} < rollback_{date}.sql

# 4. 验证回滚
kubectl get pods -l app={app}
curl http://{host}:{port}/actuator/health

# 5. 恢复流量
kubectl apply -f ingress-v{x.x.x-1}.yaml
```

---

## 5. 验证方案

### 5.1 功能验证
| 验证项 | 验证方法 | 预期结果 | 实际结果 |
|-------|---------|---------|---------|
| {功能1} | {方法} | {预期} | {实际} |
| {功能2} | {方法} | {预期} | {实际} |

### 5.2 性能验证
| 指标 | 目标值 | 实际值 | 结果 |
|-----|--------|--------|------|
| 响应时间 | < {X}ms | {值} | ✅/❌ |
| 吞吐量 | > {X} TPS | {值} | ✅/❌ |
| 错误率 | < {X}% | {值} | ✅/❌ |
| CPU使用率 | < {X}% | {值} | ✅/❌ |
| 内存使用率 | < {X}% | {值} | ✅/❌ |

### 5.3 监控验证
| 监控项 | 检查方法 | 状态 |
|-------|---------|------|
| 应用日志 | 检查错误日志 | ✅/❌ |
| 调用链 | 检查链路完整性 | ✅/❌ |
| 告警规则 | 触发测试告警 | ✅/❌ |
| 仪表盘 | 检查数据展示 | ✅/❌ |

---

## 6. 监控配置

### 6.1 应用监控
```yaml
# Prometheus 监控配置
apiVersion: v1
kind: ServiceMonitor
metadata:
  name: {app}-monitor
spec:
  selector:
    matchLabels:
      app: {app}
  endpoints:
  - port: metrics
    interval: 15s
    path: /actuator/prometheus
```

### 6.2 日志监控
```yaml
# Fluentd 日志收集配置
<source>
  @type tail
  path /var/log/{app}/*.log
  pos_file /var/log/{app}/fluentd.pos
  tag {app}.logs
  <parse>
    @type json
  </parse>
</source>
```

### 6.3 告警规则
```yaml
# Prometheus 告警规则
groups:
- name: {app}-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
```

---

## 7. 应急预案

### 7.1 常见问题处理

#### 问题 1: 部署失败
**现象:** {描述}
**原因:** {分析}
**处理:**
```bash
{处理命令}
```

#### 问题 2: 服务启动失败
**现象:** {描述}
**原因:** {分析}
**处理:**
```bash
{处理命令}
```

#### 问题 3: 数据库连接失败
**现象:** {描述}
**原因:** {分析}
**处理:**
```bash
{处理命令}
```

### 7.2 紧急联系人
| 角色 | 姓名 | 电话 | 邮箱 |
|-----|------|------|------|
| 运维负责人 | {姓名} | {电话} | {邮箱} |
| 开发负责人 | {姓名} | {电话} | {邮箱} |
| 产品负责人 | {姓名} | {电话} | {邮箱} |

---

## 8. 部署记录

### 8.1 部署日志
| 时间 | 操作 | 操作人 | 结果 | 备注 |
|-----|------|--------|------|------|
| {时间} | {操作} | {姓名} | 成功/失败 | {备注} |

### 8.2 问题记录
| 时间 | 问题描述 | 解决方案 | 状态 |
|-----|---------|---------|------|
| {时间} | {描述} | {方案} | 已解决/待解决 |

---

## 9. 附录

### 9.1 脚本清单
| 脚本名称 | 用途 | 路径 |
|---------|------|------|
| deploy.sh | 部署脚本 | scripts/deploy.sh |
| rollback.sh | 回滚脚本 | scripts/rollback.sh |
| health_check.sh | 健康检查 | scripts/health_check.sh |

### 9.2 配置文件清单
| 文件名称 | 用途 | 路径 |
|---------|------|------|
| application-prod.yml | 生产配置 | config/application-prod.yml |
| k8s-deployment.yaml | K8s部署 | k8s/deployment.yaml |
| k8s-service.yaml | K8s服务 | k8s/service.yaml |

### 9.3 变更记录
| 版本 | 日期 | 变更内容 | 变更人 |
|-----|------|---------|--------|
| v1.0 | {日期} | 初始版本 | {姓名} |

---

## 部署确认

| 检查项 | 检查结果 | 确认人 | 时间 |
|-------|---------|--------|------|
| 代码检查 | ✅/❌ | {姓名} | {时间} |
| 配置检查 | ✅/❌ | {姓名} | {时间} |
| 数据检查 | ✅/❌ | {姓名} | {时间} |
| 部署执行 | ✅/❌ | {姓名} | {时间} |
| 功能验证 | ✅/❌ | {姓名} | {时间} |
| 性能验证 | ✅/❌ | {姓名} | {时间} |
| 监控验证 | ✅/❌ | {姓名} | {时间} |

**部署结果:** ✅ 成功 / ❌ 失败 / ⏸️ 已回滚

**备注:**
{备注内容}
