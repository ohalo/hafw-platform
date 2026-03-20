# HAFW 自动安装指南 (AI 智能体版)

**文档用途**: 供 AI 编程助手读取并自动执行 HAFW 平台安装

---

## 快速判断

### 检测 HAFW 是否已安装
```bash
# 检查 CLI 是否已安装
which hafw || npm list -g hafw-cli 2>/dev/null

# 检查项目是否已初始化
ls -la .hafw/*/project.json 2>/dev/null
```

### 安装状态判定
- 如果 `hafw` 命令存在 → CLI 已安装
- 如果 `.hafw/{项目名称}/project.json` 存在 → 项目已初始化
- 否则 → 需要执行安装流程

---

## 自动安装流程

### 步骤 1: 安装 HAFW CLI

**执行条件**: `hafw` 命令不存在

**执行命令**:
```bash
npm install -g hafw-cli
```

**验证安装**:
```bash
hafw --version
# 预期输出: 1.0.x
```

**错误处理**:
- 如果权限不足，使用: `sudo npm install -g hafw-cli`
- 如果 npm 不存在，提示用户先安装 Node.js

---

### 步骤 2: 初始化 HAFW 项目

**执行条件**: `.hafw/` 目录不存在或为空

**执行命令**:
```bash
# 使用当前目录名作为项目名称
PROJECT_NAME=$(basename "$PWD")
hafw init "$PROJECT_NAME"
```

**验证初始化**:
```bash
ls -la .hafw/*/project.json
# 预期: 显示 project.json 文件
```

**输出示例**:
```
=== HAFW 上下文初始化 ===

🆕 新项目初始化

项目名称: {project-name}
项目ID: HAFW-YYYYMMDD-XXXXXX

✅ 工作空间创建成功
✅ 目录结构初始化完成
✅ 配置文件初始化完成

项目状态: 🟢 已初始化
```

---

### 步骤 3: 验证安装结果

**执行命令**:
```bash
hafw context-show
```

**预期输出**:
```
=== HAFW 项目上下文 ===

项目: {project-name}
ID: HAFW-YYYYMMDD-XXXXXX
类型: {项目类型}
语言: {编程语言}
状态: initialized

执行阶段:
  ⬜ requirements: pending
  ⬜ design: pending
  ⬜ development: pending
  ⬜ quality: pending
  ⬜ deployment: pending
```

---

## 完整安装脚本 (一键执行)

```bash
#!/bin/bash
# HAFW 自动安装脚本

set -e

echo "=== HAFW 自动安装 ==="

# 1. 检查并安装 CLI
if ! command -v hafw &> /dev/null; then
    echo "📦 安装 HAFW CLI..."
    npm install -g hafw-cli
    echo "✅ CLI 安装成功"
else
    echo "✅ CLI 已安装: $(hafw --version)"
fi

# 2. 检查并初始化项目
PROJECT_NAME=$(basename "$PWD")
if [ ! -d ".hafw" ]; then
    echo "🆕 初始化 HAFW 项目: $PROJECT_NAME"
    hafw init "$PROJECT_NAME"
else
    echo "✅ 项目已初始化"
fi

# 3. 验证安装
echo "🔍 验证安装..."
hafw context-show

echo ""
echo "🎉 HAFW 安装完成！"
echo ""
echo "下一步:"
echo "  hafw req-analysis '你的需求描述'"
```

---

## AI 智能体执行指令

### 检测安装状态
```
/检查 HAFW 安装状态
```

**AI 应执行**:
1. 运行 `which hafw` 检测 CLI
2. 运行 `ls -la .hafw/ 2>/dev/null` 检测项目
3. 报告状态并建议下一步

### 自动安装
```
/安装 HAFW
```

**AI 应执行**:
1. 按上述流程自动安装 CLI
2. 自动初始化项目
3. 验证并报告结果

### 快速开始
```
/初始化 HAFW 项目 [项目名称]
```

**AI 应执行**:
1. 如未安装 CLI，先安装
2. 执行 `hafw init [项目名称]`
3. 显示项目上下文

---

## 目录结构说明

安装完成后生成的结构:

```
项目根目录/
├── .hafw/
│   └── {项目名称}/
│       ├── project.json          # 项目配置
│       ├── contexts/             # 多维度上下文
│       │   ├── index.md          # 上下文索引
│       │   ├── api.md            # API 上下文
│       │   ├── architecture.md   # 架构上下文
│       │   ├── data-models.md    # 数据模型上下文
│       │   ├── development.md    # 开发配置上下文
│       │   ├── coding-style.md   # 编码规范上下文
│       │   └── project-structure.md # 项目结构上下文
│       ├── requirements/         # 需求上下文
│       ├── architecture/         # 架构上下文
│       ├── design/               # 设计上下文
│       ├── development/          # 开发上下文
│       ├── quality/              # 质量上下文
│       └── deployment/           # 部署上下文
└── ... (原有项目文件)
```

---

## 常见问题

### Q1: npm 安装权限不足
**解决**: 
```bash
sudo npm install -g hafw-cli
# 或
npm config set prefix ~/.npm-global
npm install -g hafw-cli
export PATH="$HOME/.npm-global/bin:$PATH"
```

### Q2: 项目已存在
**解决**:
```bash
# 强制重新初始化
hafw init {项目名称} --force
```

### Q3: 检测不到项目类型
**现象**: 初始化后显示 "Unknown" 类型
**解决**: 手动更新 `.hafw/{项目}/project.json` 中的 type 和 language 字段

---

## 下一步操作

安装完成后，AI 智能体可执行:

| 指令 | 说明 |
|------|------|
| `hafw req-analysis "需求描述"` | 开始需求分析 |
| `hafw context-show` | 查看项目上下文 |
| `hafw help-cmd` | 显示所有可用指令 |

---

## 版本信息

- **CLI 版本**: 1.0.1
- **文档版本**: 2026-03-20
- **适用平台**: macOS, Linux, Windows (with WSL)

---

**注意**: 本文档供 AI 智能体解析执行，人类用户请参考 INSTALL.md
