#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const packageJson = require('../package.json');

program
  .name('hafw')
  .description('HAFW - High-efficiency AI Framework Workspace CLI')
  .version(packageJson.version);

// 安装 HAFW 到本地项目
program
  .command('install [project-name]')
  .alias('init')
  .description('安装 HAFW 到当前项目')
  .option('-f, --force', '强制重新安装')
  .action(async (projectName, options) => {
    try {
      const projectDir = process.cwd();
      const hafwDir = path.join(projectDir, '.hafw');
      
      console.log(chalk.blue('\n=== 安装 HAFW 到本地项目 ===\n'));
      
      // 检查是否已安装
      if (fs.existsSync(hafwDir) && !options.force) {
        console.log(chalk.yellow('⚠️  HAFW 已安装到此项目'));
        console.log(chalk.gray('使用 --force 强制重新安装'));
        console.log(chalk.gray('\nAI 智能体现在可以使用 HAFW 指令：'));
        console.log(chalk.white('  /hafw-req-analysis "需求描述"'));
        console.log(chalk.white('  /hafw-context-show'));
        return;
      }
      
      // 创建目录结构
      const dirs = ['actions', 'spec'];
      for (const dir of dirs) {
        await fs.ensureDir(path.join(hafwDir, dir));
      }
      
      // 从全局 .hafw 复制 actions
      const globalHafwDir = path.join(__dirname, '../.hafw');
      const globalActionsDir = path.join(globalHafwDir, 'actions');
      
      if (fs.existsSync(globalActionsDir)) {
        await fs.copy(globalActionsDir, path.join(hafwDir, 'actions'));
        console.log(chalk.green('✅ 已复制 HAFW Actions'));
      }
      
      // 从全局 .hafw 复制 spec 模板
      const globalSpecDir = path.join(globalHafwDir, 'spec');
      if (fs.existsSync(globalSpecDir)) {
        await fs.copy(globalSpecDir, path.join(hafwDir, 'spec'));
        console.log(chalk.green('✅ 已复制 HAFW Spec 模板'));
      }
      
      // 创建项目配置
      const projectNameFinal = projectName || path.basename(projectDir);
      const projectConfig = {
        project: {
          id: `HAFW-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 6)}`,
          name: projectNameFinal,
          version: '1.0.0',
          description: '',
          type: detectProjectType(projectDir),
          language: detectLanguage(projectDir),
          status: 'initialized',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        workspace: {
          root: '.hafw/',
          project_root: './'
        },
        actions_installed: true,
        actions_count: fs.readdirSync(path.join(hafwDir, 'actions')).filter(f => f.endsWith('.md')).length
      };
      
      await fs.writeJson(path.join(hafwDir, 'project.json'), projectConfig, { spaces: 2 });
      
      console.log(chalk.green('\n✅ HAFW 安装成功！\n'));
      console.log(chalk.white(`项目名称：${projectNameFinal}`));
      console.log(chalk.white(`Actions 数量：${projectConfig.actions_count}`));
      console.log(chalk.gray(`工作目录：${hafwDir}`));
      
      console.log(chalk.blue('\n📖 使用方式:\n'));
      console.log(chalk.white('现在 AI 智能体可以读取 .hafw/actions/ 目录下的指令'));
      console.log(chalk.white('在 AI 对话中使用以下指令:\n'));
      console.log(chalk.green('  /hafw-context-init    - 初始化项目上下文'));
      console.log(chalk.green('  /hafw-req-analysis    - 分析需求'));
      console.log(chalk.green('  /hafw-design-arch     - 架构设计'));
      console.log(chalk.green('  /hafw-dev-code        - 生成代码'));
      console.log(chalk.green('  ... 等 27 个指令\n'));
      
    } catch (error) {
      console.error(chalk.red('错误:'), error.message);
      process.exit(1);
    }
  });

// 显示已安装的 Actions
program
  .command('list')
  .alias('ls')
  .description('列出已安装的 HAFW Actions')
  .action(async () => {
    const hafwDir = path.join(process.cwd(), '.hafw');
    const actionsDir = path.join(hafwDir, 'actions');
    
    if (!fs.existsSync(actionsDir)) {
      console.log(chalk.yellow('⚠️  未安装 HAFW'));
      console.log(chalk.gray('运行：hafw install'));
      return;
    }
    
    const actions = fs.readdirSync(actionsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));
    
    console.log(chalk.blue('\n=== 已安装的 HAFW Actions ===\n'));
    console.log(chalk.white(`总数：${actions.length}\n`));
    
    // 分类显示
    const categories = {
      '上下文管理': ['hafw-context-init', 'hafw-context-show', 'hafw-context-scan'],
      '需求管理': ['hafw-req-analysis', 'hafw-req-spec', 'hafw-req-review', 'hafw-req-breakdown'],
      '系统设计': ['hafw-design-arch', 'hafw-design-db', 'hafw-design-api'],
      '代码开发': ['hafw-dev-code', 'hafw-dev-test', 'hafw-dev-review'],
      '质量保障': ['hafw-qa-scan', 'hafw-qa-test', 'hafw-qa-report'],
      '部署运维': ['hafw-deploy-build', 'hafw-deploy-release', 'hafw-deploy-monitor']
    };
    
    for (const [category, categoryActions] of Object.entries(categories)) {
      const installed = actions.filter(a => categoryActions.includes(a));
      if (installed.length > 0) {
        console.log(chalk.yellow(`${category}:`));
        installed.forEach(a => console.log(chalk.green(`  ✓ ${a}`)));
        console.log();
      }
    }
  });

