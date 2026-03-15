# Smart Task Assistant

一个可直接运行的轻量级智能任务管理工具，使用 React + TypeScript + Tailwind CSS 构建，适合快速演示。

## 功能亮点

- ✅ 任务创建：标题、描述、优先级、截止日期、状态、标签
- ✅ 任务管理：编辑、删除、状态切换、一键完成
- ✅ 搜索/筛选/排序：按标题搜索，按状态和优先级筛选，按截止日期或创建时间排序
- ✅ Today’s Focus：自动选出当前最值得优先处理的任务
- ✅ 轻量智能建议：根据输入标题提供优先级、截止日期和拆分建议
- ✅ localStorage 持久化：刷新页面后自动恢复
- ✅ 加分项：逾期任务高亮 + 空状态优化 + 响应式布局

## 快速开始

```bash
npm install
npm run dev
```

打开浏览器访问：`http://localhost:5173`

## 构建与预览

```bash
npm run build
npm run preview
```

## 项目结构

```text
src/
  components/
    FilterBar.tsx
    FocusPanel.tsx
    TaskCard.tsx
    TaskForm.tsx
    TaskList.tsx
  services/
    localStorage.ts
  types/
    task.ts
  utils/
    taskUtils.ts
  App.tsx
  index.css
  main.tsx
```
