---
{
  "schema_version": 1,
  "id": "capability-spec",
  "type": "note",
  "title": "用一份能力清单生成 CLI 与 Skill 草稿",
  "summary": "让参数和说明共享来源，生成后仍需人工核对业务含义。",
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
同一能力的命令行帮助和技能说明频繁不一致。

## 输入
已确认的能力名称、参数类型、约束、权限、错误与示例。

## 步骤
1. 把真实能力整理为 capability.yaml 等结构化清单。
2. 定义参数、必填项、返回字段和权限，不在生成阶段推断业务规则。
3. 分别生成 CLI 框架和 SKILL.md 草稿，标记尚未实现的能力。
4. 由维护者核对命令映射和文档，再决定实现与发布。

## 合成示例
虚构能力 inspect-table：file为必填路径，mode仅允许schema或stats；草稿中不生成未声明的写入能力。

## 提示词
根据这份已确认的能力清单起草CLI帮助与Skill说明，列出缺失定义；没有定义的业务行为不要补造。

## 限制
生成器草稿不等于可运行实现；不得把未实现命令写成可用功能。
本条为方法整理，未做逐平台实测，不代表来源项目的效果背书。个人上下文与真实业务材料由使用者自行管理。

## 来源与整理说明
依据[公开趋势工作流 Skill](https://github.com/zhanglunet/trend-workflow/blob/1bd65fa15470099e05afd0c289036c8dcd067fed/SKILL.md)中的流程与 PLAYBOOK 摘要重新编写，来源代码与技能许可为 MIT。原作：zhanglunet，Copyright (c) 2026。未复制第三方实现或原站效果数字。新增操作说明与合成示例采用 CC BY 4.0。公开背景：[趋势看板工作流介绍](https://trend.zhanglu.net/workflow)。
