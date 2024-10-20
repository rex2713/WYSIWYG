# WYSIWYG - nocode 介面編輯平台

由 [React(18.3.11版)](https://react.dev/) 所構建，使用官方預設編譯器 [Vite](https://vitejs.dev/) 開發。

## Nodejs 版本

v21.5.0

## 技術列表

- [React](https://react.dev/) - 一個用於構建用戶界面的 JavaScript 庫，透過組件化開發提升可維護性和重用性，並支援單向資料流和虛擬 DOM 優化渲染。
- [tailwindcss](https://tailwindcss.com/) - Utility 式 CSS 庫。
- [Sass](https://sass-lang.com/) - 一個功能強大的 CSS 擴展語言，提供變數、嵌套等功能來提升樣式表的可維護性。
- [DOMPurify](https://github.com/cure53/DOMPurify) - XSS 攻擊清理函式庫。

## 專案結構

基本上遵循 React + Vite 的預設開發結構：

- public/\* - 你的非程式碼、未處理的資源。
- src/\* - 你的專案原始碼。
- `assets` - 全站使用靜態資源。
- `components` - 共用元件。
- `types` - 全站型別管理。
- package.json - 專案使用套件列表。
- tailwind.config.js - tailwind 設定檔。
- vite.config.ts - vite 設定檔。
- tsconfig.app.json - typescript 設定檔。

## 開發

根目錄下，直接執行：

```bash
# Project Setup
npm ci

# Compile and Hot-Reload for Development
npm run dev
```

進入 localhost:5173 即可預覽輸出結果。

## 部署

根目錄下，先執行：

```bash
npm run build
```
