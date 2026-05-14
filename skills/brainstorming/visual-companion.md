# Visual Companion Guide

browser-based visual brainstorming companion。prototype、diagram、option を表示するために使う。

## When To Use

session 単位ではなく、質問ごとに判断する。基準は、**ユーザーが読むより見る方が理解しやすいか**。

**browser を使う:** 内容自体が visual な場合。

- **UI prototype** — wireframe、layout、navigation structure、component design
- **Architecture diagram** — system component、data flow、relationship diagram
- **Side-by-side visual comparison** — layout、color scheme、design direction の比較
- **Design polish** — look and feel、spacing、visual hierarchy に関わる質問
- **Spatial relationship** — state machine、flow chart、entity relationship diagram

**terminal を使う:** 内容が text または table の場合。

- **Requirement / scope question** — 「X は何を意味しますか」「どこまでを scope に含めますか」
- **Conceptual A/B/C option** — text で説明した案の選択
- **Trade-off list** — pros / cons、comparison table
- **Technical decision** — API design、data modeling、architecture approach
- **Clarifying question** — 回答が text であり、visual preference ではない質問

UI topic でも、すべてが visual question ではない。「どのような wizard が必要か」は conceptual question なので terminal を使う。「この wizard layout のどれが自然に見えるか」は visual question なので browser を使う。

## How It Works

server は directory 内の HTML file を監視し、最新 file を browser に表示する。あなたは HTML content を書き、ユーザーは browser で見て、option をクリックできる。選択結果は `.events` file に記録され、次の会話 turn で読む。

**content fragment vs full document:** HTML file が `<!DOCTYPE` または `<html` で始まる場合、server はそのまま表示する（helper script だけ注入する）。それ以外の場合、server は content を framework template で包む。template は head、CSS theme、selection indicator、interaction infrastructure を提供する。**default は content fragment を書く。** full control が必要な場合だけ full document を書く。

## Start Session

```bash
# server を起動し、prototype を project 内へ永続化する
scripts/start-server.sh --project-dir /path/to/project

# 返り値:
# {"type":"server-started","port":52341,"url":"http://localhost:52341",
#  "screen_dir":"/path/to/project/.superpowers/brainstorm/12345-1706000000"}
```

response の `screen_dir` を保存する。ユーザーに URL を開いてもらう。

**connection info を探す:** server は起動 JSON を `$SCREEN_DIR/.server-info` に書く。background 起動で stdout を捕捉していない場合は、この file から URL と port を読む。`--project-dir` を使った場合は、`<project>/.superpowers/brainstorm/` で session directory を確認する。

**注意:** project root を `--project-dir` として渡すと、prototype は `.superpowers/brainstorm/` に永続化され、server restart で失われない。指定しない場合、file は `/tmp` に保存され、cleanup 時に削除される。必要なら `.superpowers/` を `.gitignore` に追加するようユーザーへ伝える。

**platform 別の server 起動:**

**Claude Code (macOS / Linux):**

```bash
# default mode でよい。script が server を background に移す
scripts/start-server.sh --project-dir /path/to/project
```

**Claude Code (Windows):**

```bash
# Windows は自動検出され foreground mode になり、tool call を block する。
# Bash tool call で run_in_background: true を設定し、
# server が conversation turn 間で生き続けるようにする。
scripts/start-server.sh --project-dir /path/to/project
```

Bash tool call では `run_in_background: true` を設定する。次の turn で `$SCREEN_DIR/.server-info` を読み、URL と port を取得する。

**Codex:**

```bash
# Codex は background process を回収することがある。
# script は CODEX_CI を検出すると foreground mode に切り替える。
# 通常通り実行すればよい。追加 flag は不要。
scripts/start-server.sh --project-dir /path/to/project
```

**Gemini CLI:**

```bash
# --foreground を使い、shell tool call で is_background: true を設定する。
# これにより process が turn 間で生き続ける。
scripts/start-server.sh --project-dir /path/to/project --foreground
```

**その他の環境:** server は conversation turn 間で background 稼働を続ける必要がある。環境が detached process を回収する場合は `--foreground` を使い、platform の background execution mechanism で起動する。

browser から URL にアクセスできない場合（remote / container environment でよくある）、non-loopback host に bind する。

```bash
scripts/start-server.sh \
  --project-dir /path/to/project \
  --host 0.0.0.0 \
  --url-host localhost
```

`--url-host` は、返却される URL JSON に表示する hostname を制御する。

## Work Loop

1. **server が生きていることを確認**し、`screen_dir` に新しい HTML file を**書く**。
   - 書く前に `$SCREEN_DIR/.server-info` が存在するか確認する。存在しない、または `.server-stopped` がある場合は server が停止している。続行前に `start-server.sh` で再起動する。server は 30 分 idle で自動終了する。
   - semantic filename を使う: `platform.html`、`visual-style.html`、`layout.html`
   - **file name を再利用しない** — screen ごとに新しい file を使う
   - Write tool を使う。**cat / heredoc を使わない**（terminal output が noisy になる）
   - server は最新 file を自動表示する

2. **ユーザーに表示内容を伝えて turn を終える。**
   - 毎回 URL を remind する（初回だけではない）
   - screen に何が表示されているか短く説明する（例: 「3 つの home layout option を表示しています」）
   - terminal で返答してもらう: 「見て、感想を教えてください。必要なら option をクリックして選べます。」

