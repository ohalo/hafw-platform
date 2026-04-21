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

## AI IDE 环境检测

不同的 AI IDE 环境有不同的安装方式，请先识别当前环境：

### 1. Cursor IDE
**特征检测**:
- 存在 `.cursor/` 目录
- 环境变量 `CURSOR_VERSION` 或 `CURSOR_CWD`

**安装方式**: 使用全局 npm 安装（见下方步骤 1）

### 2. Windsurf IDE
**特征检测**:
- 存在 `.windsurf/` 目录
- 环境变量 `WINDSURF_VERSION`

**安装方式**: 使用全局 npm 安装（见下方步骤 1）

### 3. Trae IDE
**特征检测**:
- 存在 `.trae/` 目录
- 环境变量 `TRAE_VERSION`

**安装方式**: 使用全局 npm 安装（见下方步骤 1）

### 4. GitHub Copilot / VS Code
**特征检测**:
- 存在 `.vscode/` 目录
- 环境变量 `VSCODE_CWD` 或 `VSCODE_PID`

**安装方式**: 使用全局 npm 安装（见下方步骤 1）

### 5. Claude Code (Anthropic)
**特征检测**:
- 环境变量 `CLAUDE_CODE_VERSION` 或 `ANTHROPIC_API_KEY`
- 命令行提示符显示 `claude>` 或 `claude-code>`
- 存在 `.claude/` 目录（部分版本）

**安装方式**: 使用全局 npm 安装（见下方步骤 1）

**特殊说明**: Claude Code 运行在独立终端环境中，可能需要手动同步 PATH:
```bash
# 在 Claude Code 中执行
!echo $PATH
# 确保包含 npm 全局 bin 目录
```

### 6. 通用 AI 助手 / 命令行环境
**特征检测**:
- 无特定 IDE 标识
- 纯终端/命令行环境

**安装方式**: 使用全局 npm 安装（见下方步骤 1）

### 环境检测脚本
```bash
#!/bin/bash
# 检测当前 AI IDE 环境

echo "=== AI IDE 环境检测 ==="

if [ -d ".cursor" ] || [ -n "$CURSOR_VERSION" ]; then
    echo "✅ 检测到: Cursor IDE"
    echo "安装方式: 全局 npm 安装"
elif [ -d ".windsurf" ] || [ -n "$WINDSURF_VERSION" ]; then
    echo "✅ 检测到: Windsurf IDE"
    echo "安装方式: 全局 npm 安装"
elif [ -d ".trae" ] || [ -n "$TRAE_VERSION" ]; then
    echo "✅ 检测到: Trae IDE"
    echo "安装方式: 全局 npm 安装"
elif [ -d ".vscode" ] || [ -n "$VSCODE_CWD" ]; then
    echo "✅ 检测到: VS Code / GitHub Copilot"
    echo "安装方式: 全局 npm 安装"
elif [ -n "$CLAUDE_CODE_VERSION" ] || [ -n "$ANTHROPIC_API_KEY" ] || [ -d ".claude" ]; then
    echo "✅ 检测到: Claude Code (Anthropic)"
    echo "安装方式: 全局 npm 安装"
    echo "注意: 可能需要手动同步 PATH 到 Claude Code 环境"
else
    echo "ℹ️ 检测到: 通用 AI 助手 / 命令行环境"
    echo "安装方式: 全局 npm 安装"
fi
```

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

### 检测 AI IDE 环境
```
/检测当前 AI IDE 环境
```

**AI 应执行**:
1. 检查是否存在 `.cursor/`、`.windsurf/`、`.trae/`、`.vscode/`、`.claude/` 目录
2. 检查环境变量 `CURSOR_VERSION`、`WINDSURF_VERSION`、`TRAE_VERSION`、`VSCODE_CWD`、`CLAUDE_CODE_VERSION`、`ANTHROPIC_API_KEY`
3. 报告检测到的 IDE 类型及对应的安装方式
4. 根据 IDE 类型提供针对性的安装建议

### 检测安装状态
```
/检查 HAFW 安装状态
```

