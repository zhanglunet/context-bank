---
{
  "schema_version": 1,
  "id": "plugin-packaging",
  "type": "note",
  "title": "把一个大技能包拆成可单独安装的小插件",
  "summary": "按使用场景划分插件，核对目标平台的当前格式与路径。",
  "scenarios": [
    "研发"
  ],
  "author": "zhanglunet",
  "license": "CC-BY-4.0",
  "compatibility": [
    {
      "tool": "支持文本输入的AI；具体工具集成需自行验证",
      "verification": "unverified"
    }
  ],
  "updated_at": "2026-10-18"
}
---

## 适用任务
一个技能仓库越来越大，同事只需要其中一部分能力。

## 输入
现有技能列表、依赖关系、准备支持的平台与版本。

## 步骤
1. 按独立任务分组，让每个包只有一个清楚的用途。
2. 查目标平台当前官方 schema，核对 manifest、路径和必填字段。
3. 把需要发布的技能文件放进包内，避免依赖包外本机路径。
4. 在干净目录核对安装入口、缺失依赖和卸载方式，记录验证环境。

## 合成示例
虚构仓库分成“表格检查”和“报告生成”两个插件；不需要报告的同事只安装前者。

## 提示词
请按任务把这些技能划分为插件，列出文件清单、依赖、manifest待核对项与安装验收步骤。不要声称已兼容尚未验证的平台。

## 限制
各平台发布格式会变化，应在实际发布时查官方文档；本稿不提供未经验证的一键发布命令。
本条为方法整理，未做逐平台实测，不代表来源项目的效果背书。个人上下文与真实业务材料由使用者自行管理。

## 来源与整理说明
依据[公开趋势工作流 Skill](https://github.com/zhanglunet/trend-workflow/blob/1bd65fa15470099e05afd0c289036c8dcd067fed/SKILL.md)中的流程与 PLAYBOOK 摘要重新编写，来源代码与技能许可为 MIT。原作：zhanglunet，Copyright (c) 2026。未复制第三方实现或原站效果数字。新增操作说明与合成示例采用 CC BY 4.0。公开背景：[趋势看板工作流介绍](https://trend.zhanglu.net/workflow)。