3. **次の turn** — ユーザーが terminal で返答した後:
   - `$SCREEN_DIR/.events` があれば読む。browser interaction（click、choice）が JSON Lines で記録されている
   - terminal text と events を合わせて complete feedback として扱う
   - terminal message が primary feedback。`.events` は structured interaction data

4. **iterate or advance** — feedback が current screen の修正を求めている場合、新しい file（例: `layout-v2.html`）を書く。current step が検証されてから次の質問へ進む。

5. **terminal に戻るときは unload する** — 次の step で browser が不要な場合（clarifying question、trade-off discussion など）、waiting screen を push して古い content を消す。

   ```html
   <!-- filename: waiting.html（または waiting-2.html など）-->
   <div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
     <p class="subtitle">terminal で続けます...</p>
   </div>
   ```

   これにより、ユーザーがすでに解決済みの choice を見続ける状態を防ぐ。次の visual question が出たら、通常通り新しい content file を push する。

6. 完了まで繰り返す。

## Writing Content Fragments

page 内部に入る content だけを書く。server が framework template（head、theme CSS、selection indicator、interaction infrastructure）で自動的に包む。

**minimal example:**

```html
<h2>どの layout がよいですか。</h2>
<p class="subtitle">読みやすさと visual hierarchy を重視してください</p>

<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>single column</h3>
      <p>simple で focused な reading experience</p>
    </div>
  </div>
  <div class="option" data-choice="b" onclick="toggleSelect(this)">
    <div class="letter">B</div>
    <div class="content">
      <h3>two column</h3>
      <p>sidebar navigation と main content area</p>
    </div>
  </div>
</div>
```

これだけでよい。`<html>`、CSS、`<script>` tag は不要。server が提供する。

## Available CSS Classes

framework template は次の CSS class を content に提供する。

### Options (A/B/C choice)

```html
<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>title</h3>
      <p>description</p>
    </div>
  </div>
</div>
```

**multi-select:** container に `data-multiselect` を付けると、ユーザーは複数 option を選択できる。click のたびに selected state が toggle され、indicator bar に count が表示される。

```html
<div class="options" data-multiselect>
  <!-- 同じ option markup。複数選択 / 解除が可能 -->
</div>
```

### Cards (visual design)

```html
<div class="cards">
  <div class="card" data-choice="design1" onclick="toggleSelect(this)">
    <div class="card-image"><!-- prototype content --></div>
    <div class="card-body">
      <h3>name</h3>
      <p>description</p>
    </div>
  </div>
</div>
```

### Mockup Container

```html
<div class="mockup">
  <div class="mockup-header">preview: dashboard layout</div>
  <div class="mockup-body"><!-- prototype HTML --></div>
</div>
```

### Split View

```html
<div class="split">
  <div class="mockup"><!-- left --></div>
  <div class="mockup"><!-- right --></div>
</div>
```

### Pros / Cons

```html
<div class="pros-cons">
  <div class="pros"><h4>Pros</h4><ul><li>benefit</li></ul></div>
  <div class="cons"><h4>Cons</h4><ul><li>drawback</li></ul></div>
</div>
```

### Mock Elements (wireframe blocks)

```html
<div class="mock-nav">Logo | Home | About | Contact</div>
<div style="display: flex;">
  <div class="mock-sidebar">navigation</div>
  <div class="mock-content">main content area</div>
</div>
<button class="mock-button">action button</button>
<input class="mock-input" placeholder="input">
<div class="placeholder">placeholder area</div>
```

### Typography / Sections

- `h2` — page title
- `h3` — section title
- `.subtitle` — supporting text under title
- `.section` — content block with bottom margin
- `.label` — small uppercase label text

## Browser Event Format

ユーザーが browser で option を click すると、interaction record は `$SCREEN_DIR/.events` に保存される（1 行 1 JSON object）。新しい screen を push すると file は自動的に clear される。

```jsonl
{"type":"click","choice":"a","text":"Option A - simple layout","timestamp":1706000101}
{"type":"click","choice":"c","text":"Option C - complex grid","timestamp":1706000108}
{"type":"click","choice":"b","text":"Option B - hybrid approach","timestamp":1706000115}
```

event stream 全体は、ユーザーの探索過程を示す。最終決定前に複数 option を click することがある。最後の `choice` event が最終選択であることが多いが、click pattern から迷いや確認すべき preference が見える場合もある。

`.events` が存在しない場合、ユーザーは browser interaction を行っていない。terminal text のみを使う。

## Design Tips

- **fidelity を question に合わせる** — layout question には wireframe、polish question には detailed design
- **各 page で問いを説明する** — 「どの layout がより professional に見えますか」のように、単に「選んでください」で終わらせない
- **前進前に iterate する** — feedback が current screen を変更する場合は新 version を書く
- 1 screen の option は最大 **2-4 個**
- **必要なら real content を使う** — photography portfolio なら実画像を使う。placeholder content は design 問題を隠す
- **prototype は simple に保つ** — pixel-perfect design ではなく layout と structure に集中する

## File Naming

- semantic name を使う: `platform.html`、`visual-style.html`、`layout.html`
- file name を再利用しない。screen ごとに新しい file が必要
- iteration version は suffix を付ける: `layout-v2.html`、`layout-v3.html`
- server は modified time で最新 file を表示する

## Cleanup

```bash
scripts/stop-server.sh $SCREEN_DIR
```

session が `--project-dir` を使っている場合、prototype file は後から参照できるよう `.superpowers/brainstorm/` に残る。削除されるのは `/tmp` session のみ。

## Reference

- framework template (CSS reference): `scripts/frame-template.html`
- helper script (client): `scripts/helper.js`
