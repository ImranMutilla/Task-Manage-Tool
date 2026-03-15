# Smart Task Assistant

Todoist 产品结构思路 + Apple-inspired 简约视觉风格的轻量任务管理工具。

## 本轮升级亮点

- 左侧导航：Inbox / Today / Upcoming / Completed + Projects + Tags
- 任务录入重构：弹层 Task Composer，默认聚焦标题，轻量快速输入
- 15 分钟时间选择：小时 + 分钟(00/15/30/45) + AM/PM
- 任务模型增强：`priority(p1-p4)`、`projectId/projectName`、`completedAt`、`isInToday`
- 视图体系升级：支持项目视图、标签视图、Upcoming 分组（Today/Tomorrow/Next 7 Days/Later）
- 完成交互优化：列表左侧圆形勾选按钮一键完成/恢复
- 筛选与排序增强：状态、优先级、项目、标签、逾期；按截止/创建/更新/优先级排序
- 本地存储兼容迁移：旧 `dueDate` 与 `high/medium/low` 优先级自动兼容

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

## 文件结构

```text
src/
  components/
    DatePicker.tsx
    FocusPanel.tsx
    Sidebar.tsx
    TaskComposer.tsx
    TaskFilters.tsx
    TaskItem.tsx
    TaskList.tsx
    TaskModal.tsx
    TimePicker15Min.tsx
    TopBar.tsx
  services/
    localStorage.ts
  types/
    task.ts
  utils/
    dateTime.ts
    taskUtils.ts
  App.tsx
  index.css
  main.tsx
```
