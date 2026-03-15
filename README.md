# Smart Task Assistant

Todoist 任务管理逻辑 + 简约现代视觉的轻量任务管理系统。

## 本轮成熟化升级

- ✅ Add Task 弹窗重构：标题优先、描述弱化、统一工具条（Date / Time / Priority / Project / Tags）
- ✅ 时间选择重构：移除 hour/min/AMPM 技术化输入，改为 15 分钟粒度可读时间列表（含 No time）
- ✅ 标签体系升级：默认预设标签 + 多选胶囊样式 + 颜色映射
- ✅ 优先级体系升级：P1 Critical / P2 High / P3 Medium / P4 Low + 颜色语义
- ✅ 任务项信息层级优化：标题 > 时间 > 项目/标签 > 描述，支持 hover 操作（Edit/Delete/Duplicate）
- ✅ 筛选栏增强：Status / Priority / Project / Tag / Due state / Sort
- ✅ Focus 模块成熟化：仅展示 1~3 个关键任务，包含优先级、项目、截止时间
- ✅ localStorage 兼容：旧 dueDate、旧优先级字段自动迁移

## 标签默认配置（示例）

- Urgent（柔和红）
- Follow-up（蓝）
- Meeting（紫）
- Work（灰蓝）
- Personal（绿）
- Study（琥珀）
- Shopping（橙）
- Important（红）
- Low energy（灰）
- Quick task（青）

## 运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```
