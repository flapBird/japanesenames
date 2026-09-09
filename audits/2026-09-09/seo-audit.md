Japanese Names 搜索表现与站点审查 · 2026-09-09

目标站点：https://japanesenames.site/。目标关键词：japanese name generator。

结论：已证实的问题是搜索展示与平均排名持续走弱，主词尚未建立稳定可见性。当前抽查未发现全站禁止索引、错误主域 canonical、主要页面异常状态码等硬阻断。优先方向是生成结果的语义质量、可信证据、主词对应的产品价值，以及内容的可抓取组织；不足以把下降归因于 UI 美观程度。真实索引状态、Google 抓取记录、外链和现场性能尚缺证据，不能宣称已经锁定唯一算法原因。

**1. GSC 实际说明了什么**

三份文件 Filters 均为 Web 搜索，无额外查询或页面过滤。按文件内部日期识别窗口，不能按下载顺序猜测。

| 导出窗口 | 实际日期 | 展示 | 点击 | CTR | 全站平均排名约值 |
| --- | --- | ---: | ---: | ---: | ---: |
| 3 个月 | 2026-07-28—2026-09-06，41 天数据 | 2,108 | 4 | 0.19% | 35.55 |
| 28 天 | 2026-08-10—2026-09-06 | 658 | 0 | 0% | 69.09 |
| 7 天 | 2026-08-31—2026-09-06 | 37 | 0 | 0% | 81.19 |

计算：点击、展示来自 Chart 汇总；CTR=总点击/总展示；平均排名按每日展示加权，因为导出的日排名已经舍入，汇总为近似值。窗口相互包含，不能相加；也不能直接把 28 天总量和 7 天总量当作环比。

可比的最近两个完整 7 天：8/24—8/30 为 128 次展示，8/31—9/6 为 37 次，下降约 71.1%；相应全站平均排名约 78.14→81.19。查询、国家和设备组合也会影响平均排名，因此它不等于同一个词固定掉了几位。

早期所有 4 次点击发生在 7/30、7/31、8/1。3 个月导出中的可见查询只解释其中 3 次点击；不能补造第 4 个查询。最近 28 天没有 Google Web 搜索点击，GA 或服务器中的其他流量可能来自其他渠道。

| 查询 | 3 个月：展示 / 点击 / 平均排名 | 28 天 | 7 天 |
| --- | --- | --- | --- |
| japanese name generator | 3 / 0 / 33.00 | 未出现在查询表 | 未出现在查询表 |
| japanese last name generator | 21 / 0 / 56.57 | 13 / 0 / 68.38 | 3 / 0 / 78.33 |
| japanese name maker | 12 / 0 / 73.92 | 7 / 0 / 82.29 | 7 / 0 / 82.29 |

