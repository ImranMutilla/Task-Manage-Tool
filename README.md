# Smart Task Assistant (Task-Manage-Tool)

A lightweight task management app inspired by Todoist workflows, focused on capture, planning, and execution with a calm, minimal interface.

## Overview

Smart Task Assistant is a single-page task management system built for real daily use, not just CRUD demos. It combines:

- **Capture** (quickly record tasks)
- **Execution** (focus on what matters today)
- **Planning** (see upcoming workload by date)
- **Review** (check completed work)
- **Organization** (projects + tags)

The product structure is influenced by Todoist-style information architecture, while keeping a cleaner and more restrained visual style.

## Features (Implemented)

### 1) Task creation & editing

- **Add Task modal** with a quick-input-first flow.
- Create/edit fields include:
  - title
  - description
  - due date + time
  - priority (`P1`–`P4`)
  - project
  - tags
  - repeat rule (`none`, `daily`, `weekday`, `weekly`, `monthly`)
  - pin to today
  - status
- **15-minute time options** are supported through the custom time picker flow.
- **Quick parsing in title** is partially supported (e.g., lightweight recognition of phrases like `tomorrow 4pm`, `@Tag`, `#Project`, repeat hints).

### 2) Multi-view task organization

- **Inbox** for unorganized tasks.
- **Today** for execution-focused work.
- **Upcoming** for date-based planning.
- **Completed** for review and recovery.
- **Project views** for project-specific task management.
- **Tag views** for tag-focused task tracking.

### 3) List / Board display modes

- Both **List** and **Board** modes are implemented.
- Board grouping is **view-specific** (not one-size-fits-all), e.g.:
  - Inbox / Project / Tag: grouped by status
  - Today: grouped by execution buckets
  - Upcoming: grouped by upcoming days
  - Completed: grouped for review context
- View mode preference is persisted, so pages remember the last selected mode after refresh.

### 4) Today view (execution-focused)

- Structured sections:
  - Overdue
  - Due Today
  - No Time / Flexible
- **Up Next** summary to surface the most actionable next task.
- Summary metrics include total, done, remaining, and completion rate.
- Task circle interaction uses a **status selection menu** (`in progress` / `done`) rather than always marking done immediately.

### 5) Upcoming view (planning-focused)

- Upcoming tasks are grouped by date in a future window.
- Supports both **List** and **Board** planning views.
- Board mode uses horizontal columns for day-based planning.
- Each day supports a contextual `+ Add task` entry with date prefill.
- Day rows/columns include lightweight empty states for clearer scanning.

### 6) Completed view (review-focused)

- Completed tasks are available in a dedicated review page.
- Default sort is **Recently completed**.
- Restore/reopen behavior is supported through status changes.

### 7) Projects & tags

- Built-in default projects and tags are included.
- **Dynamic CRUD for projects**:
  - create
  - rename
  - delete (with task fallback handling)
- **Dynamic CRUD for tags**:
  - create
  - rename
  - delete (removes tag from tasks without deleting tasks)
- Add Task modal uses **dynamic project/tag data** from current state.
- Sidebar includes lightweight management entry points for projects/tags.
- Custom tags have stable color styles consistent with preset tags.

### 8) Filtering & sorting

- Filters and sort controls are **view-context aware** (not identical across every page).
- Supported controls (by page config) include:
  - search
  - status
  - priority
  - project
  - tag
  - due state
  - sort options
- Sorting options include due date/time, priority, recently updated/created/completed depending on active view.

### 9) Task status model

- Status lifecycle: `todo`, `in-progress`, `done`.
- Status switching is handled through shared task actions used across List and Board render paths.

### 10) Repeat rules

- Repeat rules implemented: `daily`, `weekday`, `weekly`, `monthly`.
- Completing a repeating task auto-generates the next instance.
- Monthly repeat handles end-of-month correctly (falls back to target month’s last valid day when needed).

### 11) Persistence & compatibility

- Data persistence is handled via **localStorage**.
- Persisted entities include tasks, projects, tags, and view preferences.
- Compatibility normalization exists for older saved data (e.g., migrated fields/default fallbacks).

## Views & Information Architecture

### Inbox
Capture and triage area for tasks that are not yet organized into a formal project.

### Today
Execution view for what needs attention now, with actionable grouping and focus guidance.

### Upcoming
Planning view for near-future scheduling, designed for scanning task load by date.

### Completed
Review view for recently finished work and potential recovery/reopen actions.

### Project View
Contextual workspace for tasks under one specific project.

### Tag View
Contextual workspace for tasks sharing the same tag semantics.

## UI / Product Principles

- Workflow inspired by Todoist-style task management.
- Minimal, lightweight, and calm visual language.
- Readability-first hierarchy for high-frequency usage.
- Context-specific toolbars to reduce control noise.
- List/Board dual mode to support both detailed reading and distribution planning.
- Distinct semantics for Inbox vs Today vs Upcoming vs Completed (capture / execute / plan / review).

## Tech Stack

- **React 18**
- **TypeScript**
- **Vite 5**
- **Tailwind CSS**
- **localStorage** for client-side persistence

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```text
.
├── src/
│   ├── components/          # UI building blocks (views, list/board, modal, pickers)
│   ├── services/            # localStorage persistence and normalization
│   ├── types/               # domain types (task, filters, projects, tags, views)
│   ├── utils/               # date/time logic, task selectors, grouping, helpers
│   ├── App.tsx              # app orchestration and state wiring
│   └── main.tsx             # React entry
├── README.md
└── CHANGELOG.md
```

## What Makes This More Than a Basic Todo Demo

- Multi-view architecture with clear view semantics.
- Contextual filtering/sorting behavior by page.
- Repeat scheduling logic with edge-case handling.
- Project/tag lifecycle management (not static labels only).
- Dual list/board presentation with per-view grouping behavior.
- Execution and planning surfaces (Today + Upcoming), not just a single flat list.

## Roadmap / Future Improvements

> The items below are **not claimed as fully implemented yet**.

- Keyboard-first command palette for faster power-user flows.
- Bulk inbox triage actions (multi-select move/date/priority).
- Drag-and-drop rescheduling in Upcoming board.
- Richer completed analytics and timeline grouping.
- Optional backend sync / multi-device support.

## Changelog

For a detailed history of features, fixes, and improvements, see [CHANGELOG.md](./CHANGELOG.md).

## License

This repository currently does not declare a separate open-source license file.
