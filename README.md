# Chord Trainer (ウクレレコード変換)

GitHub Pages 公開先:
- https://hikavn.github.io/Chord_Trainer/

## ローカル開発

```bash
npm install
npm run dev
```

表示された URL（通常 `http://localhost:5173`）で確認できます。

## 本番ビルド

```bash
npm run build
npm run preview
```

`vite.config.js` で build 時の `base` を `/Chord_Trainer/` にしているため、
GitHub Pages のプロジェクトページ配下でもアセットが正しく解決されます。

## GitHub Pages デプロイ

このリポジトリには GitHub Actions で `main`（または `master`）ブランチへ
**push（= ローカルのコミットを GitHub に送信）**したときに
`dist/` を Pages へデプロイする workflow (`.github/workflows/deploy.yml`) を含めています。

1. GitHub リポジトリの **Settings → Pages** を開く
2. **Build and deployment** の Source を **GitHub Actions** にする
3. `git push origin main`（または `git push origin master`）で自動公開されます
