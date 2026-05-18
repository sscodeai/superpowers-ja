# GIF 録画ガイド

## 方法 1: macOS 画面収録（推奨、最も自然）

### 準備
1. terminal font を 18pt 以上にし、背景は dark theme にする
2. 検証用 project directory `~/demo-project` を用意する
3. `superpowers-ja` が利用できる状態にしておく

### 録画手順
1. **Cmd+Shift+5** で画面収録を開き、terminal window だけを録画範囲にする
2. 次の操作を実行する:

```bash
# Step 1: install（3 秒程度）
cd ~/demo-project
npx superpowers-ja

# Step 2: AI に要件を渡す（応答を待つ）
claude "ユーザー管理に一括エクスポート機能を追加して"
```

3. AI が日本語で brainstorming（確認事項 + 案）を出したところまで録画する
4. 画面収録を停止する

### GIF 変換
```bash
# mov を gif に変換（ffmpeg）
ffmpeg -i recording.mov -vf "fps=10,scale=700:-1:flags=lanczos" -c:v gif docs/assets/demo.gif

# 2MB を超える場合は fps または size を下げる
ffmpeg -i recording.mov -vf "fps=8,scale=600:-1:flags=lanczos" -c:v gif docs/assets/demo.gif
```

## 方法 2: VHS script（入力と出力を script で再現）

```bash
cd /path/to/superpowers-ja
vhs docs/assets/demo.tape
```

注意: VHS は keyboard 入力を再現するため、AI 出力は tape file 内の `Type` で明示的に組み立てる。

## 仕上がり基準
- 長さ: 15-20 秒
- ファイルサイズ: < 2MB
- 重要 frame: AI が日本語で確認事項と設計方針を出していることが分かる
