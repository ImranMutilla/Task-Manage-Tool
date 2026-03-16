# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- No unreleased entries yet.

### Changed
- No unreleased entries yet.

### Fixed
- No unreleased entries yet.

## [v0.1.0] - 2026-03-16

### Added
- Initial React + TypeScript + Vite application scaffold for Smart Task Assistant.
- Core task model with priority, status, due datetime, tags, project metadata, repeat rules, and timestamps.
- Main product views: Inbox, Today, Upcoming, Completed, Project view, and Tag view.
- Add Task modal with structured task input (title, description, date/time, priority, project, tags, repeat, pin-to-today, status).
- Custom date/time handling utilities, including 15-minute time selection flow.
- Contextual task entry points (global add, Today/Upcoming contextual adds, project-context add).
- Sidebar navigation with project/tag sections and counters.
- Dynamic Project management (create, rename, delete) with safe task fallback to Inbox on delete.
- Dynamic Tag management (create, rename, delete) with task tag cleanup on delete.
- List and Board display modes with per-view grouping logic.
- View-mode preference persistence per page.
- localStorage persistence for tasks, projects, tags, and UI preferences.

### Changed
- Evolved layout from a simple form/list split into a more product-oriented information architecture.
- Refined toolbar behavior to be view-specific instead of one global filter/sort configuration.
- Improved Today page structure into execution-focused sections and Up Next guidance.
- Improved Upcoming into date-based planning flows, including week-oriented board usage.
- Updated Completed semantics and sorting behavior for review-oriented usage.
- Standardized task rendering hierarchy for readability (primary vs secondary metadata).
- Unified board layout behavior across supported pages for consistent readability.

### Fixed
- Fixed multiple date grouping inconsistencies between list and board contexts.
- Fixed Upcoming board usability issues (narrow columns, compressed cards, inconsistent scrolling behavior).
- Fixed timezone-sensitive day bucketing issues that could place tasks into the wrong date column.
- Fixed custom tag chip styling so user-created tags have stable, persistent color classes like preset tags.
- Fixed repeat scheduling behavior so completing repeating tasks generates the next instance correctly.
- Fixed monthly repeat edge cases by clamping to the target month’s last valid day when needed.
- Fixed inconsistent task status toggle interactions by aligning behavior across views that use status menus.
- Fixed project/tag data synchronization issues between sidebar management and Add Task selection sources.