主词只有 3 次展示，不能把平均 33 名理解为目前稳定排在 33 名。查询表缺失也不等于绝对零展示，Google 会隐藏匿名及部分低量查询。全站 Chart 展示为 2,108，但可见 Queries 仅合计 1,080，不能用后者替代网站总量。[Google 查询数据限制](https://support.google.com/webmasters/answer/17011259?hl=en)

首页 Pages 数据为：整个窗口 1,048 展示 / 4 点击 / 26.73；28 天 251 / 0 / 70.68；7 天 29 / 0 / 83.76。最近 7 天 Pages 只出现首页、Yamamoto 和 Sato。它证明出现过搜索展示的 URL 变少，不证明其他页面已经退索引。整个窗口出现的 13 个 URL 也不是全站收录数量。[Google 属性与页面聚合口径](https://support.google.com/webmasters/answer/17011364?hl=en)

设备结构有明显变化：整个窗口 Mobile 为 740 展示、4 点击、平均 10.69；28 天 Mobile 仅 21 展示；7 天只剩 Desktop 37 展示。应进一步按设备、国家、查询联动检查，不能由此断言移动页面坏了，也不能把这些访问认定为机器人。

原始文件定位：

- [3 个月原始文件](</Users/wanggang/Downloads/japanesenames.site-Performance-on-Search-2026-09-09.xlsx>)：Chart A1:E42；Queries A71:E71 为主词；Pages A2:E2 为首页；Devices A1:E4。
- [28 天原始文件](</Users/wanggang/Downloads/japanesenames.site-Performance-on-Search-2026-09-09 (1).xlsx>)：Chart A1:E29；Pages A2:E2；Queries A3:E3 为姓氏生成器查询。
- [7 天原始文件](</Users/wanggang/Downloads/japanesenames.site-Performance-on-Search-2026-09-09 (2).xlsx>)：Chart A1:E8；Pages A1:E4；Queries A2:E3。

**2. 最值得调查的时间点**

8/9 全站日平均排名约 23.2，8/10 为 34.8，8/11 为 49.7，8/12 为 68.6。此后多数日期在 60—80 多名，展示持续减少。

本地 8/9 提交 `9340cc9` 同时改动了 23 个文件，包括名字数据、含义展示、结果卡布局、首页文案与资料说明。生成数据源文件从 1,012,431 字节增加到 1,570,508 字节；这只是源文件大小，不是网络传输量。新 `getMeaningPreview` 开始抽取每个汉字的首条英文释义并用加号连接。

时间接近使该提交值得重点复盘，但 Git 提交时间不等于部署时间，更不等于 Google 重新抓取时间。当前不能证明该提交造成了排名下降，也不能声称受到惩罚、存在固定“新站沙盒”，或者必须等待某个确定月数。站点从可见历史看约六周，不是已经有三个完整月的表现。

应核对 Vercel 实际部署、GSC 抓取时间、8/9 前后索引变化和同词同国家同设备表现。8/24 已优化首页 title/canonical 并增加姓氏生成器页面，现有数据尚未显示恢复；继续频繁改标题缺少依据。[Google 流量下降排查方法](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops)

**3. 实现和抓取：基础正常，有两处需要改进**

2026-09-09 对线上 HTTP 响应的实际抽查：

| 对象 | 结果 | 判断 |
| --- | --- | --- |
| 首页 | 200；H1 为 Japanese Name Generator；title 包含主词；canonical 指向本站首页 | 未见主词或主域配置错误 |
| robots.txt | 200；Allow /；仅禁止 /favorites、/cdn-cgi/ | 未见全站抓取阻断 |
| sitemap.xml | 200；30 个 URL | 正常返回，但不是收录证明 |
| /japanese-girl-names | 200；自引用 canonical；初始输出 24 张记录卡 | 有服务端内容 |
| /japanese-last-name-generator | 200；自引用 canonical；服务端输出示例结果 | 基础可抓取；GSC 尚未出现该 URL 的展示记录 |
| /name/rin | 200；index, follow；自引用 canonical | 允许索引 |
| /name/mizuki | 200；noindex, follow | 明确不允许索引，属于现有编辑策略 |
| /japanese-surnames | 308，目标为 /japanese-last-names | 正常归并 |
| 随机不存在路径 | 404 且 noindex | 未见把缺失页全部返回 200 的问题 |
| http:// 主域、https://www 子域 | 301 到 https://japanesenames.site/ | 主域统一 |

首页 HTML 约 115 KB，包含 React Suspense fallback，但也包含隐藏流式片段中的 6 张完整名字卡，以及 `$RC` 插入脚本。不能因为主文档先出现 Loading 就说它是空页面或 Google 看不到结果。仍需 GSC 实时测试的渲染 HTML/截图确认 Google 侧的最终状态。

第一处改进：列表后续结果只由按钮更新 `visible`，没有分页 URL，也没有下一页 `<a href>`。女孩列表有 236 条匹配，但初始只显示 24 条；后续 212 条不应被当成已经获得完整可见正文覆盖。部分数据存在于序列化脚本中，不能据此等同于可索引的列表正文。[Google 不会依靠点击 Load more 来抓取后续内容](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)。

建议用服务端分页配合真实链接；每页自引用 canonical，并允许用户通过 Load more 增强体验。不要把所有分页 canonical 回第一页，也不要放开所有筛选组合。优先让真正有用的名字集合和说明被稳定抓取。

第二处改进：女孩页响应体约 801 KB（此次未压缩读取），首页路由 JS 解压约 1,031 KB，压缩传输约 145 KB。这提示完整数据和编辑字段进入前端的成本。应把生成必需字段与详情/证据数据拆开，按需要加载，减少列表整库序列化。

这些体积不是 LCP、INP 或 CLS 的实测值，也没有证明性能造成下降。PageSpeed API 请求超时，浏览器自动化也未成功完成页面导航；工具失败不能作为站点对普通用户很慢的证据。需要实际移动性能与 GSC Core Web Vitals 来定优先级。[Google 页面体验说明](https://developers.google.com/search/docs/appearance/page-experience)

相关代码：[列表与分页](/Users/wanggang/Documents/Codex/japanesenames/src/components/names/FirstNameExplorer.tsx:15)、[Load more](/Users/wanggang/Documents/Codex/japanesenames/src/components/names/FirstNameExplorer.tsx:314)、[站点地图](/Users/wanggang/Documents/Codex/japanesenames/src/app/sitemap.ts:5)、[首页流式边界](/Users/wanggang/Documents/Codex/japanesenames/src/app/page.tsx:116)。

**4. 内容质量：比继续添加 SEO 文案更值得先修**

确定发现：线上女孩列表中，阿愛 Aai 的 Meaning 为 `Africa + love`，愛亜 Aia 为 `Love + Asia`。代码直接抽取 `part.meanings[0]`。这些字符的字典义或缩略义不能未经语境筛选就作为整个人名的含义。不能由此反过来断言拼写/读音不存在；缺陷在于释义选择和展示含义。

这段函数也用于首页生成卡，且卡片主标签仍为 Meaning，细节仅放在 title 提示里。首页承诺 kanji and meanings，结果质量因此是核心产品问题。修复应先使用经过人工核对的名字释义；没有证据时显示清晰的“字符释义，尚未确认名字含义”，不自动挑另一条听起来更美的释义来凑答案。

确定发现：可索引的 Rin 页面只有少量字义、两种写法、重复搭配和通用来源链接。记录标记 common、high、verified，但 `sourceIds` 只有常用汉字读音表，页面未提供与使用频率、性别倾向、自然度判断逐项对应的证据。与 imported 数据的细粒度来源记录相比，部分手工记录反而缺少可核验的判断依据。

建议优先审核默认生成池的 50—100 个实用读音及主要写法：补足读音/拼写来源、字义语境、性别与时代判断依据、来源年份、真实审校者和修订记录。若没有审校人或统计来源，就如实省略相关保证，不编造专家和“热门”数据。

默认列表在 9 条手工记录后连续出现 Aai、Aasa、Aamu、Aaya 等未排名记录。这来自 unranked 同级项保留已有顺序，不代表“最常见”。建议默认用明确的编辑精选序列，常见度数据另行提供；不要把数据库顺序变成用户的推荐顺序。

相关代码：[自动拼接释义](/Users/wanggang/Documents/Codex/japanesenames/src/lib/name-display.ts:3)、[生成卡 Meaning 标签](/Users/wanggang/Documents/Codex/japanesenames/src/components/generator/GeneratedNameCard.tsx:113)、[Rin 证据字段](/Users/wanggang/Documents/Codex/japanesenames/src/data/first-names.ts:26)。这些是可核实的质量缺陷，不是已经证明的 Google 降权原因。[Google 对原创价值、完整性与可信度的评估建议](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

**5. 关键词与内容组织：功能数据库还没有形成足够明确的搜索优势**

本地覆盖报告：280 个读音、528 个写法、221 个姓氏；279 个读音和 220 个姓氏可用于生成，只有 21 个姓名详情允许索引。线上 sitemap 的 30 个 URL 为 5 个产品/列表入口、4 个站务页面、21 个姓名详情。此处限制是明确策略，不是“忘了生成 sitemap”。少页面本身不妨碍一个工具排名，也不能靠增加页面数自动提高首页权重。

当前公开竞品体现不同价值：[Fantasy Name Generators](https://www.fantasynamegenerators.com/japanese-names.php)直接生成 10 个罗马字名字；[JapaneseNames.info](https://japanese-names.info/generator/)提供名字/姓氏/写法库、完整组合、过滤和转写入口；[Reedsy](https://reedsy.com/resources/character-name-generator/language/japanese/)把工具放在角色创作场景中。这是功能与内容比较，不是经过固定国家/设备验证的 Google 排名榜，也没有测量竞品外链或实际用户量。

本项目已有汉字、假名、罗马字、锁定姓/名、复制、收藏、发音和数据库来源，功能并非从零开始。要竞争主词，最有价值的定位是“容易生成、容易读懂、含义可信、能保留喜欢的名字部分”。多几个下拉菜单、更多通用 FAQ，尚不足以形成独特理由。

保留首页作为主词的唯一核心落地页，不再做一个内容相近的 /japanese-name-generator 来分散维护与内部链接。首页 H1 和 title 已正确命中目标，不需要增加关键词密度。

建议先完善现有页面：

- 首页负责完整名字生成，展示可用实例、名字顺序、读音与有依据的简短含义。
- 姓氏生成器负责 surname/last name generator 意图，核对其 GSC URL Inspection 状态；没有展示不代表未收录。
- 女孩/男孩列表负责浏览和比较名字；从这些入口回首页时保留性别。目前通用链接为 /#generator，生成器仅解析 surname 与 firstName，点击“Use a girl/boy name…”不会自动预设性别。
- 先把现有 21 个详情页做扎实；需要时增加有真实用途、独立说明和筛选结果的主题集合，比如名字中的月、光、爱。题材是否值得单独建页，还应看需求与可提供内容，避免把每个筛选组合变成近重复页面。

主题集合服务于用户选择并带来相关入口，不是已证实能“传权重”使主词上榜的公式。不要一次开放几百个字典薄页，也不要为了 SEO 全部移除 noindex。

**6. UI 与使用流程：有改善方向，但此次不冒充视觉实测**

浏览器工具多次导航超时，未取得可接受的线上截图，也未完成真实点击/移动视口验证。本节依据 JSX/HTML 结构，属于待视觉验证的流程审查；不能据此评价实际首屏高度、溢出、对比度、触摸体验或完整无障碍合规性。

| 步骤 | 当前证据与健康状况 | 建议 |
| --- | --- | --- |
| 1. 进入首页 | 标题正确，说明段较长；工具前置；视觉待验证 | 首段精简到一句用途和一句差异价值 |
| 2. 选择条件 | 默认展示性别、风格、模式、含义及汉字相关条件；交互待验证 | 首层保留性别和 Generate，高级条件折叠 |
| 3. 查看名字 | 响应包含 6 张卡；双顺序、标签、操作丰富；实际完成率未知 | 名字/读音/简短含义/复制优先，证据与更多信息展开 |
| 4. 保存、锁定、再生成 | 代码中具备这些功能；相关算法单测通过；浏览器端未实测 | 重点确保用户理解锁定后的行为，并测实际使用率 |
| 5. 从分类或详情回生成器 | 具体名字/姓氏可传入；通用女孩/男孩入口未传性别 | 保留入口上下文，避免用户重新筛选 |

这些更可能直接改善使用成功率。没有足够数据证明目前 UI 导致了 Google 排名下降；不建议先整体换主题、配色、Logo 或做一次大改版。

**7. 执行顺序与验证标准**

| 顺序 | 工作 | 为什么先做 | 验证方式 |
| --- | --- | --- | --- |
| P0 排查 | GSC 网页索引、首页/姓氏生成器 URL Inspection、手动措施/安全问题、8/9 部署与抓取记录 | 先排除仍未检查的硬问题 | 确认 Google 选定 canonical、允许索引、最近抓取、渲染结果与具体未收录原因 |
| P1 修复 | 人工审核核心生成池；修复字典释义直接拼人名含义；证据与标签一致 | 直接兑现主产品“有意义的日本名字”承诺 | 对默认与主要筛选结果抽样审查，错误语义不再出现 |
| P1 内容 | 精简重复说明；加强首页实例和 21 个详情的独立说明与可核验来源 | 提高用户使用价值与可比较优势 | 审核者可以逐项核对主要事实，而非只看到通用来源 |
| P1 技术 | 服务端分页与可抓取链接；保持唯一 canonical 策略 | 让优质列表内容稳定被发现 | 源码中有下一页链接，每页包含相应记录，索引策略一致 |
| P2 产品 | 高级条件折叠、精简卡片、分类回跳保留筛选 | 降低用户获得结果的步骤和理解成本 | 移动/桌面实际操作，监测 generate、copy、lock 使用 |
| P2 性能 | 缩减客户端数据与序列化字段 | 客观存在体积成本，但影响未实测 | 同设备前后性能对比，真实 LCP/INP/CLS，不以源码大小代替 |
| P2 推广 | 在确实相关的日语学习/角色创作资源中获得使用与引用 | 现有资料不能证明网站已建立外部认可 | GSC Links、真实引荐与品牌搜索；不购买批量链接 |

建议一个连续迭代周期内先完成 P0 和 P1，并记录每次上线时间；随后以不重叠 7 天窗口看趋势，以 28 天看较稳定变化。避免同时改域名、URL、模板、标题和整个数据库，使前后变化无法解释。观察期不是排名承诺。

监测主词 exact query 与相关 generator 查询组；优先看展示是否持续出现、哪些落地页得到展示、同设备同国家排名，再看已有足够展示时的 CTR。站内跟踪生成→复制/收藏/锁定使用，不把站内转化率直接当作 Google 排名信号。

目标应先是建立持续主词展示、扩大确有价值的相关查询覆盖、恢复自然点击；当前 3 次主词展示不足以制定有把握的 Top 10 时限。

**8. 已完成验证与边界**

已读取三份原始 GSC 导出，检查查询/页面/设备/国家及每日曲线；核对当前本地代码和关键 Git 历史；直接抓取首页、robots、sitemap、代表页面和跳转响应；核对当前公开竞品与 Google 官方指南。

本地 `npm run data:report` 成功；针对名字生成、sitemap、数据质量与显示逻辑的 4 个测试文件、20 个测试全部通过。它说明已有测试约束成立，不证明语言学含义正确，也不代表浏览器交互和 Google 渲染通过。

未修改应用代码、未部署、未改动原始 Excel。未取得有效视觉截图/移动交互结果、Core Web Vitals、GSC 索引导出、真实 Googlebot 日志、外链报告或生产部署日志。没有把普通 HTTP 抓取成功当作 Googlebot 全部可抓取，也没有把搜索工具的 site: 空结果当作未收录证据。
