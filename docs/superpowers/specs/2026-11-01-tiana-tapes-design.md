# Tiana's Tapes — 個人網站設計 spec

日期：2026-11-01
網址：https://iamtiana.github.io（GitHub Pages，repo `iamtiana/iamtiana.github.io`）

## 目的

給朋友看的個人頁，日常風格。靈感來自 garychang.dev 的「檔案櫃」單頁互動，但換成自己的隱喻：**一箱卡帶**。不是履歷、不是作品集；重點是有趣、有個性。

## 技術

純 HTML + CSS + JS，無框架、無 build。四個檔案：

| 檔案 | 用途 |
|---|---|
| `index.html` | 頁面骨架，只有卡帶箱的結構，內容由 JS 從 `data.js` 填入 |
| `style.css` | 所有樣式 |
| `script.js` | 讀 `data.js`、生成四捲卡帶和內頁、處理點擊展開/收合 |
| `data.js` | **唯一需要日後編輯的檔案**。一個 JS 物件，四個區塊的文字和圖片檔名 |
| `images/` | 書封圖（從使用者投影片裁下）、之後可能加照片 |

字體用 Google Fonts 載入。部署方式：推到 GitHub `main` 分支根目錄，GitHub Pages 自動發布。

## 視覺

- 背景：米白偏暖（參考 `#f3efe6` 左右），卡帶外殼用深色（`#2b2722`），強調色一個暖紅（`#d9534f`），只用在「now building」這類小標。
- 字體（三種，都從 Google Fonts 載入）：
  - **大標題：Oswald 600，首字大寫、不全大寫**（例：`Way Finding`、`On Repeat`）。使用者原本挑 Anton，看過並排比較後改選 Oswald，理由是沒那麼重。
  - **小標籤、卡帶側標、箱子底下的字：Jost 400/500，全大寫、字距 0.22em 左右**。這是使用者在 garychang.dev 上喜歡的那種乾淨感（Avenir 類幾何無襯線）。
  - **中文與內文：Noto Sans TC**；中文粗體用 700。
  - **整站不用襯線體**（使用者明確不喜歡）。
- 版面原則：**留白要多**。使用者看到擠的版面會直接說擠。每捲內頁最大寬度約 560px，行距 1.8。
- 不要照抄 Gary 的任何元件；卡帶箱是自己的東西。

## 首頁：卡帶箱

- 畫面中央一個卡帶收納箱，四捲卡帶直立排列，側標（spine）露出來寫類別名：`MUSIC` / `READING` / `SCREEN` / `WAY FINDING`。
- 箱子下方小字：`TIANA'S TAPES · 4 TAPES`。
- 互動：點一捲 → 該捲從箱子滑出、放大到畫面中央，顯示內頁（J-card）；內頁上方顯示 `TIANA'S TAPES · 0n / 4`。再點卡帶本體或旁邊空白處 → 收回。同一時間只開一捲。
- 動畫用 CSS transition 即可，時間 300ms 上下，不要炫。
- 手機（< 640px）：卡帶改成直向堆疊，點了往下展開內頁，不做滑出動畫。

## 四捲內頁

### 01 MUSIC
- 標題 `ON REPEAT`，副標 `from YouTube Music`。
- 六位歌手：The Weeknd、Taylor Swift、Ariana Grande、Tate McRae、LANY、The Chainsmokers。
- 每位一張 Spotify 公開嵌入卡片（`open.spotify.com/embed/artist/...`，compact 高度 80px），訪客不用登入即可看到歌手圖與試聽。不放自己抓的歌手照片（版權）。
- `data.js` 存歌手名與 Spotify artist ID；若某位嵌入失敗，退回只顯示文字列。

### 02 READING
- 兩面：`SIDE A · 商業・成長`（12 本）、`SIDE B · 心理・人性`（8 本），用一個小切換鈕換面。
- 每本顯示封面圖＋書名，排成書架格狀（桌機一列 4 本，手機一列 3 本）。
- 封面來源：使用者提供的兩張投影片截圖，裁成 20 張獨立圖放 `images/books/`。
- Side A：發現你的天職、好策略・壞策略、大格局大思維、底層邏輯、原子習慣、與成功有約、致富心態、慣習 Habitus、給予、The Diary of a CEO、世界盡頭的咖啡館、Google 超級用人學。
- Side B：當你自律自控，才能又美又爽、一個司法心理學家的告白、驗屍官傳奇、非常關係、也許你該找人聊聊、誰說人是理性的！、教出殺人犯、我們為何不愛了？

### 03 SCREEN
- 標題 `ROM-COM FOREVER`（或類似，可改），一行小字 `genre: rom-com`。
- 六部，純文字列表，每部一行：10 Things I Hate About You、Love and Other Drugs、Off Campus、Friends、The Big Bang Theory、Suits。
- 不放海報圖（版權）。

### 04 WAY FINDING
- 標題 `Way Finding`（Oswald）。**沒有時間軸、沒有大一到大四**。
- 五個領域，一行一個，編號 01–05，領域名粗體＋一句短描述（淡色）：
  1. 人資 — 工研院、金士頓人資實習；人資聚會總召
  2. 心理諮商 — 清大教育心理與諮商學系
  3. 顧問 — 清大管顧社 專案生、人才長，現在是專案助教
  4. 引導 / 講師 — Xplore 交大設計人生
  5. 產品 PM — 新創，專案開發與管理
- 分隔線後一塊 `● NOW BUILDING`（紅色小標），下面是定稿文案，**不加數字、不加細節**：

  > 正在幫連鎖藥局做一套新系統。
  > 先去藥局站在櫃台後面，看藥師怎麼叫藥、怎麼盤點、怎麼在 LINE 群組裡撈公告，把現場流程搞懂。
  > 然後把需求整理出來和跟 AI 一起 vibe coding，把系統做出來。

- 不寫客戶名稱、不寫專案代號。
- 預留一個可選的照片欄位（`data.js` 裡 `photo: null`），使用者之後給檔案再放。

## 內容更新方式（給使用者）

所有文字、書名、歌手、圖片檔名都在 `data.js`。改完存檔、`git push`，一兩分鐘後網站更新。不需要碰其他三個檔案。

## 測試與驗收

1. 本機用 `python3 -m http.server` 開，桌機瀏覽器點四捲都開合一次，確認內容正確、沒有跑版。
2. 縮到 400px 寬，確認直向堆疊、無橫向捲動。
3. Spotify 嵌入在無登入狀態下可見。
4. 推上 GitHub 後開 https://iamtiana.github.io 再驗一次。

## 不做的事（YAGNI）

- 不做部落格、不做碎碎念、不做留言。
- 不做深色模式。
- 不做 CMS 或後台；`data.js` 就是後台。
- 不買網域（之後要再接）。
