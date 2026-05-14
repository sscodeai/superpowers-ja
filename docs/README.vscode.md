# Superpowers-JA — VS Code (Copilot) インストールガイド

VS Code + GitHub Copilot で superpowers-ja を使うための完全ガイドです。

## 前提条件

- VS Code（最新版）
- GitHub Copilot 拡張機能（無料版 / 有料版いずれも可）

## クイックインストール

```bash
cd /your/project
npx superpowers-ja
```

インストールスクリプトが `.github/` を自動検出し、skills を該当ディレクトリにコピーします。

## 手動インストール

```bash
git clone https://github.com/sscodeai/superpowers-ja.git
mkdir -p /your/project/.github/superpowers
cp -r superpowers-ja/skills/* /your/project/.github/superpowers/
```

## 仕組み

VS Code Copilot は `.github/copilot-instructions.md` をプロジェクト単位のカスタム指示として使用します：

- **配置場所**: プロジェクトルートの `.github/copilot-instructions.md`
- **フォーマット**: Markdown
- **適用範囲**: ワークスペース内のすべての Copilot Chat とインライン補完
- **自動ロード**: 保存後に即時反映、再起動不要

### 推奨設定

Copilot は主に単一の指示ファイルで動作するため、`.github/copilot-instructions.md` から skills を参照する設定を推奨します：

```markdown
# Copilot カスタム指示

## ワークフロー手法

本プロジェクトは superpowers-ja skills framework を採用しています。
新しいタスクを開始する前に、以下の手法を参考にしてください：

- 新規要件 → まずブレインストーミング（.github/superpowers/brainstorming/SKILL.md）
- 実装 → TDD（.github/superpowers/test-driven-development/SKILL.md）
- バグ調査 → systematic-debugging（.github/superpowers/systematic-debugging/SKILL.md）
- コードレビュー → 日本語コードレビュー（.github/superpowers/japanese-code-review/SKILL.md）

## 日本語プロジェクト規約

- コードコメントとドキュメントは日本語
- Git commit は日本語の commit 規約に従う
- 技術用語は英語表記を保持
```

### `.instructions.md` ファイルの利用（推奨）

VS Code は粒度の細かい `.instructions.md` ファイルもサポートします：

```
.github/
  copilot-instructions.md          # グローバル指示
  .instructions/
    typescript.instructions.md     # TypeScript ファイル専用
    testing.instructions.md        # テスト関連
```

## 使い方

VS Code 内で：
- **Copilot Chat**（`Ctrl+Shift+I`）: skill 名を直接参照
- **インライン補完**: copilot-instructions.md のルールに自動的に従う
- **`/init`**: Chat に入力するとプロジェクト設定を自動生成

## 制限事項

VS Code Copilot は Claude Code のような `Skill` ツールやサブエージェント派遣には対応していません。以下の skills は手動で参照する形になり、自動実行はできません：

- 並列 agent 派遣（Agent framework が必要）
- サブエージェント駆動開発（Agent framework が必要）
- Git Worktree 利用（ターミナル操作が必要）

その他の手法系 skills（ブレインストーミング、TDD、デバッグ、コードレビューなど）は完全互換です。

## アップデート

```bash
cd /your/project
npx superpowers-ja
```

## サポート

- Issue: https://github.com/sscodeai/superpowers-ja/issues
- VS Code Copilot 公式ドキュメント: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
