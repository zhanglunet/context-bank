# 上下文银行

**好方法，拿来就用。** 开源分享Skills、经验与工作流；个人上下文由自己管理。

- 浏览与使用无需站内登录，贡献通过GitHub PR。
- 公开仓库索引、网页生成Markdown、人或Agent提交PR。
- 个人资料留在自己的工作目录，本站不读取或上传。

## 网站

https://context.zhanglu.net/

## 本地运行

Node.js 22+：`npm ci` → `npm test` → `npm run build` → `npm run dev`，访问http://localhost:4173。

## 投稿

阅读[CONTRIBUTING.md](CONTRIBUTING.md)与[Schema](schemas/practice.schema.json)。
两个内置Skill可用：`npx skills add zhanglunet/context-bank --skill table-check` 或 `--skill source-ledger`。安装前审阅内容；兼容性尚未逐平台实测。

## 发布

main通过CI后构建并发布GitHub Pages；内容PR合并即可更新。自定义域名由Cloudflare Worker读取GitHub Pages发布内容，内容PR合并后自动更新。Worker配置修改用`npm run deploy`，需维护者本机Wrangler登录，凭据不进入仓库。
可信作者名单默认空；首次贡献短审，精选与实测标识单独维护。

## 许可

网站代码与skills：MIT（LICENSE）。本站原创content：CC BY 4.0（content/LICENSE.md）。外部索引保留各自许可。

## 从实际工作开始

首页按六个方向阅读：周报与报告、管理上下文、沉淀与推广最佳实践、CLI小系统、研发与异步交付、调研与传播。原49条细目可展开查看，旧详情链接保留。

34个Skill详情提供固定来源版本的命令，切换Codex、Claude Code或Cursor安装目标，并分别列出运行依赖和使用任务。WorkBuddy/其他AI先走手动方法路径，不宣称自动导入或执行已测。安装只复制技能定义，不自动安装业务CLI或取得账号授权。

实测记录：[合成任务与环境](site/evidence/2026-10-18/report.md)。source-ledger、table-check由Codex显式调用读取技能后产出合成周报和检查清单；outcome-ledger通过CLI台账闭环。未做其他工具、自动触发成功率或真实业务收益测试。
