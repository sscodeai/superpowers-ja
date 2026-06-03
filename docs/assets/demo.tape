Output docs/assets/demo.gif
Set FontSize 16
Set Width 900
Set Height 520
Set Theme "Catppuccin Mocha"
Set TypingSpeed 40ms
Set Padding 20

# Scene 1: Install superpowers-ja
Type "cd ~/my-project && npx superpowers-ja"
Enter
Sleep 1s

# Simulate install output
Set TypingSpeed 0ms
Type@0ms ""
Sleep 300ms

Ctrl+L

Set TypingSpeed 0ms

# Simulated install output line by line
Type "  superpowers-ja v0.3.1 — Superpowers 日本語・日本 IT 開発版"
Enter
Sleep 200ms
Type "  Source: 23 skills"
Enter
Sleep 200ms
Type "  Target project: /Users/demo/my-project"
Enter
Sleep 500ms
Type "  ✅ Claude Code: 23 skills -> .claude/skills/"
Enter
Sleep 200ms
Type "  ✅ Claude Code: bootstrap -> CLAUDE.md"
Enter
Sleep 200ms
Type "  インストール完了。AI coding tool を再起動すると有効になります。"
Enter
Enter
Sleep 1.5s

# Scene 2: User gives a task
Set TypingSpeed 40ms
Type `claude "ユーザー管理に一括エクスポート機能を追加して"`
Enter
Sleep 1.5s

# Simulate AI brainstorming response
Set TypingSpeed 15ms
Type "  brainstorming skill で要件と制約を整理します。"
Enter
Enter
Sleep 300ms
Type "  実装前に、次の点を確認したいです。"
Enter
Enter
Sleep 200ms
Type "  1. 出力形式は CSV / Excel のどちらですか。複数形式が必要ですか。"
Enter
Sleep 200ms
Type "  2. 想定件数はどの程度ですか。1 万件超なら非同期処理を検討します。"
Enter
Sleep 200ms
Type "  3. 権限要件はありますか。管理者のみ export 可能にしますか。"
Enter
Sleep 200ms
Type "  4. 画面の検索条件を反映した export が必要ですか。"
Enter
Enter
Sleep 500ms
Type "  よくある実装案として、まず 2 案で整理します。"
Enter
Enter
Sleep 300ms
Type "  案 A: 同期 export（5,000 件未満向け）"
Enter
Type "    - Response に stream で書き込み、クリック後すぐ download"
Enter
Type "    - 利点: 実装が軽く、追加 infrastructure が不要"
Enter
Type "    - 注意: 大量 data では timeout risk がある"
Enter
Enter
Sleep 300ms
Type "  案 B: 非同期 job + download link（大量 data 向け）"
Enter
Type "    - worker が file を生成し、完了後に link を通知"
Enter
Type "    - 利点: request を塞がず、件数増加に対応しやすい"
Enter
Type "    - 注意: queue と object storage が必要"
Enter
Enter
Sleep 500ms
Type "  上記を確認できれば、権限、監査ログ、文字コードを含めて設計します。"
Enter
Sleep 3s