// 显示帮助
program
  .command('help-cmd')
  .description('显示 HAFW 帮助信息')
  .action(() => {
    console.log(chalk.blue('\n=== HAFW CLI 帮助 ===\n'));
    console.log(chalk.white('HAFW 是一个基于 AI 智能体的开发框架'));
    console.log(chalk.white('通过安装 Actions 到本地项目，AI 智能体可以执行各种开发任务\n'));
    
    console.log(chalk.yellow('安装命令:'));
    console.log(chalk.green('  hafw install [project-name]  - 安装 HAFW 到当前项目'));
    console.log(chalk.green('  hafw list                    - 查看已安装的 Actions\n'));
    
    console.log(chalk.yellow('AI 智能体指令 (在对话中使用):'));
    console.log(chalk.green('  /hafw-context-init    - 初始化项目上下文'));
    console.log(chalk.green('  /hafw-req-analysis    - 分析用户需求'));
    console.log(chalk.green('  /hafw-design-arch     - 系统架构设计'));
    console.log(chalk.green('  /hafw-dev-code        - 生成代码'));
    console.log(chalk.green('  ... 等 27 个指令\n'));
    
    console.log(chalk.white('更多信息请查看：https://halo26812.github.io/hafw-platform'));
  });

// 解析命令行参数
program.parse();

// 如果没有参数，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// 辅助函数
function detectProjectType(projectDir) {
  if (fs.existsSync(path.join(projectDir, 'package.json'))) return 'Node.js';
  if (fs.existsSync(path.join(projectDir, 'pom.xml'))) return 'Maven';
  if (fs.existsSync(path.join(projectDir, 'build.gradle'))) return 'Gradle';
  if (fs.existsSync(path.join(projectDir, 'requirements.txt'))) return 'Python';
  return 'Unknown';
}

function detectLanguage(projectDir) {
  if (fs.existsSync(path.join(projectDir, 'package.json'))) return 'JavaScript/TypeScript';
  if (fs.existsSync(path.join(projectDir, 'pom.xml')) || fs.existsSync(path.join(projectDir, 'build.gradle'))) return 'Java';
  if (fs.existsSync(path.join(projectDir, 'requirements.txt'))) return 'Python';
  return 'Unknown';
}
