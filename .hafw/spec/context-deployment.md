# HAFW 部署配置上下文模板

## 基本信息

| 项目 | 内容 |
|-----|------|
| 上下文ID | DEPLOY-{YYYYMMDD}-{序号} |
| 所属项目 | {项目名称} |
| 版本 | v{版本号} |
| 最后更新 | {YYYY-MM-DD HH:mm:ss} |
| 更新方式 | 手动/自动扫描 |
| 状态 | ✅ 最新 / ⚠️ 需更新 / ❌ 过时 |

---

## 部署概览

### 环境清单
| 环境 | 类型 | 地址 | 状态 | 最后部署 |
|-----|------|------|------|---------|
| dev | 开发 | {url} | ✅/❌ | {date} |
| test | 测试 | {url} | ✅/❌ | {date} |
| staging | 预发布 | {url} | ✅/❌ | {date} |
| prod | 生产 | {url} | ✅/❌ | {date} |

### 部署方式
- [ ] Docker Compose
- [ ] Kubernetes
- [ ] Serverless
- [ ] 传统服务器
- [ ] 云服务 (AWS/阿里云/腾讯云)

---

## 基础设施

### 服务器配置
| 环境 | 实例类型 | CPU | 内存 | 存储 | 数量 |
|-----|---------|-----|------|------|------|
| {env} | {type} | {cpu} | {mem} | {disk} | {count} |

### 网络配置
| 配置项 | 值 | 说明 |
|--------|----|------|
| VPC | {vpc} | 虚拟私有云 |
| 子网 | {subnet} | 子网划分 |
| 安全组 | {sg} | 防火墙规则 |
| 负载均衡 | {lb} | 流量分发 |

---

## 容器配置

### Docker 配置
```yaml
version: '3.8'
services:
  {service}:
    image: {image}:{tag}
    ports:
      - "{host}:{container}"
    environment:
      - {env}={value}
    volumes:
      - {host}:{container}
```

### Kubernetes 配置
```yaml
apiVersion: apps/v1
kind: development
metadata:
  name: {app-name}
spec:
  replicas: {count}
  template:
    spec:
      containers:
      - name: {app}
        image: {image}:{tag}
```

---

## CI/CD 配置

### 构建流程
```mermaid
graph LR
    A[代码提交] --> B[构建]
    B --> C[测试]
    C --> D[打包]
    D --> E[部署]
```

### 流水线配置
| 阶段 | 触发条件 | 执行命令 | 超时时间 |
|-----|---------|---------|---------|
| Build | 代码提交 | {cmd} | {time} |
| Test | Build成功 | {cmd} | {time} |
| Deploy | Test成功 | {cmd} | {time} |

---

## 环境变量

### 通用配置
| 变量名 | 说明 | 默认值 | 环境 |
|--------|------|--------|------|
| {VAR} | {desc} | {default} | all |

### 环境特定配置
| 变量名 | dev | test | staging | prod |
|--------|-----|------|---------|------|
| {VAR} | {val} | {val} | {val} | {val} |

---

## 监控告警

### 监控指标
| 指标 | 类型 | 阈值 | 告警级别 |
|-----|------|------|---------|
| CPU使用率 | 资源 | > 70% | Warning |
| 内存使用率 | 资源 | > 80% | Critical |
| 响应时间 | 性能 | > 500ms | Warning |
| 错误率 | 质量 | > 1% | Critical |

### 告警渠道
| 级别 | 渠道 | 接收人 |
|-----|------|--------|
| Warning | 邮件/钉钉 | {group} |
| Critical | 电话/短信 | {person} |

---

## 验证状态

| 检查项 | 最后检查 | 状态 | 备注 |
|--------|---------|------|------|
| 配置文件有效性 | {date} | ✅/❌ | {note} |
| 环境变量完整性 | {date} | ✅/❌ | {note} |
| 部署脚本可用性 | {date} | ✅/❌ | {note} |
| 监控配置正确性 | {date} | ✅/❌ | {note} |

---

## 过时检测标记

<!-- 自动扫描时更新以下标记 -->
- [ ] 配置文件与实际部署不一致
- [ ] 环境变量在代码中有变更但未更新
- [ ] 部署脚本与当前环境不兼容
- [ ] 监控规则与实际指标不匹配
- [ ] 超过 30 天未验证部署配置

**检测时间**: {ISO8601_TIMESTAMP}
**检测结果**: ✅ 最新 / ⚠️ 存在差异 / ❌ 需要更新
