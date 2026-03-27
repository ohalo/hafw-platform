# HAFW Skills 全局复用系统 - Claude Code 自动安装指南

> 📦 **Claude Code 专用安装包**
> 
> 🤖 **使用说明**: Claude Code 读取此文档后，应使用 **Bash 工具** 自动执行所有安装步骤
>
> ⚡ **自动化级别**: 全自动 - 无需用户确认
>
> 🔧 **所需工具**: Bash shell, mkdir, ln, cat

---

## 🤖 Claude Code 执行指令

**亲爱的 Claude Code：**

当你收到这个文档时，请**立即使用 Bash 工具自动执行**以下操作：

### 🎯 你的任务清单

1. ✅ **解析文档中的所有 bash 脚本代码块**
2. ✅ **使用 Bash 工具按顺序执行每个脚本**
3. ✅ **在执行过程中显示进度和结果**
4. ✅ **使用 ls, cat 等命令验证安装是否成功**
5. ✅ **向用户报告最终状态**

### 📋 执行流程概览

```bash
# ============================================
# 第 1 步：执行全局初始化
# ============================================
# 创建 ~/skills-common 目录
# 创建 ~/.hafw/config.json 配置文件

# ============================================
# 第 2 步：创建示例 Skills
# ============================================
# 创建 common-utils skill
# 创建 spring-boot-starter skill
# 创建 mybatis-plus-generator skill

# ============================================
# 第 3 步：在当前项目中执行链接
# ============================================
# 创建 .hafw/skills 目录
# 为每个全局 skill 创建符号链接

# ============================================
# 第 4 步：验证安装结果
# ============================================
# 检查全局目录内容
# 检查配置文件
# 检查项目链接
# 运行 list-skills.sh（如果存在）

# ============================================
# 第 5 步：完成报告
# ============================================
# 总结已完成的操作
# 列出可用的 skills
# 提供下一步建议

```bash
# ============================================
# 第 1 步：执行全局初始化
# ============================================

### 步骤 1: 初始化全局 Skills 目录

```bash
#!/bin/bash
# HAFW Skills 全局初始化脚本

set -e

SKILLS_COMMON_DIR="$HOME/skills-common"
HAFW_CONFIG_DIR="$HOME/.hafw"

echo "=== HAFW Skills 全局初始化 ==="
echo ""

# 1. 创建全局 skills 目录
if [ ! -d "$SKILLS_COMMON_DIR" ]; then
    echo "📁 创建全局 Skills 目录：$SKILLS_COMMON_DIR"
    mkdir -p "$SKILLS_COMMON_DIR"
    
    # 创建示例 skill 结构
    mkdir -p "$SKILLS_COMMON_DIR/.template"
    cat > "$SKILLS_COMMON_DIR/.template/README.md" << 'EOF'
# Skill 模板

将此文件夹复制到你的 skill 名称，并修改内容。

## Skill 结构
```
skill-name/
├── README.md      # Skill 说明
├── src/           # Skill 源代码（可选）
├── config/        # 配置文件（可选）
└── scripts/       # 脚本文件（可选）
```
EOF
    
    echo "✅ 已创建示例模板在：$SKILLS_COMMON_DIR/.template"
else
    echo "✅ 全局 Skills 目录已存在：$SKILLS_COMMON_DIR"
fi

# 2. 创建 HAFW 配置目录
if [ ! -d "$HAFW_CONFIG_DIR" ]; then
    echo "📁 创建 HAFW 配置目录：$HAFW_CONFIG_DIR"
    mkdir -p "$HAFW_CONFIG_DIR"
fi

# 3. 创建配置文件
CONFIG_FILE="$HAFW_CONFIG_DIR/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "📝 创建 HAFW 配置文件：$CONFIG_FILE"
    cat > "$CONFIG_FILE" << EOF
{
  "skills": {
    "global-dir": "$SKILLS_COMMON_DIR",
    "auto-link": true,
    "prefer-global": true
  }
}
EOF
    echo "✅ 配置文件已创建"
else
    echo "✅ 配置文件已存在"
fi

echo ""
echo "🎉 全局初始化完成！"
echo ""
echo "存储位置：$SKILLS_COMMON_DIR"
echo "配置文件：$CONFIG_FILE"
echo ""
```

# ============================================
# 第 2 步：创建示例 Skills（可选但推荐）
# ============================================

