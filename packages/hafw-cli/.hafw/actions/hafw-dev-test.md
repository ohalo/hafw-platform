---
name: hafw-dev-test
description: "HAFW 测试代码生成 - 为生成的代码自动生成单元测试和集成测试"
argument-hint: "[目标代码文件或模块名称]"
---

# HAFW 测试代码生成指令

## 目标

为已生成的代码自动生成全面的单元测试和集成测试，确保代码质量和功能正确性。

## 输入

- 目标代码文件路径
- 对应的业务逻辑
- 数据模型定义

## 执行步骤

### 1. 分析目标代码

读取目标代码，分析：
- 类和方法结构
- 依赖关系
- 业务逻辑分支
- 异常处理点

### 2. 生成测试策略

根据代码特点选择测试策略：

| 代码类型 | 测试类型 | 框架 | 覆盖率目标 |
|---------|---------|------|-----------|
| Service | 单元测试 | JUnit + Mockito | 80%+ |
| Controller | 集成测试 | Spring Boot Test | 70%+ |
| Mapper | 集成测试 | @MybatisTest | 60%+ |
| Util | 单元测试 | JUnit | 90%+ |

### 3. 生成测试用例

#### 3.1 正常场景测试
```java
@Test
void test{MethodName}_Success() {
    // Given
    when({mock}).thenReturn({value});
    
    // When
    {ResultType} result = {service}.{method}({params});
    
    // Then
    assertNotNull(result);
    assertEquals({expected}, result);
    verify({mock}).{method}({args});
}
```

#### 3.2 异常场景测试
```java
@Test
void test{MethodName}_{ExceptionScenario}() {
    // Given
    when({mock}).thenThrow({exception});
    
    // When & Then
    assertThrows({ExceptionType}.class, () -> {
        {service}.{method}({params});
    });
}
```

#### 3.3 边界条件测试
```java
@Test
void test{MethodName}_Boundary_{Condition}() {
    // 测试边界值：空值、最大值、最小值等
}
```

### 4. 生成测试代码

```java
@ExtendWith(MockitoExtension.class)
class {ServiceName}Test {

    @Mock
    private {Dependency} {dependency};

    @InjectMocks
    private {ServiceName} {serviceName};

    private {Entity} test{Entity};

    @BeforeEach
    void setUp() {
        test{Entity} = new {Entity}();
        test{Entity}.setId(1L);
        // 初始化测试数据
    }

    @Test
    @DisplayName("{描述} - 成功场景")
    void test{Method}_Success() {
        // 测试代码
    }

    @Test
    @DisplayName("{描述} - 异常场景")
    void test{Method}_{Exception}() {
        // 测试代码
    }

    @Test
    @DisplayName("{描述} - 边界条件")
    void test{Method}_Boundary() {
        // 测试代码
    }
}
```

### 5. 生成集成测试

```java
@SpringBootTest
@AutoConfigureMockMvc
class {ControllerName}IntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("API 集成测试 - {场景}")
    void test{ApiName}_{Scenario}() throws Exception {
        // Given
        {RequestType} request = new {RequestType}();
        // 设置请求数据

        // When & Then
        mockMvc.perform(post("/api/{endpoint}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").exists());
    }
}
```

### 6. 生成测试数据

```java
public class {Entity}TestData {
    
    public static {Entity} createValid{Entity}() {
        {Entity} entity = new {Entity}();
        entity.setId(1L);
        // 设置有效数据
        return entity;
    }

    public static {Entity} createInvalid{Entity}() {
        {Entity} entity = new {Entity}();
        // 设置无效数据
        return entity;
    }

    public static List<{Entity}> create{Entity}List(int size) {
        return IntStream.range(0, size)
                .mapToObj(i -> createValid{Entity}())
                .collect(Collectors.toList());
    }
}
```

## 输出

### 测试文件
```
src/test/java/com/hafw/{module}/
├── {Service}Test.java           # 单元测试
├── {Controller}IntegrationTest.java  # 集成测试
├── {Mapper}Test.java            # 数据访问测试
└── util/
    └── {Entity}TestData.java    # 测试数据
```

### 测试报告
- 文件路径：`.hafw/{项目名称}/qa/test-report-{日期}.md`

### 控制台输出

```
=== HAFW 测试代码生成结果 ===

目标模块: {模块名称}
生成测试: {count} 个

测试覆盖:
✅ 单元测试: {count} 个
✅ 集成测试: {count} 个
✅ 边界测试: {count} 个
✅ 异常测试: {count} 个

生成文件:
- {Service}Test.java
- {Controller}IntegrationTest.java
- {Entity}TestData.java

测试数据:
- 有效数据场景: {count} 个
- 无效数据场景: {count} 个
- 边界条件: {count} 个

运行测试:
mvn test -Dtest={Service}Test

覆盖率报告:
mvn jacoco:report

下一步建议:
1. 运行测试验证代码正确性
2. 检查测试覆盖率
3. 补充遗漏的测试场景
```

## 最佳实践

1. **独立性**: 每个测试用例独立，不依赖执行顺序
2. **可重复性**: 测试用例可重复执行，结果一致
3. **可读性**: 测试方法名清晰描述测试场景
4. **覆盖率**: 核心业务逻辑覆盖率 >= 80%
5. **Mock 原则**: 只 Mock 外部依赖，不 Mock 被测代码
