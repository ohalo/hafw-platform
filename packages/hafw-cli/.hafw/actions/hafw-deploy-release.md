---
description: "HAFW发布部署 - 执行应用发布和部署到目标环境"
argument-hint: "[目标环境: dev|test|staging|prod] [版本号]"
---

# HAFW 发布部署指令

## 目标

将构建好的应用制品部署到目标环境，执行发布流程，确保服务平稳上线。

## 输入

- 目标环境（dev/test/staging/prod）
- 版本号
- 部署配置

## 执行步骤

### 1. 部署前检查

验证部署条件：
```bash
# 检查目标环境连通性
ping {target-host}

# 检查资源容量
docker system df
kubectl top nodes

# 检查依赖服务状态
kubectl get pods -n {namespace}
```

### 2. 备份当前版本

生产环境部署前备份：
```bash
# 备份数据库
mysqldump -h {host} -u {user} -p {database} > backup-{timestamp}.sql

# 备份配置文件
kubectl get configmap {app-config} -o yaml > config-backup-{timestamp}.yaml

# 标记当前版本
kubectl label deployment {app} current-version={version}
```

### 3. 数据库迁移

执行数据库变更：
```bash
# 使用 Flyway
mvn flyway:migrate

# 使用 Liquibase
mvn liquibase:update

# 手动执行 SQL
mysql -h {host} -u {user} -p {database} < migration-{version}.sql
```

### 4. 应用部署

#### 4.1 Docker 部署
```bash
# 拉取镜像
docker pull {registry}/{image}:{version}

# 停止旧容器
docker stop {container-name}
docker rm {container-name}

# 启动新容器
docker run -d \
  --name {container-name} \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE={env} \
  -v /logs:/app/logs \
  {registry}/{image}:{version}
```

#### 4.2 Kubernetes 部署
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {app-name}
  namespace: {namespace}
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: {app-name}
        image: {registry}/{image}:{version}
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
```

```bash
# 应用部署
kubectl apply -f deployment.yaml

# 滚动更新
kubectl set image deployment/{app-name} {container}={registry}/{image}:{version}

# 查看滚动状态
kubectl rollout status deployment/{app-name}
```

### 5. 健康检查

验证部署结果：
```bash
# 检查 Pod 状态
kubectl get pods -l app={app-name}

# 检查服务健康
kubectl get svc {service-name}

# 测试应用接口
curl -f http://{service-url}/actuator/health

# 检查日志
kubectl logs -l app={app-name} --tail=100
```

### 6. 流量切换

使用 Ingress/Service 切换流量：
```bash
# 蓝绿部署 - 切换 Service 指向
kubectl patch service {service-name} -p '{"spec":{"selector":{"version":"{new-version}"}}}'

# 金丝雀发布 - 调整权重
kubectl annotate ingress {ingress-name} nginx.ingress.kubernetes.io/canary-weight="10"
```

### 7. 生成部署报告

```markdown
# 部署报告

## 部署信息
| 项目 | 内容 |
|-----|------|
| 部署时间 | {timestamp} |
| 目标环境 | {env} |
| 应用版本 | {version} |
| 部署方式 | 滚动更新/蓝绿/金丝雀 |
| 部署结果 | 成功/失败/回滚 |

## 部署过程
| 阶段 | 开始时间 | 结束时间 | 耗时 | 状态 |
|-----|---------|---------|------|------|
| 环境检查 | {time} | {time} | {duration} | ✅ |
| 数据备份 | {time} | {time} | {duration} | ✅ |
| 数据库迁移 | {time} | {time} | {duration} | ✅ |
| 应用部署 | {time} | {time} | {duration} | ✅ |
| 健康检查 | {time} | {time} | {duration} | ✅ |
| 流量切换 | {time} | {time} | {duration} | ✅ |

## 资源状态
| 资源类型 | 名称 | 状态 | 副本数 |
|---------|------|------|--------|
| Deployment | {app-name} | Running | 3/3 |
| Service | {service-name} | Active | - |
| Ingress | {ingress-name} | Active | - |
| Pod | {pod-name} | Running | 1/1 |

## 健康指标
| 指标 | 值 | 阈值 | 状态 |
|-----|----|------|------|
| 响应时间 | {ms} | < 200ms | ✅ |
| 错误率 | {percent}% | < 0.1% | ✅ |
| CPU 使用率 | {percent}% | < 70% | ✅ |
| 内存使用率 | {percent}% | < 80% | ✅ |

## 回滚计划
如发现问题，执行以下命令回滚：
```bash
# Kubernetes 回滚
kubectl rollout undo deployment/{app-name}

# Docker 回滚
docker stop {new-container}
docker start {old-container}
```
```

## 输出

### 部署报告
- 文件路径：`.hafw/{项目名称}/deployment/DEP-{env}-{timestamp}.md`

### 控制台输出

```
=== HAFW 发布部署结果 ===

目标环境: {env}
应用版本: {version}
部署方式: 滚动更新
部署结果: ✅ 成功

部署过程:
✅ 环境检查: 通过
✅ 数据备份: 完成 ({size})
✅ 数据库迁移: 成功 ({count} 个变更)
✅ 应用部署: 完成 (3/3 Pod 就绪)
✅ 健康检查: 通过
✅ 流量切换: 完成

资源状态:
✅ Deployment: {app-name} (3/3 replicas)
✅ Service: {service-name} (Active)
✅ Ingress: {ingress-name} (Active)

健康指标:
✅ 响应时间: {ms} (阈值: 200ms)
✅ 错误率: {percent}% (阈值: 0.1%)
✅ CPU: {percent}% (阈值: 70%)
✅ 内存: {percent}% (阈值: 80%)

部署报告: {path}

监控面板: {grafana-url}
日志查询: {kibana-url}

⚠️ 注意事项:
- 请持续监控应用指标 30 分钟
- 如发现异常，立即执行回滚
- 回滚命令: kubectl rollout undo deployment/{app-name}

下一步建议:
1. 运行 /hafw-deploy-monitor 配置监控告警
2. 观察业务指标 30 分钟
3. 通知相关人员部署完成
```

## 部署策略

| 策略 | 适用场景 | 特点 |
|-----|---------|------|
| 滚动更新 | 常规发布 | 逐步替换，零停机 |
| 蓝绿部署 | 重大变更 | 快速切换，可立即回滚 |
| 金丝雀 | 风险发布 | 小流量验证，逐步放量 |
| 灰度发布 | 用户分级 | 按用户分组发布 |

## 回滚机制

自动触发回滚条件：
- 错误率 > 1%
- 响应时间 > 5s
- Pod 重启次数 > 3
- 健康检查失败

手动回滚命令：
```bash
# Kubernetes
kubectl rollout undo deployment/{app-name}

# 查看历史版本
kubectl rollout history deployment/{app-name}

# 回滚到指定版本
kubectl rollout undo deployment/{app-name} --to-revision={revision}
```

## 参考模板

生成本文档时，请参考以下模板文件：
- **模板路径**: `hafw-platform/spec/deployment-spec.md`
- **模板说明**: HAFW 部署规范模板，包含完整的部署文档结构

生成文档时应遵循模板的章节结构，包括：
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