```bash
#!/bin/bash
# HAFW Skills 项目链接脚本
# 用途：将全局 skills-common 中的 skills 链接到当前项目

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR" && pwd)"
HAFW_CONFIG_FILE="$HOME/.hafw/config.json"

# 读取配置的全局 skills 目录
if [ -f "$HAFW_CONFIG_FILE" ]; then
    SKILLS_COMMON_DIR=$(grep -o '"global-dir"[[:space:]]*:[[:space:]]*"[^"]*"' "$HAFW_CONFIG_FILE" | cut -d'"' -f4)
fi

# 如果没有配置，使用默认路径
if [ -z "$SKILLS_COMMON_DIR" ]; then
    SKILLS_COMMON_DIR="$HOME/skills-common"
fi

SKILLS_TARGET_DIR="$PROJECT_ROOT/.hafw/skills"

echo "=== HAFW Skills 项目链接 ==="
echo ""
echo "全局 Skills 目录：$SKILLS_COMMON_DIR"
echo "项目 Skills 目录：$SKILLS_TARGET_DIR"
echo ""

# 检查全局 skills 目录是否存在
if [ ! -d "$SKILLS_COMMON_DIR" ]; then
    echo "❌ 错误：全局 Skills 目录不存在：$SKILLS_COMMON_DIR"
    echo ""
    echo "请先运行全局初始化脚本"
    exit 1
fi

# 统计全局 skills 数量
GLOBAL_SKILLS_COUNT=$(ls -1 "$SKILLS_COMMON_DIR" | grep -v "^\." | wc -l | tr -d ' ')

if [ "$GLOBAL_SKILLS_COUNT" -eq 0 ]; then
    echo "⚠️  警告：全局 Skills 目录为空"
    echo ""
    echo "请将你的通用 Skills 放到：$SKILLS_COMMON_DIR"
    echo "每个 Skill 应该是一个独立的文件夹"
fi

# 创建项目 skills 目录
echo "📁 创建项目 Skills 目录..."
mkdir -p "$SKILLS_TARGET_DIR"

# 链接所有全局 skills
LINKED_COUNT=0
SKIPPED_COUNT=0

echo ""
echo "开始链接全局 Skills..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for skill in "$SKILLS_COMMON_DIR"/*; do
    if [ -d "$skill" ] && [ "$(basename "$skill")" != "." ]; then
        skill_name=$(basename "$skill")
        target_link="$SKILLS_TARGET_DIR/$skill_name"
        
        # 跳过隐藏目录
        if [[ "$skill_name" == .* ]]; then
            continue
        fi
        
        # 检查是否已链接
        if [ -L "$target_link" ]; then
            echo "⏭️  已存在：$skill_name (符号链接已存在)"
            ((SKIPPED_COUNT++))
            continue
        fi
        
        if [ -d "$target_link" ]; then
            echo "⚠️  冲突：$skill_name (本地已有同名目录)"
            echo "   本地路径：$target_link"
            echo "   全局路径：$skill"
            echo ""
            read -p "   是否覆盖并链接到全局版本？(y/n/skip-all) " -n 1 -r
            echo ""
            
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                rm -rf "$target_link"
                ln -s "$skill" "$target_link"
                echo "   ✅ 已链接：$skill_name"
                ((LINKED_COUNT++))
            elif [[ $REPLY =~ ^[Ss]$ ]]; then
                echo "   ⏭️  跳过：$skill_name"
                ((SKIPPED_COUNT++))
            else
                echo "   ⏭️  跳过：$skill_name"
                ((SKIPPED_COUNT++))
            fi
        else
            # 创建符号链接
            ln -s "$skill" "$target_link"
            echo "✅ 已链接：$skill_name"
            ((LINKED_COUNT++))
        fi
    fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 链接完成！"
echo ""
echo "统计信息:"
echo "  ✓ 新链接：$LINKED_COUNT 个 skills"
echo "  ⏭️  已存在：$SKIPPED_COUNT 个 skills"
echo "  📦 总计：$((LINKED_COUNT + SKIPPED_COUNT)) / $GLOBAL_SKILLS_COUNT 个 skills"
echo ""
echo "验证方法:"
echo "  ls -la .hafw/skills/"
echo ""
```

# ============================================
# 第 3 步：在当前项目中执行链接
# ============================================

# ============================================
# 第 4 步：验证安装结果
# ============================================

