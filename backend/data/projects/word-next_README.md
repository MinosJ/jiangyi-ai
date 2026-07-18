### routes

- /words-next/long-sent 长难句
- /words-next/ai-study ai 学习
- /words-next/study-group 学习角
- /words-next/flash-learning/share?book_id={} 极速刷单词分享
- /words-next/mini-learn mini 复习单元
- /words-next/share-plan 分享得好礼（种草官）
- /words-next/ielts-intelli-mark 高考作文批改
- /words-next/ielts-intelli-mark/payment 作文批改购买额度
- /words-next/ielts-intelli-mark/payment/success
- /words-next/mistake-vocabs 错词本
- /words-next/mistake-vocabs/dates 错词本-按日期过滤

- /words-next/op/25-school-test 25 年开学活动

### TODO

- [x] 使用 markdown-it 为项目 md 解析器
  > remark 太复杂了....也不需要用到 AST

### 注意项

- motion@11 版本建议不做升级,motion@12 在 ios13 有兼容性 bug，会导致页面崩掉
  1. motion@11 中， variant 中使用 staggerChildren 代替 delayChildren:stagger(x)
