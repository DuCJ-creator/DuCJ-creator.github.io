# Shirley's Crack TOEIC

一個可直接部署到 GitHub Pages 的靜態互動學習網站，整合：

- TOEIC Listening & Reading 現行七大題型與 200 題結構
- 863 筆雙語主題字彙
- 七大題型策略與原創練習
- 聽力逐句／逐選項自然停頓播放，以及完整標點逐字稿
- English-first、繁中支援的完整雙語介面
- 六單元《Ready for University》完整大學先修課程
- SQ3R、Cornell 筆記、主動聆聽與 15×4 專注法
- 40 組原創 Proofreading Lab：完整涵蓋教材 22 條文法規則、Essential Grammar Mind Map 與六組整合複習，共 120 個判斷
- 本機儲存的學習進度、錯題與筆記

## 本機預覽

請用本機伺服器開啟（直接雙擊 `index.html` 時，瀏覽器通常不允許載入 CSV）：

```bash
python3 -m http.server 4173
```

然後開啟 `http://localhost:4173`。

## GitHub Pages

1. 將整個資料夾推送到 GitHub repository。
2. 在 repository 的 **Settings → Pages** 選擇 **Deploy from a branch**。
3. 選擇 `main` branch 與 `/ (root)` 後儲存。

網站不需要建置工具或後端。`data/toeic-vocab.csv` 必須與其他檔案一併上傳。

## 內容聲明

網站的練習題為教學用途之原創內容，並非 ETS 官方題目；TOEIC 為 ETS 的註冊商標。本專案未受 ETS 贊助或認可。
