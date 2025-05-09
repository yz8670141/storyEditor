# VueStory 編輯器 - 技術說明 (HomeView.vue)

本頁為 Vue 3 專案首頁，運用了以下語法與工具技術，並記錄每項語法的**選用理由與特性**，作為學習與作品集展示依據。

## ✅ 技術與語法總覽

| 分類           | 技術 / 語法                           | 為什麼使用 / 語法特性                                            |
| -------------- | ------------------------------------- | ---------------------------------------------------------------- |
| Vue 3 核心     | `ref`                                 | 建立可響應的基本狀態變數，例如 `showModal`, `timer`              |
|                | `onUnmounted()`                       | 清除 setTimeout 避免記憶體洩漏（生命週期鈎子）                   |
|                | `defineAsyncComponent()`              | 延遲載入元件、觸發 `<Suspense>` fallback，提升初始效能與 UX      |
|                | `<script setup>`                      | Vue 3 官方推薦語法，支援預編譯 + 更少樣板碼，更快開發效率        |
| UI 動畫控制    | `<Transition>`                        | 控制 DOM 元素進出動畫（使用 fade 動畫類別）                      |
| 錯誤處理       | `onErrorCaptured()`                   | 捕捉子元件異常錯誤，可擴充為錯誤上報、備援處理                   |
| 非同步顯示控制 | `<Suspense>` + `defineAsyncComponent` | 非同步載入 `LazyBox` 時顯示 fallback，模擬真實 loading 狀況      |
| 元件跳脫渲染層 | `<Teleport>`                          | 將 Modal 元件跳脫渲染至 body，避免被父層遮擋，實作提示視窗       |
| 路由           | `useRouter()`                         | 實作 `goEditor()` 導頁功能，符合 Vue Router Composition API 寫法 |

## 🧠 特別說明 - LazyBox 非同步載入與 Suspense 運作原理

```js
const LazyBox = defineAsyncComponent(
  () =>
    new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(import("@/components/LazyBox.vue"));
      }, 1500);
    })
);
```

這段程式碼代表：

- `LazyBox.vue` 將在 1.5 秒後才實際載入，達到模擬載入延遲效果
- `<Suspense>` 在元件尚未載入前，會顯示 fallback 區塊
- 一旦 `LazyBox` 載入完成，畫面自動切換至元件內容

對應畫面結構如下：

```vue
<Suspense>
  <template #default>
    <LazyBox />
  </template>
  <template #fallback>
    <h1 style="background-color: red;">載入中...</h1>
  </template>
</Suspense>
```

## 📌 本頁應用重點

- 展示 Vue 3 各類語法結構（Composition API、元件傳值、非同步載入、過場動畫）
- 可作為學習 Vue 3 全新語法的模組化範例
- 特別強調 `<Suspense>` 與 `defineAsyncComponent` 搭配使用情境，常見於 dashboard、HMI、智慧製造等資料即時呈現系統中

---

這頁為 Vue 3 教學級展示頁面，涵蓋動畫、非同步元件、Modal、錯誤處理與路由跳轉，適合作品集與進階語法練習。
