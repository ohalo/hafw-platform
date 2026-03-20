#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 设置 HAFW 工作空间...');

// 获取项目根目录
const projectRoot = path.join(__dirname, '../..');
const targetHafwDir = path.join(projectRoot, '.hafw');

// 源目录（开发目录）
const sourceHafwDir = path.join(__dirname, '../../../.hafw');

if (fs.existsSync(sourceHafwDir)) {
  // 复制 actions
  const sourceActions = path.join(sourceHafwDir, 'actions');
  const targetActions = path.join(targetHafwDir, 'actions');
  
  if (fs.existsSync(sourceActions)) {
    fs.ensureDirSync(path.dirname(targetActions));
    fs.copySync(sourceActions, targetActions);
    console.log('✅ 已复制 Actions');
  }
  
  // 复制 spec
  const sourceSpec = path.join(sourceHafwDir, 'spec');
  const targetSpec = path.join(targetHafwDir, 'spec');
  
  if (fs.existsSync(sourceSpec)) {
    fs.copySync(sourceSpec, targetSpec);
    console.log('✅ 已复制 Spec 模板');
  }
  
  console.log('✅ HAFW 工作空间设置完成');
  console.log(`📂 工作目录：${targetHafwDir}`);
} else {
  console.log('⚠️  未找到源 HAFW 目录，请手动设置');
  console.log(`📂 源目录应该在：${sourceHafwDir}`);
}
