# Superpowers-JA Eval Transcripts

このディレクトリは、skill の品質を継続的に確認するための eval transcript を管理します。目的は自動採点ではなく、agent が日本の IT 開発現場で期待どおりに振る舞ったかを、再確認できる形で残すことです。

## いつ作るか

- 日本向け original skill を追加または大きく更新したとき
- 上流由来 skill の日本語化で、agent の行動が変わる可能性があるとき
- 障害報告、受入テスト仕様、顧客向け文面など、出力品質の判断に文脈が必要なとき

## 保存場所

`evals/transcripts/YYYY-MM-DD-<skill-name>-<scenario>.md`

例:

```text
evals/transcripts/2026-05-17-japanese-incident-report-final-report.md
```

## 最低限含めるもの

- 対象 skill と scenario
- 入力 prompt
- 期待する振る舞い
- 実際の出力または要約
- 判定結果: Pass / Needs work / Fail
- 判定理由
- 次に直すこと

## 判定基準

**Pass:** skill の主要な意図を満たし、現場でそのまま使える出力になっている。

**Needs work:** 方向性は合っているが、表現、抜け漏れ、構造、証跡の扱いに改善余地がある。

**Fail:** skill が発動しない、要求と違う形式になる、危険な断定や不適切な顧客向け表現を含む。

## 運用ルール

- transcript には secret、実在顧客名、個人情報を含めない
- 実案件を元にする場合は匿名化し、固有情報を架空値へ置き換える
- 判定は甘くしない。顧客向けに出せないものは Pass にしない
- eval は監査証跡なので、skill 更新時に古い transcript を上書きせず、新しい transcript を追加する
- 自動 test ではないため、`scripts/audit.sh` の成否とは分けて扱う
