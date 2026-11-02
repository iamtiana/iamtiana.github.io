# Tiana's Library

我的個人網站：https://iamtiana.github.io

## 想改內容的時候

只要改 `data.js` 這一個檔案。

- 歌手：改 `artists` 裡的名字和 Spotify ID（打開 open.spotify.com 的歌手頁，網址最後那串 22 碼）。
- 歌：`tracks` 裡加一行 `{ name: '歌名', artist: '歌手', spotifyId: '歌曲 ID' }`（歌曲頁網址 `/track/` 後面那串 22 碼）。
- 書：封面圖放進 `images/books/`，然後在 `sides` 裡加一行 `{ title: '書名', author: '作者', blurb: '兩句話簡介', cover: 'images/books/檔名.jpg' }`。`author` 和 `blurb` 不填也可以，就只會顯示書名。
- 影集 / 電影：`items` 裡加一行 `{ title: '片名', poster: '海報圖網址', link: '點了連去哪' }`。影集的海報可以用 `python3 scripts/find-posters.py` 查（改檔案裡的片名清單），電影可以用 Wikipedia 頁面上的海報圖網址。只給 `title` 不給 `poster` 也可以，會變成純文字一行。
- My Likes：`items` 裡一格一行 `{ name: '中文', en: '英文小字', icon: '圖示名', bg: '底色' }`，圖示名要是 `covers.js` 裡 `LIKE_ICONS` 有的；想加新圖示就在那裡照樣畫一個。
- 封面：每本有 `covers` 陣列，裡面每一個物件就是一個版本，網站每次打開隨機抽一個，底下的「shuffle editions」可以手動換。每個版本：`layout`（`bottom` 書名在下 / `top` 書名在上 / `band` 圖形橫跨整本）、`bg` 底色、`ink` 文字色、`panel` 色塊、`accent` 強調色、`dark` 深色、`mark` 圖形名（要是 `covers.js` 裡 `COVER_MARKS` 有的）。想加第四個版本就多加一個物件。
- Way Finding：`fields` 改領域，`now.lines` 改現在在做的事，`photo` 填圖片路徑就會顯示照片。

改完存檔，在這個資料夾執行：

    node scripts/check-data.js
    git add -A
    git commit -m "update content"
    git push

第一行會檢查有沒有填錯（少逗號、檔名打錯之類的）。一兩分鐘後網站就更新了。

## 在本機預覽

    python3 -m http.server 8787

然後打開 http://localhost:8787/ 。
想看手機版長什麼樣：http://localhost:8787/scripts/phone-preview.html

## 檔案說明

| 檔案 | 用途 |
|---|---|
| `data.js` | 所有內容（唯一要改的檔案） |
| `index.html` | 頁面骨架 |
| `style.css` | 樣式 |
| `covers.js` | 五本書的封面圖形和 My Likes 的圖示（SVG） |
| `renderers.js` | 每本書的內頁怎麼畫 |
| `script.js` | 書架、翻開/合上互動 |
| `scripts/check-data.js` | 檢查 `data.js` 有沒有填錯 |
| `scripts/phone-preview.html` | 本機看手機版用 |
| `scripts/find-posters.py` | 查影集 / 電影海報網址用 |
| `scripts/crop-covers.py` | 當初從投影片裁書封用的，平常不用碰 |
| `docs/superpowers/` | 設計 spec 和實作計畫 |
