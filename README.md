# Tiana's Tapes

我的個人網站：https://iamtiana.github.io

## 想改內容的時候

只要改 `data.js` 這一個檔案。

- 歌手：改 `artists` 裡的名字和 Spotify ID（打開 open.spotify.com 的歌手頁，網址最後那串 22 碼）。
- 書：封面圖放進 `images/books/`，然後在 `sides` 裡加一行 `{ title: '書名', cover: 'images/books/檔名.jpg' }`。
- 影集：`items` 裡加一行字串。
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
| `renderers.js` | 四捲卡帶內頁怎麼畫 |
| `script.js` | 卡帶箱、開合互動 |
| `scripts/check-data.js` | 檢查 `data.js` 有沒有填錯 |
| `scripts/phone-preview.html` | 本機看手機版用 |
| `scripts/crop-covers.py` | 當初從投影片裁書封用的，平常不用碰 |
| `docs/superpowers/` | 設計 spec 和實作計畫 |
