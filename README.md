# 上下文银行

**好方法，拿来就用。** 开源分享Skills、经验与工作流；个人上下文由自己管理。

- 浏览与使用无需站内登录，贡献通过GitHub PR。
- 公开仓库索引、网页生成Markdown、人或Agent提交PR。
- 个人资料留在自己的工作目录，本站不读取或上传。

## 网站

https://zhanglunet.github.io/context-bank/

## 本地运行

Node.js 22+：`npm ci` → `npm test` → `npm run build` → `npm run dev`，访问http://localhost:4173。

## 投稿

阅读[CONTRIBUTING.md](CONTRIBUTING.md)与[Schema](schemas/practice.schema.json)。
两个内置Skill可用：`npx skills add zhanglunet/context-bank --skill table-check` 或 `--skill source-ledger`。安装前审阅内容；兼容性尚未逐平台实测。

## 发布

main通过CI后构建并发布GitHub Pages；内容PR合并即可更新。Cloudflare Workers可用`npm run deploy`手动部署，需维护者本机Wrangler登录，凭据不进入仓库。
可信作者名单默认空；首次贡献短审，精选与实测标识单独维护。

## 许可

网站代码与skills：MIT（LICENSE）。本站原创content：CC BY 4.0（content/LICENSE.md）。外部索引保留各自许可。