**AI 应执行**:
1. 运行 `which hafw` 检测 CLI
2. 运行 `ls -la .hafw/ 2>/dev/null` 检测项目
3. 检测当前 AI IDE 环境类型
4. 报告状态并建议下一步

### 自动安装
```
/安装 HAFW
```

**AI 应执行**:
1. 先检测当前 AI IDE 环境
2. 根据 IDE 类型选择对应的安装方式
3. 按上述流程自动安装 CLI
4. 自动初始化项目
5. 验证并报告结果

### 快速开始
```
/初始化 HAFW 项目 [项目名称]
```

**AI 应执行**:
1. 检测当前 AI IDE 环境
2. 如未安装 CLI，先安装（使用 IDE 对应的方式）
3. 执行 `hafw init [项目名称]`
4. 显示项目上下文

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

### Q4: Cursor IDE 中无法识别 hafw 命令
**现象**: 在 Cursor 终端中提示 `hafw: command not found`
**解决**:
```bash
# 1. 检查 npm 全局安装路径
echo $(npm config get prefix)/bin

# 2. 将路径添加到 Cursor 环境
# 在 Cursor 设置中添加环境变量 PATH
# 或手动执行
export PATH="$(npm config get prefix)/bin:$PATH"

# 3. 重新加载终端后验证
hafw --version
```

### Q5: Windsurf IDE 中权限问题
**现象**: Windsurf 内置终端中 npm 全局安装失败
**解决**:
```bash
# 使用本地安装方式
npm install hafw-cli --save-dev

# 然后在 package.json 中添加脚本
{
  "scripts": {
    "hafw": "hafw"
  }
}

# 使用方式
npm run hafw -- init 项目名
```

### Q6: Trae IDE 环境变量不生效
**现象**: 安装成功后仍无法找到 hafw 命令
**解决**:
```bash
# 1. 检查 shell 配置文件
cat ~/.zshrc | grep npm
cat ~/.bashrc | grep npm

# 2. 手动添加环境变量到 ~/.zshrc 或 ~/.bashrc
export PATH="$(npm config get prefix)/bin:$PATH"

# 3. 重新加载配置
source ~/.zshrc  # 或 source ~/.bashrc
```

### Q7: VS Code + Copilot 中终端路径问题
**现象**: VS Code 集成终端与系统终端环境不一致
**解决**:
```bash
# 在 VS Code 设置中配置终端环境
# settings.json 中添加:
{
  "terminal.integrated.env.osx": {
    "PATH": "$(npm config get prefix)/bin:${env:PATH}"
  }
}

# 或使用绝对路径执行
$(npm config get prefix)/bin/hafw --version
```

### Q8: Claude Code 中 PATH 环境变量不一致
**现象**: 在系统终端可以运行 `hafw`，但在 Claude Code 中提示命令不存在
**解决**:
```bash
# 1. 在 Claude Code 中检查当前 PATH
!echo $PATH

# 2. 在系统终端获取完整 PATH 并复制
# 在系统终端执行:
echo $PATH

# 3. 在 Claude Code 中设置 PATH（临时）
!export PATH="/系统终端的PATH值"

# 4. 或者使用绝对路径运行 hafw
!$(npm config get prefix)/bin/hafw --version

# 5. 永久解决方案：在 Claude Code 配置中添加 PATH
# 编辑 ~/.claude/config.json 或启动时自动加载
```

### Q9: Claude Code 中 npm 全局安装后无法立即使用
**现象**: Claude Code 中执行 `npm install -g hafw-cli` 成功，但 `hafw` 命令不可用
**解决**:
```bash
# 方法 1: 重新加载 shell
!exec $SHELL -l

# 方法 2: 手动 source 配置文件
!source ~/.zshrc  # 或 ~/.bashrc

# 方法 3: 使用 npx 直接运行（无需全局安装）
!npx hafw-cli --version

# 方法 4: 本地安装到项目
!npm install hafw-cli --save-dev
!./node_modules/.bin/hafw --version
```

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
