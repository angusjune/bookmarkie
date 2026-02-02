# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Bookmarkie 是一个优雅的 Chrome 书签查看器扩展，基于 Chrome Manifest V3 构建。使用 Material Design Components (MDC) 实现 UI 组件，支持国际化 (i18n)。

## 常用命令

```bash
# 安装依赖
yarn install

# 生产构建（输出到 build/ 目录）
yarn build

# 开发模式（监听文件变化，自动重新构建）
yarn watch

# 开发模式（带 source map）
yarn build:dev
```

开发时将 `build/` 目录加载到 Chrome 扩展页面即可测试。

## 架构概述

### 入口文件结构

| 文件 | 用途 |
|------|------|
| `src/popup.js` | 弹出窗口主逻辑，书签树渲染、搜索、拖放、右键菜单 |
| `src/background.js` | Service Worker，处理图标动态渲染（使用 Canvg 将 SVG 转 PNG） |
| `src/options.js` | 设置页面，使用 MDC Switch 组件 |

### Chrome APIs 使用

- `chrome.bookmarks` - 书签 CRUD 操作
- `chrome.storage.sync` - 用户偏好设置同步
- `chrome.tabs` / `chrome.windows` - 标签页和窗口管理
- `chrome.action` - 扩展图标设置

### 用户设置项

设置存储在 `chrome.storage.sync`：
- `openNewTabs` - 是否在新标签页打开
- `openTabsInBg` - 后台打开标签页
- `closeOtherFolders` - 打开文件夹时关闭其他
- `preserveState` - 记住展开状态和滚动位置
- `iconType` / `iconStyle` / `iconStyleAuto` - 图标样式配置

### 构建系统

Webpack 配置位于 `config/` 目录：
- `webpack.common.js` - 通用配置（SCSS、CSS、图片处理）
- `webpack.config.js` - 入口点配置
- `paths.js` - 路径常量

构建流程：将 `src/` 编译到 `build/`，同时复制 `public/` 静态资源。

### 国际化

语言文件位于 `public/_locales/`，支持 `en` 和 `zh_CN`。通过 `chrome.i18n.getMessage()` 获取翻译。
