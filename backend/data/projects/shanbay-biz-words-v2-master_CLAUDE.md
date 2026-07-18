# shanbay-biz-words-v2

扇贝单词业务侧主仓（独立 demo App + 一组可发版 AAR module）。
App 仅做壳子（`com.shanbay.sentence`，入口 `WelcomeActivity` → `MainActivity`，
`Application` 为 `WordsV2Application`），真正的业务能力都在 `module-biz-words-*` 里，
并通过 `bay-biz-words-v2` 这一层胶水聚合给宿主 App（扇贝主 App / 其他壳）使用。

## 双形态：源码 vs. AAR

每个 module 在 `config.gradle` 的 `wordsVersion` 中都有发版号（如 `wordsBase: "1.1.79.0"`），
默认通过 maven 二进制 (`com.shanbay.biz:words-*`) 集成。
设置 `WORDS_DEBUG_SOURCE_ENABLED=true`（或 `local.properties` 的 `words.debug.source.enabled=true`）后，
根 `build.gradle` 的 `dependencySubstitution` 会把所有 `com.shanbay.biz:words-*` 替换成本地 `project(":module-biz-words-*")` 进行源码联调。
**改动 module 后要发测试包请用 skill `bay-words-bump-and-build`。**

## Module 索引

> 包结构统一为 `com.shanbay.bay.biz.words.v2.<module-name>.<sub-package>`。
> 列出来的子包就是该 module 的"分层目录"，按子包名能快速定位职责。

| Module | 一句话 | 关键子包 / 入口 | 谁依赖它 |
|---|---|---|---|
| **module-biz-words-base** | 全体共用基础：网络 api、ktx、mvvm 脚手架、埋点 trace、AB、view 基类、市场渠道。改这里影响面最大。 | `api` `mvvm` `view` `trace` `ab` `cas` `events` `market` `quark` `speed` `hivoice` `ktx` `utils` | 几乎所有其他 module |
| **module-biz-words-media** | 音频播放与下载（发音、单词包资源）。 | `audio` `download` `Env.java` | walkman / test / book / study / lexicon |
| **module-biz-words-widget** | 通用 UI 控件库（弹窗、列表 adapter、自定义 view、付费引导、字体、webview 容器）。**只放 UI 不放业务**。 | `ui` `view` `popup` `adapter` `pay` `fontU` `webview` `base` `utils` | walkman / test / book / study / lexicon |
| **module-biz-words-setting** | 学习设置页（每日学习量、提醒、字体、应用图标 applet 等），含本地配置 dao。 | `view` `dao` `dialog` `applet` `font` `abtest` `api` `utils` | widget / test / book / study / lexicon |
| **module-biz-words-walkman** | 听单词 / 听写模式：`ListenEnterV3Activity`、`ListenLearningActivity`、`ListenV3LearningActivity`（普通/睡眠模式）+ 播放器、调度、拼写。 | `ListenLaucher.kt` `ListenPlayer.kt` `schedule` `spell` `report` `next` `nice` `service` `transform` | bay-biz-words-v2（聚合）|
| **module-biz-words-test** | 单词检测（vocab test / 阶段性测试）：进入流程、答题、结果。 | `enter` `result` `spell` `integration` `v2` `setting` `dao` `audio` | bay-biz-words-v2（聚合）|
| **module-biz-words-book** | 词书相关：选书 (`bookselect`)、书城 (`bookstore`)、`VocabularyTestActivity`、推荐、扩展词包、拍照添加。 | `activity` `bookselect` `bookstore` `recommend` `expansion` `takephotos` `newbay` `viewmodel` `renderer` `helper` | bay-biz-words-v2（聚合）|
| **module-biz-words-study** | **学习主流程**（最重的 module）：`StudyActivity` 入口；session 调度、答题校验、AI 释义、wordsearching、临时拼写、本地同步、完成页等。 | `StudyActivity.java` `session` `study` `check` `quick` `finish` `tempSpell` `sync` `wordsearching` `ai` `favorite` `search` `setting` `nice` `vibration` | lexicon / bay-biz-words-v2 |
| **module-biz-words-lexicon** | 生词本：分类管理、收藏、词表、`favorites.AddCustomWordFavoriteActivity` 自建词表。依赖 study 复用学习能力。 | `favorites` `wordlist` `simple` `common` `action` `audio` `view` | bay-biz-words-v2（聚合）|
| **bay-biz-words-v2** | **聚合 / 胶水层**：`BizWordsInitializer` 初始化总入口；webview adapter、track、search、young 模式、abtest、widget、tp 等跨模块协作代码。依赖**全部** `module-biz-words-*`。改这里通常意味着调多 module 协作。 | `BizWordsInitializer.java` `WordsWebViewListenerAdapter.java` `webview` `search` `track` `young` `abtest` `widget` `tp` `mvvm` `quark` `speed` `base` `util` `ktx` | app（以及外部宿主 App） |
| **app** | 独立 demo App 壳，包名 `com.shanbay.sentence`，仅 3 个类（Welcome / Main / Application）。日常业务**不要**写在这里，写在对应 module。 | `WelcomeActivity` `MainActivity` `WordsV2Application` | — |

## 依赖分层（从低到高）

```
base
 ├── media ─┬── walkman ──┐
 │         ├── widget ────┼── setting ──┬── study ── lexicon ──┐
 │         └── ...        │             ├── test  ─────────────┤
 │                        │             ├── book  ─────────────┤
 │                        │             └── walkman ───────────┤
 │                        └─────────────────────────────────────┤
 └─────────────────────────────────────────────────────────────►bay-biz-words-v2
                                                                       │
                                                                       ▼
                                                                      app
```

改动定位口诀：
- 学单词流程相关 → `study`
- 听单词 / 睡眠模式 → `walkman`
- 阶段测/词汇量测 → `test`
- 词书/选书/书城 → `book`
- 生词本/收藏 → `lexicon`
- 设置/字体/提醒 → `setting`
- 通用 UI 控件 → `widget`
- 网络/埋点/MVVM/AB → `base`
- 音频/资源下载 → `media`
- 跨模块串联（webview JSBridge、初始化、search） → `bay-biz-words-v2`
- 宿主壳/启动 → `app`

## 其他

- 构建相关脚本约定见根目录 `bay-words-bump-and-build` skill；CI 走 `module-multi-build` Jenkins job。
- 项目级 skills 索引见 `AGENTS.md`。
- 公共依赖、版本号、第三方库统一在 `config.gradle` 中维护，禁止在子 module 的 `build.gradle` 里硬编码版本号。

## Agent skills

配置由 `/setup-matt-pocock-skills` 生成，供 `tdd` / `diagnose` / `triage` / `to-prd` / `to-issues` / `improve-codebase-architecture` / `zoom-out` 等 skill 读取。

### Issue tracker

本地 markdown：issue / PRD 以文件形式存在 `.scratch/<feature>/` 下（**不**在 GitLab Issues 跟踪）。详见 `docs/agents/issue-tracker.md`。

### Triage labels

用默认 5 个角色（`needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`），在本地 issue 文件里以 `Status:` 行记录。详见 `docs/agents/triage-labels.md`。

### Domain docs

单上下文：术语表在根目录 `CONTEXT.md`，完整 module 索引在 `CLAUDE.md`，ADR 由 `/grill-with-docs` 按需写入 `docs/adr/`。详见 `docs/agents/domain.md`。
