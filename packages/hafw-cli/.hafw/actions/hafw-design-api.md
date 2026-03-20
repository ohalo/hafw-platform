---
description: "HAFW API设计 - 基于PRD和架构设计生成API接口规范"
argument-hint: "[PRD文档ID或模块名称]"
---

# HAFW API 设计指令

## 目标

基于需求规范和架构设计，生成完整的 API 接口规范，包括 RESTful API 定义、请求/响应格式、错误码等。

## 输入

- PRD 文档中的功能需求
- 数据模型定义
- 架构设计中的接口层设计

## 执行步骤

### 1. 分析功能模块

从 PRD 中提取功能模块：
- 模块划分
- 功能点列表
- 涉及的数据操作（CRUD）

### 2. 设计 API 端点

为每个功能设计 RESTful API：

| 操作 | HTTP方法 | URL | 说明 |
|-----|---------|-----|------|
| 创建 | POST | /api/{resource} | 创建资源 |
| 查询列表 | GET | /api/{resource} | 查询列表（支持分页、筛选） |
| 查询详情 | GET | /api/{resource}/{id} | 查询单个资源 |
| 更新 | PUT/PATCH | /api/{resource}/{id} | 更新资源 |
| 删除 | DELETE | /api/{resource}/{id} | 删除资源 |

### 3. 生成 API 规范文档

```markdown
# API 接口规范

## 1. 接口概述
### 1.1 基础信息
- 基础 URL: `https://api.example.com/v1`
- 协议: HTTPS
- 数据格式: JSON
- 字符编码: UTF-8

### 1.2 通用请求头
| 头部 | 必填 | 说明 |
|-----|------|------|
| Content-Type | 是 | application/json |
| Authorization | 是 | Bearer {token} |
| X-Request-ID | 否 | 请求追踪ID |

### 1.3 通用响应格式
```json
{
    "code": 200,
    "message": "success",
    "data": {},
    "timestamp": 1710320400000
}
```

## 2. 接口列表

### 2.1 {模块名称}

#### 2.1.1 {接口名称}
- **接口地址**: `POST /api/{resource}`
- **接口说明**: {功能说明}

**请求参数：**
| 参数 | 类型 | 必填 | 说明 | 示例 |
|-----|------|------|------|------|
| {param} | {type} | {required} | {desc} | {example} |

**请求示例：**
```json
{
    "field1": "value1",
    "field2": "value2"
}
```

**响应参数：**
| 参数 | 类型 | 说明 |
|-----|------|------|
| {field} | {type} | {desc} |

**响应示例：**
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "field1": "value1"
    }
}
```

**错误码：**
| 错误码 | 说明 |
|--------|------|
| 400 | 参数错误 |
| 401 | 未授权 |
| 404 | 资源不存在 |

## 3. 数据模型

### 3.1 {模型名称}
| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| {field} | {type} | {required} | {desc} |

## 4. 错误码定义
| 错误码 | 说明 | HTTP状态码 |
|--------|------|-----------|
| 200 | 成功 | 200 |
| 400 | 请求参数错误 | 400 |
| 401 | 未授权 | 401 |
| 403 | 禁止访问 | 403 |
| 404 | 资源不存在 | 404 |
| 500 | 服务器内部错误 | 500 |

## 5. 分页规范
### 5.1 请求参数
| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| page | int | 否 | 页码，默认1 |
| size | int | 否 | 每页数量，默认10 |

### 5.2 响应格式
```json
{
    "code": 200,
    "data": {
        "list": [],
        "total": 100,
        "page": 1,
        "size": 10
    }
}
```

## 6. 安全机制
### 6.1 认证方式
- JWT Token 认证
- Token 有效期：2小时
- Refresh Token 有效期：7天

### 6.2 限流策略
- 单用户：100次/分钟
- 单IP：1000次/分钟
```

### 4. 生成接口代码

生成 Controller 接口定义：

```java
@RestController
@RequestMapping("/api/{resource}")
@Tag(name = "{模块名称}", description = "{模块说明}")
public class {Resource}Controller {

    @PostMapping
    @Operation(summary = "创建{资源}")
    public Result<{Resource}DTO> create(@RequestBody @Valid {Resource}CreateRequest request) {
        // 实现
    }

    @GetMapping
    @Operation(summary = "查询{资源}列表")
    public Result<PageResult<{Resource}DTO>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        // 实现
    }

    @GetMapping("/{id}")
    @Operation(summary = "查询{资源}详情")
    public Result<{Resource}DTO> getById(@PathVariable Long id) {
        // 实现
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新{资源}")
    public Result<{Resource}DTO> update(@PathVariable Long id, 
                                        @RequestBody @Valid {Resource}UpdateRequest request) {
        // 实现
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除{资源}")
    public Result<Void> delete(@PathVariable Long id) {
        // 实现
    }
}
```

## 输出

### API 规范文档
- 文件路径：`.hafw/{项目名称}/design/API-{需求ID}-{模块名称}.md`

### Postman Collection
- 文件路径：`.hafw/{项目名称}/design/postman/{模块名称}.json`

### 控制台输出

```
=== HAFW API 设计结果 ===

API 文档: API-{需求ID}-{模块名称}.md
接口数量: {count} 个

接口列表:
✅ POST   /api/{resource}      - 创建{资源}
✅ GET    /api/{resource}      - 查询列表
✅ GET    /api/{resource}/{id} - 查询详情
✅ PUT    /api/{resource}/{id} - 更新
✅ DELETE /api/{resource}/{id} - 删除

生成文件:
- API 文档: {path}
- Postman Collection: {path}
- Controller 代码: {path}

设计要点:
- RESTful 规范: ✅
- 分页支持: ✅
- 错误处理: ✅
- 安全认证: ✅

下一步建议:
1. 导入 Postman Collection 进行接口测试
2. 运行 /hafw-dev-code 生成完整代码
3. 配置 Swagger UI 查看接口文档
```
