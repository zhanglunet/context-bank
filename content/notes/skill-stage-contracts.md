---
{
  "schema_version": 1,
  "id": "skill-stage-contracts",
  "type": "note",
  "title": "大 Skill 拆阶段，用明确契约交接",
  "summary": "把收集、分析、生成和核对分开，失败时能定位并恢复。",
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
单个技能职责过多，失败后难以判断应该重做哪一步。

## 输入
现有流程、阶段输入输出、外部依赖及人工确认点。

## 步骤
1. 按可以独立检查的产物拆阶段，而非按任意文本长度切分。
2. 为交接数据定义JSON Schema：必填字段、状态、版本与来源。
3. 每步先验证输入，再产生产物；缺字段时返回可恢复错误。
4. 明确重试范围、幂等标识和需要人工决定的分叉。

## 合成示例
合成流程：材料清单 → 带来源的事实表 → 报告草稿 → 核对结果；事实表缺来源时不继续出结论。

## 提示词
将这条流程拆成有明确输入输出的阶段，给出交接字段、验证规则、失败恢复和人工确认点；先写契约草稿。

## 限制
阶段越多维护成本越高；简单任务无需强行拆分，Schema通过也不证明内容真实。
本条为方法整理，未做逐平台实测，不代表来源项目的效果背书。个人上下文与真实业务材料由使用者自行管理。

## 来源与整理说明
依据[公开趋势工作流 Skill](https://github.com/zhanglunet/trend-workflow/blob/1bd65fa15470099e05afd0c289036c8dcd067fed/SKILL.md)中的流程与 PLAYBOOK 摘要重新编写，来源代码与技能许可为 MIT。原作：zhanglunet，Copyright (c) 2026。未复制第三方实现或原站效果数字。新增操作说明与合成示例采用 CC BY 4.0。公开背景：[趋势看板工作流介绍](https://trend.zhanglu.net/workflow)。