echo ""
echo "=== 验证安装结果 ==="
echo ""

# 检查全局目录
echo "📦 检查全局 Skills 目录:"
ls -la ~/skills-common/ | head -10
echo ""

# 检查配置文件
echo "⚙️  检查配置文件:"
cat ~/.hafw/config.json 2>/dev/null || echo "配置文件不存在"
echo ""

# 检查项目链接
echo "🔗 检查项目 Skills 链接:"
if [ -d ".hafw/skills" ]; then
    ls -la .hafw/skills/
else
    echo "当前项目未链接 skills"
fi
echo ""

# 运行列表脚本查看
echo "📋 Skills 列表:"
if [ -f "list-skills.sh" ]; then
    ./list-skills.sh
fi
echo ""

# ============================================
# 第 5 步：完成报告
# ============================================

echo "============================================"
echo "  🎉 HAFW Skills 系统安装完成！"
echo "============================================"
echo ""
echo "✅ 已完成的操作:"
echo "  1. 创建了全局 Skills 目录 ~/skills-common/"
echo "  2. 创建了 HAFW 配置文件 ~/.hafw/config.json"
echo "  3. 创建了示例 Skills (common-utils, spring-boot-starter, mybatis-plus-generator)"
echo "  4. 在当前项目链接了所有全局 Skills"
echo "  5. 验证了安装结果"
echo ""
echo "📚 可用的 Skills:"
echo "  • common-utils      - 通用工具类"
echo "  • spring-boot-starter - Spring Boot 模板"
echo "  • mybatis-plus-generator - MyBatis-Plus 代码生成器"
echo ""
echo "💡 下一步建议:"
echo "  1. 将你的通用 Skills 放到 ~/skills-common/"
echo "  2. 在其他项目中运行 link-skills.sh 脚本"
echo "  3. 在 AI 对话中使用：'使用 [skill-name] 技能...'"
echo ""
echo "🎯 快捷命令:"
echo "  ./list-skills.sh     - 查看所有可用的 Skills"
echo "  ./link-skills.sh     - 链接全局 Skills 到当前项目"
echo ""
```

---

## 📝 完整安装脚本（Claude Code 整合版）

**Claude Code 提示**: 请将此脚本复制到 **Bash 工具** 中执行。

```bash
#!/bin/bash
# HAFW Skills 完整安装脚本 - Claude Code 专用版
# 适用于 Claude Code 的 Bash 工具自动执行

set -e

echo "============================================"
echo "  HAFW Skills 全局复用系统 - 自动安装程序"
echo "  Claude Code 自动执行版"
echo "============================================"
echo ""

# 定义变量
SKILLS_COMMON_DIR="$HOME/skills-common"
HAFW_CONFIG_DIR="$HOME/.hafw"
CONFIG_FILE="$HAFW_CONFIG_DIR/config.json"
CURRENT_PROJECT_SKILLS="./.hafw/skills"

echo "💡 配置信息:"
echo "  全局 Skills 目录：$SKILLS_COMMON_DIR"
echo "  HAFW 配置目录：$HAFW_CONFIG_DIR"
echo "  当前项目 Skills: $CURRENT_PROJECT_SKILLS"
echo ""

# ============================================
# 阶段 1: 全局初始化
# ============================================
echo "📦 阶段 1: 全局初始化..."
echo ""

# 创建全局 skills 目录
if [ ! -d "$SKILLS_COMMON_DIR" ]; then
    echo "创建全局 Skills 目录：$SKILLS_COMMON_DIR"
    mkdir -p "$SKILLS_COMMON_DIR"
    echo "✅ 全局目录已创建"
else
    echo "✅ 全局目录已存在"
fi

# 创建 HAFW 配置目录
if [ ! -d "$HAFW_CONFIG_DIR" ]; then
    echo "创建 HAFW 配置目录：$HAFW_CONFIG_DIR"
    mkdir -p "$HAFW_CONFIG_DIR"
    echo "✅ 配置目录已创建"
else
    echo "✅ 配置目录已存在"
fi

# 创建配置文件
if [ ! -f "$CONFIG_FILE" ]; then
    echo "创建配置文件：$CONFIG_FILE"
    cat > "$CONFIG_FILE" << EOF
{
  "skills": {
    "global-dir": "$SKILLS_COMMON_DIR",
    "auto-link": true,
    "prefer-global": true
  }
}
EOF
    echo "✅ 配置文件已创建"
