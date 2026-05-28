# Superpowers-JA Roadmap

この roadmap は、`superpowers-ja` を日本の IT 開発現場でそのまま使える品質へ近づけるための短期作業を整理します。

## Phase 1: 高頻度 skill の日本語化

上流由来の長文 skill と参考資料には、まだ移植元の中文表現が残る箇所があります。すべてを一度に翻訳するのではなく、agent が実際に呼び出しやすい順に進めます。

| Priority | Skill | 理由 | Status |
| --- | --- | --- | --- |
| P0 | `brainstorming` | 新規 feature、仕様確認、設計相談で最初に使われることが多い | Done |
| P0 | `executing-plans` | 計画を別 session で実行する場面で必ず呼ばれる | Done |
| P0 | `finishing-a-development-branch` | 実装完了後の merge / PR 判断で常用される | Done |
| P0 | `using-superpowers` | bootstrap 後に agent が skill 利用方針を理解する入口 | Done |
| P1 | `test-driven-development` | 日本企業で重視される品質保証、レビュー、受入条件に直結する | Done |
| P1 | `systematic-debugging` | 障害調査、不具合修正、再発防止で利用頻度が高い | Done |
| P1 | `verification-before-completion` | 完了報告前の検証証跡を強制し、現場運用品質に効く | Done |

## Phase 2: Review / delivery workflow の日本語化

Phase 1 の後、review 周辺と計画 / 並列実行系の skill を整理します。

| Priority | Skill | 理由 | Status |
| --- | --- | --- | --- |
| P2 | `requesting-code-review` | PR / MR 前の第三者 review を促す | Done |
| P2 | `receiving-code-review` | 指摘対応の姿勢、再検証、説明責任を整える | Done |
| P2 | `using-git-worktrees` | 複数作業や agent 並列実行時の安全性に関わる | Done |
| P2 | `writing-plans` | 実装計画の品質を底上げする | Done |

## Phase 3: 日本向け original skill の拡充

上流 skill の翻訳だけでなく、日本の SI / 受託開発 / 自社サービス運用で頻出する成果物を original skill として追加します。

| Priority | Skill | 理由 | Status |
| --- | --- | --- | --- |
| P0 | `japanese-incident-report` | 障害初報、続報、最終報告、再発防止策は日本の運用現場で頻出する | Done |
| P1 | `japanese-acceptance-test-spec` | 受入条件、検収、証跡、QA 観点を日本語で揃えやすくする | Done |
| P1 | `japanese-code-review-graph` | 大規模 codebase の影響範囲、risk、test gap を日本向け review 証跡にする | Done |

## Phase 4: Eval transcript による品質管理

日本向け original skill は、実案件に近い scenario で出力品質を確認します。自動採点ではなく、prompt、期待動作、実際の出力、判定理由を transcript として残します。

| Priority | Item | 理由 | Status |
| --- | --- | --- | --- |
| P0 | `evals/transcripts` の運用ルール | skill の品質判断を後から追えるようにする | Done |
| P0 | `japanese-incident-report` の初回 transcript | 最初の original skill eval としてテンプレート化する | Done |
| P1 | `japanese-acceptance-test-spec` の transcript | 次の original skill 追加時に eval を同時作成する | Done |
| P1 | `japanese-code-review-graph` の transcript | optional integration の効果を review scenario で確認する | Done |

## Phase 5: 配布・保守体験の日本語化

installer、audit、demo asset、CI 周辺の文言を日本語 fork として違和感なく保守できる状態にします。

| Priority | Item | 理由 | Status |
| --- | --- | --- | --- |
| P0 | `scripts/audit.sh` の出力と README の監査説明 | CI failure 時に日本語 project として原因を追いやすくする | Done |
| P0 | demo 録画素材の日本語化 | README / release asset で最初に見る例を日本語利用シーンに揃える | Done |
| P1 | installer maintenance comment の整理 | 今後の fork maintenance で意図を読み取りやすくする | Done |

## Phase 6: 上流 v5.x 追従

上流 `obra/superpowers` が v5 系で更新した skill 内容に追従し、`scripts/audit.sh` の Skill structure drift 警告を解消します。直訳ではなく日本の現場向けに adapted 化することを基本方針とします。

| Priority | Item | 理由 | Status |
| --- | --- | --- | --- |
| P0 | `writing-skills` を上流 v5.1.0 へ追従 | audit が drift 警告を出している唯一の skill。CSO / Anti-Pattern / Implementation / Real-World Impact 等の新 section を日本語 adapted で取り込む | Todo |
| P1 | 残り skill の上流差分一括 audit | `scripts/audit.sh` を拡張するか、補助 script で他 skill の見出し差分も検知できるようにする | Todo |
| P2 | 上流 sync workflow の整備 | 上流 main の skill 更新を定期 fetch して差分を report する仕組み (GitHub Actions など) | Todo |

## Done Criteria

各 skill の日本語化では、単純翻訳ではなく次を満たします。

- 日本の SIer、受託開発、自社サービス開発で自然に使える表現にする
- 仕様、受入条件、影響範囲、検証証跡、承認の考え方を必要に応じて補う
- AI の行動を変える強い文言は、意味を崩さずに移植する
- `node bin/superpowers-ja.js --help` と `bash scripts/audit.sh --quick` を通す
- 変更した skill が `npm pack --dry-run --json` の package に含まれることを確認する
- original skill を追加または大きく更新した場合は、`evals/transcripts/` に eval transcript を追加する
