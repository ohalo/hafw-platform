---
name: hafw-deploy-monitor
description: "HAFW 监控运维 - 配置监控告警和运维管理"
argument-hint: "[应用名称] [监控环境]"
---

# HAFW 监控运维指令

## 目标

配置应用的监控告警体系，建立运维管理流程，确保系统稳定运行。

## 输入

- 应用名称
- 监控环境
- 告警联系人

## 执行步骤

### 1. 监控体系设计

设计监控覆盖维度：

| 维度 | 监控项 | 工具 | 采集频率 |
|-----|--------|------|---------|
| 基础设施 | CPU、内存、磁盘、网络 | Prometheus | 15s |
| 应用性能 | 响应时间、吞吐量、错误率 | Prometheus | 15s |
| 业务指标 | 订单量、用户数、转化率 | Prometheus | 1min |
| 日志监控 | 错误日志、访问日志 | ELK/Loki | 实时 |
| 链路追踪 | 请求链路、依赖关系 | SkyWalking/Jaeger | 实时 |
| 用户体验 | 页面加载时间、API 延迟 | RUM | 实时 |

### 2. 配置指标采集

#### 2.1 Prometheus 配置
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'hafw-app'
    static_configs:
      - targets: ['app:8080']
    metrics_path: '/actuator/prometheus'
    
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

#### 2.2 应用埋点
```java
// 自定义指标
@Component
public class BusinessMetrics {
    
    private final Counter orderCounter = Counter.build()
            .name("orders_total")
            .help("Total orders")
            .labelNames("status")
            .register();
    
    private final Histogram requestDuration = Histogram.build()
            .name("request_duration_seconds")
            .help("Request duration")
            .buckets(0.1, 0.5, 1.0, 2.0, 5.0)
            .register();
    
    public void recordOrder(String status) {
        orderCounter.labels(status).inc();
    }
}
```

### 3. 配置告警规则

#### 3.1 Prometheus Alert Rules
```yaml
# alert-rules.yml
groups:
  - name: hafw-app-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}%"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile latency is {{ $value }}s"
          
      - alert: ServiceDown
        expr: up{job="hafw-app"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "Service {{ $labels.instance }} is down"
```

#### 3.2 Alertmanager 配置
```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alert@example.com'

route:
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty'
      continue: true
    - match:
        severity: warning
      receiver: 'slack'

receivers:
  - name: 'default'
    email_configs:
      - to: 'ops@example.com'
        
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: '<key>'
        
  - name: 'slack'
    slack_configs:
      - api_url: '<webhook>'
        channel: '#alerts'
```

### 4. 配置日志收集

#### 4.1 Filebeat 配置
```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /logs/application/*.log
    fields:
      app: hafw-app
      env: production
    multiline.pattern: '^\d{4}-\d{2}-\d{2}'
    multiline.negate: true
    multiline.match: after

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "hafw-app-%{+yyyy.MM.dd}"
```

### 5. 配置链路追踪

#### 5.1 SkyWalking Agent
```bash
# 启动参数
java -javaagent:/skywalking/agent/skywalking-agent.jar \
  -Dskywalking.agent.service_name=hafw-app \
  -Dskywalking.collector.backend_service=skywalking-oap:11800 \
  -jar app.jar
```

### 6. 配置 Grafana 仪表盘

```json
{
  "dashboard": {
    "title": "HAFW Application Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      }
    ]
  }
}
```

### 7. 生成监控配置

```yaml
# monitoring-config.yml
monitoring:
  app_name: {app-name}
  environment: {env}
  
  metrics:
    enabled: true
    endpoint: /actuator/prometheus
    interval: 15s
    
  tracing:
    enabled: true
    sampler: 0.1
    
  logging:
    level: INFO
    format: json
    retention: 30d
    
  alerting:
    channels:
      - type: email
        recipients: [ops@example.com]
      - type: slack
        webhook: https://hooks.slack.com/...
      - type: pagerduty
        key: xxx
        
    rules:
      - name: high-error-rate
        condition: error_rate > 1%
        severity: critical
        
      - name: high-latency
        condition: p95_latency > 500ms
        severity: warning
        
      - name: service-down
        condition: up == 0
        severity: critical
```

## 输出

### 监控配置包
```
monitoring/
├── prometheus/
│   ├── prometheus.yml
│   └── alert-rules.yml
├── alertmanager/
│   └── alertmanager.yml
├── grafana/
│   └── dashboards/
│       └── hafw-dashboard.json
├── filebeat/
│   └── filebeat.yml
└── skywalking/
    └── agent-config/
```

### 运维手册
- 文件路径：`.hafw/{项目名称}/deployment/ops-manual-{app-name}.md`

### 控制台输出

```
=== HAFW 监控运维配置结果 ===

应用名称: {app-name}
监控环境: {env}
配置状态: ✅ 完成

监控体系:
✅ 指标采集: Prometheus (15s 间隔)
✅ 日志收集: Filebeat + Elasticsearch
✅ 链路追踪: SkyWalking
✅ 可视化: Grafana
✅ 告警通知: Email + Slack + PagerDuty

告警规则:
✅ 高错误率: error_rate > 1% (Critical)
✅ 高延迟: p95 > 500ms (Warning)
✅ 服务宕机: up == 0 (Critical)
✅ 高 CPU: cpu > 80% (Warning)
✅ 高内存: memory > 85% (Warning)

配置清单:
- Prometheus: monitoring/prometheus/prometheus.yml
- Alert Rules: monitoring/prometheus/alert-rules.yml
- Alertmanager: monitoring/alertmanager/alertmanager.yml
- Grafana Dashboard: monitoring/grafana/dashboards/hafw-dashboard.json
- Filebeat: monitoring/filebeat/filebeat.yml

访问地址:
📊 Grafana: http://grafana.example.com/d/hafw-app
🔍 Kibana: http://kibana.example.com/app/hafw-app
🌐 SkyWalking: http://skywalking.example.com/

运维手册: {path}

常用命令:
# 查看应用指标
curl http://{app}/actuator/prometheus

# 查看实时日志
kubectl logs -f deployment/{app-name} --tail=100

# 手动触发告警测试
curl -X POST http://alertmanager:9093/-/reload

下一步建议:
1. 部署监控组件到 Kubernetes
2. 验证告警通道正常工作
3. 培训运维团队使用监控体系
```

## 运维流程

### 日常巡检
| 时间 | 检查项 | 工具 | 负责人 |
|-----|--------|------|--------|
| 每日 9:00 | 系统健康检查 | Grafana | 运维 |
| 每日 14:00 | 日志异常检查 | Kibana | 运维 |
| 每周一 | 性能趋势分析 | Grafana | 开发 |
| 每月初 | 容量规划评估 | Prometheus | 架构 |

### 应急响应
| 级别 | 定义 | 响应时间 | 处理流程 |
|-----|------|---------|---------|
| P0 | 服务完全不可用 | 5分钟 | 立即回滚，通知全员 |
| P1 | 核心功能受损 | 15分钟 | 紧急修复，通知相关人 |
| P2 | 非核心功能异常 | 1小时 | 排期修复 |
| P3 | 轻微问题 | 1天 | 下个版本修复 |

## 最佳实践

1. **监控全覆盖**: 基础设施、应用、业务三层监控
2. **告警分级**: 根据严重程度设置不同响应级别
3. **可观测性**: 指标、日志、追踪三位一体
4. **自动化**: 自动发现、自动告警、自动恢复
5. **持续优化**: 定期 review 告警有效性，减少误报