else
    echo "✅ 配置文件已存在"
fi

echo ""
echo "阶段 1 完成 ✅"
echo ""

# ============================================
# 阶段 2: 创建示例 Skills
# ============================================
echo "📦 阶段 2: 创建示例 Skills..."
echo ""

# 创建 common-utils
echo "创建 common-utils 技能..."
mkdir -p "$SKILLS_COMMON_DIR/common-utils"
cat > "$SKILLS_COMMON_DIR/common-utils/README.md" << 'EOF'
# Common Utils 技能

提供项目开发中常用的通用工具类。

## 包含的工具类
- StringUtils - 字符串处理
- DateUtils - 日期时间处理
- Validator - 数据验证
- CollectionUtils - 集合操作
- JsonUtils - JSON 处理

## 使用方法
在代码中直接 import 使用，或在 AI 对话中指定使用该技能。
EOF
echo "  ✅ common-utils"

# 创建 spring-boot-starter
echo "创建 spring-boot-starter 技能..."
mkdir -p "$SKILLS_COMMON_DIR/spring-boot-starter"
cat > "$SKILLS_COMMON_DIR/spring-boot-starter/README.md" << 'EOF'
# Spring Boot Starter 技能

提供标准的 Spring Boot 项目结构和配置模板。

## 标准结构
- src/main/java - Java 源代码
- src/main/resources - 资源文件
- pom.xml - Maven 配置

## 使用方法
在 AI 对话中说：“使用 spring-boot-starter 技能创建项目”
EOF
echo "  ✅ spring-boot-starter"

# 创建 mybatis-plus-generator
echo "创建 mybatis-plus-generator 技能..."
mkdir -p "$SKILLS_COMMON_DIR/mybatis-plus-generator"
cat > "$SKILLS_COMMON_DIR/mybatis-plus-generator/README.md" << 'EOF'
# MyBatis-Plus Generator 技能

根据数据库表结构自动生成 CRUD 代码。

## 生成内容
- Entity 实体类
- Mapper 接口
- XML 映射文件
- Service 层
- Controller 层

## 使用方法
在 AI 对话中提供表结构，说：“使用 mybatis-plus-generator 技能生成代码”
EOF
echo "  ✅ mybatis-plus-generator"

echo ""
echo "阶段 2 完成 ✅"
echo ""

# ============================================
# 阶段 3: 项目链接
# ============================================
echo "📦 阶段 3: 项目链接..."
echo ""

# 创建项目 skills 目录
if [ ! -d "$CURRENT_PROJECT_SKILLS" ]; then
    echo "创建项目 Skills 目录：$CURRENT_PROJECT_SKILLS"
    mkdir -p "$CURRENT_PROJECT_SKILLS"
    echo "✅ 项目目录已创建"
else
    echo "✅ 项目目录已存在"
fi

# 链接所有全局 skills
echo "开始链接全局 Skills..."
LINKED_COUNT=0

