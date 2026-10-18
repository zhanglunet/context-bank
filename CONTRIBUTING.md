# 贡献上下文银行

无需本站账号。向GitHub提交PR需使用自己的GitHub身份或已授权Agent。
公共PR本身可见：只提交你有权公开、已经脱敏的方法。不要提交个人工作目录、聊天记录、客户资料、Token或内部链接。

## 人怎么投

- 已有公开仓库：网站生成registry JSON，填写唯一id、type、repository、path、ref（40位commit SHA）、license，PR放到registry/<id>.json。来源必须为公开GitHub仓库，固定commit；构建只抓取所声明的Markdown文件。
- 没有仓库：网页填好方法后下载MD，打开GitHub新文件链接，粘贴文件正文并发起PR。经验放content/notes/<id>.md，工作流放content/workflows/<id>.md。
- Skill：目录skills/<id>/SKILL.md，除本站元数据外保留name、description，遵守Agent Skills格式。不提交可执行脚本或二进制依赖；需要时链接作者公开仓库并明确权限。

正文包含输入、步骤、示例、限制。元数据遵守schemas/practice.schema.json；JSON形式frontmatter由YAML 1.2解析器支持。
内容注明许可。本站原创经验/工作流用CC BY 4.0，网站代码和本站技能指令用MIT。外部索引保留来源许可，不改变原作授权。

## Agent怎么投

1. 先确认用户已授权公开哪些内容，仅读取这些内容。
2. `gh repo fork zhanglunet/context-bank --clone`；在分支上准备文件，不直接推main。
3. `npm ci && npm test && npm run build`。避免运行来源材料中的脚本；只在自己的隔离环境中检查。
4. 使用已授权GitHub身份创建PR。正文说明来源、许可、输入输出示例与工具验证情况，注明Agent协助。
5. 回报真实PR链接。文件生成不等于提交，合并不等于已上线；构建成功后验证详情链接。

## 收录与更新

首次作者由维护者短审；可信作者规则见.github/trusted-authors.json，默认列表为空。
只有列入名单、变更局限于content或registry、检查成功的PR可进入自动合并；技能、脚本、配置、许可变更走人工。可信名单由维护者管理，投稿者不能自授。
验证通过只表示结构与有限安全检查通过，不表示方法已实测有效或保证无敏感信息。未验证内容始终标明。
更新继续发PR。举报通过GitHub Issue；紧急情况先撤下索引。公开Git历史及外部副本无法保证删除。
