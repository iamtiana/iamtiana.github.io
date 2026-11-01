// ============================================================
//  Tiana's Tapes — 這是唯一需要改的檔案。
//  改完存檔、git push，一兩分鐘後網站就更新。
// ============================================================
window.TAPES = [
  {
    id: 'music',
    label: 'Music',
    title: 'On Repeat',
    subtitle: 'from YouTube Music',
    // Spotify 歌手 ID：打開 open.spotify.com 的歌手頁，網址最後那串 22 碼就是
    artists: [
      { name: 'The Weeknd',       spotifyId: '1Xyo4u8uXC1ZmMpatF05PJ' },
      { name: 'Taylor Swift',     spotifyId: '06HL4z0CvFAxyc27GXpf02' },
      { name: 'Ariana Grande',    spotifyId: '66CXWjxzNUsdJxJ2JdwvnR' },
      { name: 'Tate McRae',       spotifyId: '45dkTj5sMRSjrmBSBeiHym' },
      { name: 'LANY',             spotifyId: '49tQo2QULno7gxHutgccqF' },
      { name: 'The Chainsmokers', spotifyId: '69GGBxA162lTqCwzJG5jLp' },
    ],
  },
  {
    id: 'reading',
    label: 'Reading',
    title: 'Shelf',
    subtitle: 'two sides, flip to switch',
    // 封面圖放 images/books/，檔名自己取，這裡填路徑
    sides: [
      { name: 'Side A · 商業・成長', books: [
        { title: '發現你的天職',            cover: 'images/books/a01.jpg' },
        { title: '好策略・壞策略',          cover: 'images/books/a02.jpg' },
        { title: '大格局大思維',            cover: 'images/books/a03.jpg' },
        { title: '底層邏輯',                cover: 'images/books/a04.jpg' },
        { title: '原子習慣',                cover: 'images/books/a05.jpg' },
        { title: '與成功有約',              cover: 'images/books/a06.jpg' },
        { title: '致富心態',                cover: 'images/books/a07.jpg' },
        { title: '慣習 Habitus',            cover: 'images/books/a08.jpg' },
        { title: '給予',                    cover: 'images/books/a09.jpg' },
        { title: 'The Diary of a CEO',      cover: 'images/books/a10.jpg' },
        { title: '世界盡頭的咖啡館',        cover: 'images/books/a11.jpg' },
        { title: 'Google 超級用人學',       cover: 'images/books/a12.jpg' },
      ]},
      { name: 'Side B · 心理・人性', books: [
        { title: '當你自律自控，才能又美又爽', cover: 'images/books/b01.jpg' },
        { title: '一個司法心理學家的告白',   cover: 'images/books/b02.jpg' },
        { title: '驗屍官傳奇',              cover: 'images/books/b03.jpg' },
        { title: '非常關係',                cover: 'images/books/b04.jpg' },
        { title: '也許你該找人聊聊',        cover: 'images/books/b05.jpg' },
        { title: '誰說人是理性的！',        cover: 'images/books/b06.jpg' },
        { title: '教出殺人犯',              cover: 'images/books/b07.jpg' },
        { title: '我們為何不愛了？',        cover: 'images/books/b08.jpg' },
      ]},
    ],
  },
  {
    id: 'screen',
    label: 'Screen',
    title: 'Rom-com Forever',
    subtitle: 'genre: rom-com',
    items: [
      '10 Things I Hate About You',
      'Love and Other Drugs',
      'Off Campus',
      'Friends',
      'The Big Bang Theory',
      'Suits',
    ],
  },
  {
    id: 'wayfinding',
    label: 'Way Finding',
    title: 'Way Finding',
    subtitle: 'fields I have wandered through',
    fields: [
      { name: '人資',        note: '工研院、金士頓人資實習；人資聚會總召' },
      { name: '心理諮商',    note: '清大教育心理與諮商學系' },
      { name: '顧問',        note: '清大管顧社 專案生、人才長，現在是專案助教' },
      { name: '引導 / 講師', note: 'Xplore 交大設計人生' },
      { name: '產品 PM',     note: '新創，專案開發與管理' },
    ],
    now: {
      label: 'now building',
      lines: [
        '正在幫連鎖藥局做一套新系統。',
        '先去藥局站在櫃台後面，看藥師怎麼叫藥、怎麼盤點、怎麼在 LINE 群組裡撈公告，把現場流程搞懂。',
        '然後把需求整理出來和跟 AI 一起 vibe coding，把系統做出來。',
      ],
    },
    photo: null, // 之後要放照片：改成 'images/me.jpg'
  },
];