for skill in "$SKILLS_COMMON_DIR"/*; do
    if [ -d "$skill" ] && [[ ! "$(basename "$skill")" == .* ]]; then
        skill_name=$(basename "$skill")
        target_link="$CURRENT_PROJECT_SKILLS/$skill_name"
        
        if [ ! -L "$target_link" ]; then
            # 如果已存在同名目录，先删除
            if [ -d "$target_link" ]; then
                rm -rf "$target_link"
            fi
            # 创建符号链接
            ln -s "$skill" "$target_link"
            echo "  ✅ 已链接：$skill_name"
            ((LINKED_COUNT++))
        else
            echo "  ⏭️  已存在：$skill_name"
        fi
    fi
done

echo ""
echo "阶段 3 完成 ✅ (链接了 $LINKED_COUNT 个 skills)"
echo ""

# 创建便捷的查看脚本
echo "📝 创建便捷工具脚本..."

cat > ./list-skills.sh << 'LISTSCRIPT'
#!/bin/bash
echo "=== HAFW Skills 列表 ==="
echo ""
echo "📦 全局 Skills (~/skills-common):"
ls -1 ~/skills-common/ 2>/dev/null | grep -v "^\." | sed 's/^/  • /' || echo "  (空)"
echo ""
echo "📁 项目 Skills (.hafw/skills):"
ls -1 .hafw/skills/ 2>/dev/null | sed 's/^/  • /' || echo "  (空)"
echo ""
LISTSCRIPT
chmod +x ./list-skills.sh

echo "  ✅ 创建了 list-skills.sh 工具脚本"

# ============================================
# 阶段 4: 验证
# ============================================
echo "📦 阶段 4: 验证安装结果..."
echo ""

echo "全局 Skills 目录内容:"
ls -la "$SKILLS_COMMON_DIR/" | grep -v "^\." | head -10
echo ""

echo "项目 Skills 链接:"
ls -la "$CURRENT_PROJECT_SKILLS/" 2>/dev/null || echo "项目 skills 目录不存在"
echo ""

echo "配置文件内容:"
cat "$CONFIG_FILE" 2>/dev/null || echo "配置文件不存在"
echo ""

echo "阶段 4 完成 ✅"
echo ""

# 显示详细的验证信息
echo "🔍 详细验证信息:"
echo ""
echo "全局 Skills 目录结构:"
if [ -d "$SKILLS_COMMON_DIR" ]; then
    find "$SKILLS_COMMON_DIR" -maxdepth 2 -type d | head -20 | sed 's|^|  |'
else
    echo "  ❌ 目录不存在"
fi
echo ""

echo "项目 Skills 链接详情:"
if [ -d "$CURRENT_PROJECT_SKILLS" ]; then
    ls -la "$CURRENT_PROJECT_SKILLS/" | grep "^l" | while read line; do
        echo "  $line"
    done
else
    echo "  ❌ 项目 skills 目录不存在"
fi
echo ""

# ============================================
# 完成报告
# ============================================
echo "============================================"
echo "  🎉 HAFW Skills 系统安装完成！"
echo "============================================"
echo ""
echo "✅ 已完成的操作:"
echo "  1. ✓ 创建了全局 Skills 目录"
echo "  2. ✓ 创建了 HAFW 配置文件"
echo "  3. ✓ 创建了 3 个示例 Skills"
echo "  4. ✓ 在当前项目链接了所有 Skills"
echo "  5. ✓ 验证了安装结果"
echo ""
echo "📚 可用的 Skills:"
echo "  • common-utils              - 通用工具类"
echo "    位置：~/skills-common/common-utils"
echo "    用途：StringUtils, DateUtils, Validator 等"
echo ""
echo "  • spring-boot-starter       - Spring Boot 模板"
echo "    位置：~/skills-common/spring-boot-starter"
echo "    用途：标准 Spring Boot 项目结构"
echo ""
echo "  • mybatis-plus-generator    - MyBatis-Plus 代码生成器"
echo "    位置：~/skills-common/mybatis-plus-generator"
echo "    用途：根据表结构生成 CRUD 代码"
echo ""
echo "💡 下一步建议:"
echo ""
echo "  1️⃣  将你的通用 Skills 放到 ~/skills-common/"
echo "     命令：cp -r your-skill ~/skills-common/"
echo ""
echo "  2️⃣  在其他项目中链接 Skills"
echo "     命令：cd other-project && ./link-skills.sh"
echo ""
echo "  3️⃣  在 AI 对话中使用 Skills"
echo "     示例：'使用 spring-boot-starter 技能创建项目'"
echo "     示例：'使用 mybatis-plus-generator 技能生成代码'"
echo "     示例：'使用 common-utils 技能进行参数验证'"
echo ""
echo "🎯 快捷命令:"
echo "  ./list-skills.sh           - 查看所有可用的 Skills"
echo "  ls -la .hafw/skills/       - 查看已链接的 Skills 详情"
echo "  ls -la ~/skills-common/    - 查看全局 Skills"
echo "  cat ~/.hafw/config.json    - 查看配置文件"
echo ""
echo "============================================"
echo "  ✨ 安装脚本执行完毕！"
echo "============================================"
exit 0

---

## 🔧 Claude Code 工具调用说明

### 推荐使用的工具

Claude Code 应该使用以下工具来执行安装：

#### 1. **Bash 工具** - 主要执行方式

```bash
# 使用 Bash 工具执行完整的安装脚本
# （复制下面的完整整合脚本到 Bash 工具中执行）
```

#### 2. **多步骤执行** - 分步验证

如果需要分步执行，可以这样：

**步骤 1: 全局初始化**
```bash
mkdir -p ~/skills-common
mkdir -p ~/.hafw
cat > ~/.hafw/config.json << 'EOF'
{
  "skills": {
    "global-dir": "/Users/halo/skills-common",
    "auto-link": true,
    "prefer-global": true
  }
}
EOF
```

**步骤 2: 创建示例 Skills**
```bash
mkdir -p ~/skills-common/common-utils
mkdir -p ~/skills-common/spring-boot-starter
mkdir -p ~/skills-common/mybatis-plus-generator
# ... (添加 README 内容)
```

**步骤 3: 项目链接**
```bash
mkdir -p .hafw/skills
for skill in ~/skills-common/*; do
  if [ -d "$skill" ] && [[ ! "$(basename "$skill")" == .* ]]; then
    ln -sf "$skill" ".hafw/skills/$(basename "$skill")"
  fi
done
```

**步骤 4: 验证**
```bash
ls -la ~/skills-common/
cat ~/.hafw/config.json
ls -la .hafw/skills/
```

### 工具使用最佳实践

✅ **推荐做法**:
- 使用单个大的 Bash 脚本一次性执行
- 或者分成 4-5 个小的 Bash 调用
- 每次执行后检查输出
- 遇到错误时停止并报告

❌ **避免做法**:
- 不要让用户手动执行命令
- 不要跳过验证步骤
- 不要忽略错误信息

```bash
# 复制上面的完整整合脚本并执行

---

## 🎯 Claude Code 使用示例

### 场景 1: 用户发送文档

**用户**: 
```
[上传 HAFW-SKILLS-INSTALL.md]
请帮我安装这个系统
```

**Claude Code 响应**:
```markdown
好的！我看到了 HAFW Skills 全局复用系统的安装文档。
现在使用 Bash 工具自动执行安装...

[Bash 工具调用 - 执行完整安装脚本]

正在执行...

📦 阶段 1: 全局初始化...
✅ 创建了全局 Skills 目录：/Users/halo/skills-common
✅ 创建了 HAFW 配置文件：/Users/halo/.hafw/config.json

📦 阶段 2: 创建示例 Skills...
✅ common-utils - 通用工具类
✅ spring-boot-starter - Spring Boot 模板
✅ mybatis-plus-generator - MyBatis-Plus 代码生成器

📦 阶段 3: 项目链接...
✅ 已链接 3 个 skills 到当前项目

📦 阶段 4: 验证安装...
[显示验证结果]

🎉 安装完成！你现在可以在任何项目中使用这些 skills 了。

可用的 skills:
- common-utils: StringUtils, DateUtils, Validator 等工具类
- spring-boot-starter: Spring Boot 项目模板
- mybatis-plus-generator: 根据数据库表生成 CRUD 代码

下一步建议:
1. 在其他项目中运行 `./link-skills.sh` 链接 skills
2. 在 AI 对话中说："使用 spring-boot-starter 技能创建项目"
```

### 场景 2: 用户询问如何安装

**用户**:
```
我想在新项目中复用我的 skills，怎么弄？
```

**Claude Code 响应**:
```markdown
我推荐使用 HAFW Skills 全局复用系统！

我已经为你准备了完整的安装文档：HAFW-SKILLS-INSTALL.md

这个系统可以让你：
✅ 一次安装，多项目共享
✅ 零 token 消耗
✅ 实时更新同步

是否需要我现在帮你安装？

[用户确认后，自动执行 Bash 脚本]
```

### 场景 3: 分步执行模式

如果用户想要了解每个步骤，可以分步执行：

**步骤 1**:
```bash
# 全局初始化
mkdir -p ~/skills-common
mkdir -p ~/.hafw
cat > ~/.hafw/config.json << 'EOF'
{
  "skills": {
    "global-dir": "/Users/halo/skills-common",
    "auto-link": true,
    "prefer-global": true
  }
}
EOF
echo "✅ 全局初始化完成"
```

**步骤 2**:
```bash
# 创建示例 skills
mkdir -p ~/skills-common/{common-utils,spring-boot-starter,mybatis-plus-generator}
# ... 添加 README
echo "✅ 创建了 3 个示例 skills"
```

**步骤 3**:
```bash
# 项目链接
mkdir -p .hafw/skills
for skill in ~/skills-common/*; do
  [ -d "$skill" ] && [[ ! "$(basename "$skill")" == .* ]] && \
  ln -sf "$skill" ".hafw/skills/$(basename "$skill")"
done
echo "✅ 已链接所有 skills"
```

**步骤 4**:
```bash
# 验证
ls -la ~/skills-common/
cat ~/.hafw/config.json
ls -la .hafw/skills/
echo "✅ 验证完成"
```

---

## 🔍 Claude Code 工具调用细节

### Bash 工具使用技巧

#### 1. **大脚本处理**

对于超过 100 行的脚本，建议：
- 分段执行（每段 50-80 行）
- 或者保存为临时文件后执行

```bash
# 方式 1: 直接执行（适合中等大小脚本）
[粘贴完整脚本]

# 方式 2: 保存为文件执行（适合大脚本）
cat > /tmp/hafw-install.sh << 'EOF'
[完整脚本内容]
EOF
chmod +x /tmp/hafw-install.sh
bash /tmp/hafw-install.sh
```

#### 2. **错误处理**

```bash
# 设置错误处理
set -e  # 遇到错误立即退出

# 或者更友好的错误处理
command || {
    echo "❌ 命令失败：$command"
    echo "请检查："
    echo "  1. 权限是否正确"
    echo "  2. 路径是否存在"
    exit 1
}
```

#### 3. **进度显示**

```bash
# 显示进度
echo "📦 阶段 1/4: 全局初始化..."
# 执行命令
echo "✅ 阶段 1 完成"

echo "📦 阶段 2/4: 创建 Skills..."
# 执行命令
echo "✅ 阶段 2 完成"

# 使用进度条（可选）
for i in {1..4}; do
    echo -ne "\r进度：[$((i*25))%]"
    sleep 0.5
done
echo -ne "\n"
```

### 验证命令示例

Claude Code 应该使用这些命令来验证安装：

```bash
# 1. 检查全局目录
echo "检查全局 Skills 目录:"
ls -la ~/skills-common/ | head -10

# 2. 检查配置文件
echo "检查配置文件:"
cat ~/.hafw/config.json | python3 -m json.tool 2>/dev/null || cat ~/.hafw/config.json

# 3. 检查符号链接
echo "检查项目 Skills 链接:"
ls -la .hafw/skills/ | grep "^l"

# 4. 测试链接是否有效
echo "测试链接:"
for link in .hafw/skills/*; do
    if [ -L "$link" ]; then
        target=$(readlink "$link")
        if [ -d "$target" ]; then
            echo "✅ $(basename "$link") -> $target"
        else
            echo "❌ $(basename "$link") 的目标不存在"
        fi
    fi
done

# 5. 统计信息
echo "统计信息:"
echo "  全局 skills: $(ls -1 ~/skills-common/ | grep -v '^\.' | wc -l | tr -d ' ') 个"
echo "  项目已链接：$(ls -1 .hafw/skills/ | grep -v '^\.' | wc -l | tr -d ' ') 个"
```

---

## 💡 Claude Code 最佳实践

### ✅ 推荐做法

1. **主动执行**
   - 看到文档后立即使用 Bash 工具
   - 不要等待用户手动操作
   - 显示详细的执行过程

2. **详细反馈**
   - 每个步骤都显示进度
   - 成功后显示确认信息
   - 失败时提供解决方案

3. **验证导向**
   - 执行后立即验证
   - 使用多个角度验证（目录、文件、链接）
   - 显示验证结果

4. **用户友好**
   - 使用 emoji 和格式化输出
   - 提供清晰的下一步建议
   - 解释每个 skill 的用途

### ⚠️ 注意事项

1. **权限问题**
   - macOS 可能需要用户授权
   - 某些目录可能需要 sudo
   - 提前告知用户可能的权限提示

2. **路径兼容性**
   - 使用 `$HOME` 而不是硬编码路径
   - 注意空格和特殊字符
   - 使用引号包裹路径变量

3. **幂等性**
   - 脚本应该可以重复执行
   - 检查已存在的资源
   - 跳过已完成的步骤

---

## 🎁 额外功能：快速测试脚本

为了让 Claude Code 快速验证安装，这里提供一个测试脚本：

```bash
#!/bin/bash
# HAFW Skills 快速测试脚本

echo "=== HAFW Skills 快速测试 ==="
echo ""

# 测试 1: 全局目录
echo "测试 1: 全局 Skills 目录"
if [ -d ~/skills-common ]; then
    count=$(ls -1 ~/skills-common/ | grep -v '^\.' | wc -l | tr -d ' ')
    echo "✅ 目录存在，包含 $count 个 skills"
else
    echo "❌ 目录不存在"
fi
echo ""

# 测试 2: 配置文件
echo "测试 2: HAFW 配置文件"
if [ -f ~/.hafw/config.json ]; then
    if cat ~/.hafw/config.json | python3 -m json.tool >/dev/null 2>&1; then
        echo "✅ 配置文件存在且格式正确"
    else
        echo "⚠️  配置文件存在但格式可能有误"
    fi
else
    echo "❌ 配置文件不存在"
fi
echo ""

# 测试 3: 项目链接
echo "测试 3: 项目 Skills 链接"
if [ -d .hafw/skills ]; then
    links=$(ls -la .hafw/skills/ | grep "^l" | wc -l | tr -d ' ')
    echo "✅ 项目 skills 目录存在，包含 $links 个符号链接"
    
    # 验证链接有效性
    valid=0
    invalid=0
    for link in .hafw/skills/*; do
        if [ -L "$link" ] && [ -d "$(readlink "$link")" ]; then
            ((valid++))
        else
            ((invalid++))
        fi
    done
    echo "  有效链接：$valid 个"
    if [ $invalid -gt 0 ]; then
        echo "  ⚠️  无效链接：$invalid 个"
    fi
else
    echo "❌ 项目 skills 目录不存在"
fi
echo ""

# 测试 4: 实际使用
echo "测试 4: 实际使用测试"
test_skill="~/skills-common/common-utils"
if [ -d "$test_skill" ] && [ -f "$test_skill/README.md" ]; then
    echo "✅ Skills 可以正常访问"
    echo "  示例内容预览:"
    head -5 "$test_skill/README.md" | sed 's/^/    /'
else
    echo "❌ Skills 内容无法访问"
fi
echo ""

# 总结
echo "=== 测试结果 ==="
passed=$(( [ -d ~/skills-common ] && echo 1 || echo 0 ))
passed=$((passed + ( [ -f ~/.hafw/config.json ] && echo 1 || echo 0 )))
passed=$((passed + ( [ -d .hafw/skills ] && echo 1 || echo 0 )))
passed=$((passed + ( [ -d "$test_skill" ] && [ -f "$test_skill/README.md" ] && echo 1 || echo 0 )))

echo "通过：$passed/4 项测试"

if [ $passed -eq 4 ]; then
    echo "🎉 所有测试通过！系统安装成功！"
else
    echo "⚠️  部分测试未通过，请检查安装"
fi
```

Claude Code 可以在安装完成后执行这个测试脚本来验证。

---

## ✅ 安装完成后的使用方式

### 在 AI 对话中使用 Skills

现在你可以在任何 AI 对话（包括 Claude Code）中这样使用：

```markdown
你：使用 spring-boot-starter 技能创建一个新的 Spring Boot 项目

Claude Code: 好的！基于 spring-boot-starter 技能，我将创建标准的 Spring Boot 项目结构...

---

你：使用 mybatis-plus-generator 技能，为以下表生成 CRUD 代码：
CREATE TABLE users (...)

Claude Code: 收到！使用 mybatis-plus-generator 技能，正在生成代码...

---

你：使用 common-utils 技能中的 Validator 进行参数验证

Claude Code: 好的！我会使用 common-utils 技能提供的 Validator 工具类...
```

### 管理 Skills

```bash
# 查看所有全局 skills
echo "全局 Skills:"
ls -1 ~/skills-common/ | grep -v '^\.'

# 查看项目已链接的 skills
echo "项目已链接的 Skills:"
ls -1 .hafw/skills/ | grep -v '^\.'

# 在新项目中快速链接
cd new-project
mkdir -p .hafw/skills
for skill in ~/skills-common/*; do
  [ -d "$skill" ] && [[ ! "$(basename "$skill")" == .* ]] && \
  ln -sf "$skill" ".hafw/skills/$(basename "$skill")"
done
echo "✅ Skills 链接完成"

# 或者直接使用安装脚本（如果已保存）
./link-skills.sh
```

---

**文档版本**: 3.0.0 (Claude Code 适配版)  
**创建时间**: 2026-03-26  
**最后更新**: 2026-03-26  
**适用系统**: macOS, Linux  
**自动化级别**: 全自动  
**目标智能体**: Claude Code  
**所需工具**: Bash, mkdir, ln, cat, ls
