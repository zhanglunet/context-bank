# 典型技能实测 · 2026-10-18

所有输入为合成材料。测试在新建临时目录进行，未接入真实群、企业数据或生产系统。模型推理使用在线服务。没有把私人目录或群讨论作为测试输入。

## 环境与范围

macOS，Node v26.11.1，skills CLI 1.7.2，Codex CLI 0.147.0；执行模型gpt-5.6-sol。固定技能来源见下表。skills CLI安装时只复制技能定义；依赖另行安装。

|技能|安装|执行|验收|
|---|---|---|---|
|source-ledger|Codex安装成功；Claude Code/Cursor目标路径也写入成功|Codex读取安装技能，依据合成工作记录生成weekly-report.md|S1–S4可追溯，区分初稿、合成跑通和真实上线，无虚构责任人|
|table-check|Codex安装成功|Codex读取安装技能，检查orders.csv|识别1个金额空值、重复A002、CNY/USD混杂；未输出跨币种总额|
|outcome-ledger|Codex安装成功|按技能流程运行Livepowers CLI 1.5.0|基线60、当前40；人工12＋返工3＝总成本15；验收1项、平均15|

前两项为同一轮显式指定技能的合成任务验证，不代表独立盲测或自动选技能成功率。Claude Code/Cursor只验证安装路径，没有执行其模型任务。outcome-ledger只验证CLI闭环，不代表由其他模型自主完成。

## 固定来源与命令

本站技能版本：ee88200960b62f1fae0690e8fe006fa49ffa1867。
Livepowers技能版本：454fd2a0f882ada65f97392709872a71582596da。

```sh
npx --yes skills@1.7.2 add https://github.com/zhanglunet/context-bank/tree/ee88200960b62f1fae0690e8fe006fa49ffa1867 --skill source-ledger table-check --agent codex -y --copy
npx --yes skills@1.7.2 add https://github.com/zhanglunet/livepowers/tree/454fd2a0f882ada65f97392709872a71582596da --skill outcome-ledger --agent codex -y --copy
npx --yes skills@1.7.2 add https://github.com/zhanglunet/context-bank/tree/ee88200960b62f1fae0690e8fe006fa49ffa1867 --skill source-ledger --agent claude-code cursor -y --copy
npx --yes --package=livepowers@1.5.0 lp init
npx --yes --package=livepowers@1.5.0 lp outcome baseline --scenario synthetic-weekly --metric minutes --value 60 --target 30 --direction lower --owner synthetic-reviewer --confirmed-at 2026-10-18T05:00:00Z
npx --yes --package=livepowers@1.5.0 lp outcome cost --scenario synthetic-weekly --kind human --amount 12
npx --yes --package=livepowers@1.5.0 lp outcome cost --scenario synthetic-weekly --kind rework --amount 3
npx --yes --package=livepowers@1.5.0 lp outcome accept --scenario synthetic-weekly --by synthetic-reviewer
npx --yes --package=livepowers@1.5.0 lp outcome measure --scenario synthetic-weekly --metric minutes --value 40
npx --yes --package=livepowers@1.5.0 lp outcome report
```

## Agent任务

明确要求读取已安装的两个SKILL.md，仅处理fixtures目录的合成记录与CSV，向outputs写周报、表格检查和接续上下文。未确认金额定义、去重与汇率口径前不汇总金额；不得虚构负责人、日期或上线状态。没有让Agent安装依赖、联网搜集业务材料或发送消息。

## 失败与恢复

首次CLI默认模型gpt-6-luna返回“当前ChatGPT账号不支持”而没有执行任务。随后只在这次调用选用本机列表中的gpt-5.6-sol，任务成功；未修改默认配置。模型、账号与权限是环境依赖，不把这次环境失败隐藏或算成技能成功。

## 可核对产物

同目录的work-log.md、orders.csv为合成输入；weekly-report.md、table-check.md、context.md和outcome-report.md为产物。公开副本中仅把“未联网”澄清为“未进行业务联网操作，模型推理使用在线服务”；未公开CLI会话日志、配置或凭证。

本次只证明上述版本、环境、输入和检查项。其他31个Skill未做执行验证；不推算成功率或真实业务收益。
