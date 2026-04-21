---
name: hafw-deploy-build
description: "HAFW构建打包 - 执行项目构建、打包和镜像制作"
argument-hint: "[构建环境: dev|test|prod]"
---

# HAFW 构建打包指令

## 目标

执行项目的构建、测试、打包流程，生成可部署的制品（JAR/WAR、Docker 镜像等）。

## 输入

- 构建环境参数（dev/test/prod）
- 代码仓库
- 构建配置（pom.xml/build.gradle）

## 执行步骤

### 1. 环境准备

检查构建环境：
```bash
# 检查 Java 版本
java -version

# 检查 Maven/Gradle
mvn -version

# 检查 Docker（如需要）
docker --version
```

### 2. 代码质量检查

构建前执行质量检查：
```bash
# 代码规范检查
mvn checkstyle:check

# 单元测试
mvn test

# 测试覆盖率
mvn jacoco:report
```

### 3. 执行构建

#### 3.1 Maven 构建
```bash
# 清理并构建
mvn clean package -DskipTests

# 指定环境构建
mvn clean package -DskipTests -P{profile}

# 构建并生成源码包
mvn clean package source:jar javadoc:jar
```

#### 3.2 Gradle 构建
```bash
# 清理并构建
./gradlew clean build

# 指定环境构建
./gradlew clean build -Pprofile={env}
```

### 4. 构建产物验证

检查构建产物：
```bash
# 检查 JAR 文件
ls -lh target/*.jar

# 验证 JAR 内容
jar tf target/{artifact}-{version}.jar | head -20

# 检查 manifest
unzip -p target/{artifact}-{version}.jar META-INF/MANIFEST.MF
```

### 5. Docker 镜像构建

#### 5.1 生成 Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim

LABEL maintainer="HAFW Platform"
LABEL version="{version}"

# 设置工作目录
WORKDIR /app

# 复制 JAR 文件
COPY target/{artifact}-{version}.jar app.jar

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# 启动应用
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### 5.2 构建镜像
```bash
# 构建镜像
docker build -t {image-name}:{version} .

# 标记镜像
docker tag {image-name}:{version} {registry}/{image-name}:{version}

# 推送镜像到仓库
docker push {registry}/{image-name}:{version}
```

### 6. 生成构建报告

```markdown
# 构建报告

## 构建信息
| 项目 | 内容 |
|-----|------|
| 构建时间 | {timestamp} |
| 构建环境 | {env} |
| 代码版本 | {git-commit} |
| 构建结果 | 成功/失败 |

## 构建产物
| 产物 | 路径 | 大小 | 校验和 |
|-----|------|------|--------|
| JAR | target/{artifact}.jar | {size} | {checksum} |
| 源码 | target/{artifact}-sources.jar | {size} | {checksum} |

## 测试结果
| 类型 | 总数 | 通过 | 失败 | 跳过 |
|-----|------|------|------|------|
| 单元测试 | {total} | {passed} | {failed} | {skipped} |
| 集成测试 | {total} | {passed} | {failed} | {skipped} |

## 代码质量
| 指标 | 值 | 阈值 | 状态 |
|-----|----|------|------|
| 覆盖率 | {percent}% | 80% | ✅/❌ |
| 代码规范 | {issues} | 0 | ✅/❌ |
| 安全漏洞 | {count} | 0 | ✅/❌ |

## Docker 镜像
| 镜像 | 标签 | 大小 | 推送状态 |
|-----|------|------|---------|
| {image} | {tag} | {size} | ✅/❌ |
```

## 输出

### 构建产物
```
target/
├── {artifact}-{version}.jar              # 主程序包
├── {artifact}-{version}-sources.jar      # 源码包
├── {artifact}-{version}-javadoc.jar      # 文档包
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
```

### 构建报告
- 文件路径：`.hafw/{项目名称}/deployment/build-report-{timestamp}.md`

### 控制台输出

```
=== HAFW 构建打包结果 ===

构建环境: {env}
构建时间: {duration} 秒
构建结果: ✅ 成功

构建产物:
✅ {artifact}-{version}.jar ({size})
✅ {artifact}-{version}-sources.jar ({size})

测试结果:
✅ 单元测试: {passed}/{total} 通过
✅ 集成测试: {passed}/{total} 通过
✅ 代码覆盖率: {percent}%

Docker 镜像:
✅ {image-name}:{version} ({size})
✅ 已推送到: {registry}

构建报告: {path}

下一步建议:
1. 运行 /hafw-deploy-release 进行发布部署
2. 验证构建产物功能
3. 归档构建产物到制品库
```

## CI/CD 集成

### GitHub Actions 示例
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          
      - name: Build with Maven
        run: mvn clean package
        
      - name: Build Docker Image
        run: docker build -t {image}:${{ github.sha }} .
        
      - name: Push to Registry
        run: |
          docker push {image}:${{ github.sha }}
```

## 最佳实践

1. **版本管理**: 使用语义化版本（Semantic Versioning）
2. **可重复构建**: 确保相同代码构建出相同产物
3. **安全扫描**: 构建时进行依赖安全扫描
4. **制品管理**: 构建产物归档到制品库（Nexus/Artifactory）
5. **构建缓存**: 使用 Maven/Gradle 缓存加速构建
