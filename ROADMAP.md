# Superpowers-JA Roadmap

この roadmap は、`superpowers-ja` を日本の IT 開発現場でそのまま使える品質へ近づけるための短期作業を整理します。

## Phase 1: 高頻度 skill の日本語化

上流由来の長文 skill と参考資料には、まだ移植元の中文表現が残る箇所があります。すべてを一度に翻訳するのではなく、agent が実際に呼び出しやすい順に進めます。

| Priority | Skill | 理由 | Status |
| --- | --- | --- | --- |
| P0 | `brainstorming` | 新規 feature、仕様確認、設計相談で最初に使われることが多い | Done |
| P0 | `executing-plans` | 計画を別 session で実行する場面で必ず呼ばれる | Done |
| P0 | `finishing-a-development-branch` | 実装完了後の merge / PR 判断で常用される | Done |
| P0 | `using-superpowers` | bootstrap 後に agent が skill 利用方針を理解する入口 | Todo |
| P1 | `test-driven-development` | 日本企業で重視される品質保証、レビュー、受入条件に直結する | Todo |
| P1 | `systematic-debugging` | 障害調査、不具合修正、再発防止で利用頻度が高い | Todo |
| P1 | `verification-before-completion` | 完了報告前の検証証跡を強制し、現場運用品質に効く | Todo |

## Phase 2: Review / delivery workflow の日本語化

Phase 1 の後、review 周辺と計画 / 並列実行系の skill を整理します。

| Priority | Skill | 理由 | Status |
| --- | --- | --- | --- |
| P2 | `requesting-code-review` | PR / MR 前の第三者 review を促す | Todo |
| P2 | `receiving-code-review` | 指摘対応の姿勢、再検証、説明責任を整える | Todo |
| P2 | `using-git-worktrees` | 複数作業や agent 並列実行時の安全性に関わる | Todo |
| P2 | `writing-plans` | 実装計画の品質を底上げする | Todo |

## Done Criteria

各 skill の日本語化では、単純翻訳ではなく次を満たします。

- 日本の SIer、受託開発、自社サービス開発で自然に使える表現にする
- 仕様、受入条件、影響範囲、検証証跡、承認の考え方を必要に応じて補う
- AI の行動を変える強い文言は、意味を崩さずに移植する
- `node bin/superpowers-ja.js --help` と `bash scripts/audit.sh --quick` を通す
- 変更した skill が `npm pack --dry-run --json` の package に含まれることを確認する
